const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all courses (public)
router.get('/', async (req, res) => {
  try {
    const courses = await db.all(`
      SELECT * FROM courses 
      ORDER BY created_at DESC
    `);
    
    // Parse topics JSON for each course
    const coursesWithParsedTopics = courses.map(course => ({
      ...course,
      details: {
        duration: course.duration,
        certification: course.certification,
        topics: JSON.parse(course.topics || '[]')
      },
      registrationEnabled: Boolean(course.registration_enabled)
    }));
    
    res.json(coursesWithParsedTopics);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get single course (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const course = await db.get('SELECT * FROM courses WHERE id = ?', [id]);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    const courseWithParsedTopics = {
      ...course,
      details: {
        duration: course.duration,
        certification: course.certification,
        topics: JSON.parse(course.topics || '[]')
      },
      registrationEnabled: Boolean(course.registration_enabled)
    };
    
    res.json(courseWithParsedTopics);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// Create course (admin only)
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('title').trim().isLength({ min: 1, max: 255 }),
  body('description').trim().isLength({ min: 1 }),
  body('audience').trim().isLength({ min: 1 }),
  body('image_url').optional().isURL(),
  body('details.duration').trim().isLength({ min: 1 }),
  body('details.certification').trim().isLength({ min: 1 }),
  body('details.topics').isArray(),
  body('registrationEnabled').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, audience, image_url, details, registrationEnabled } = req.body;

    const result = await db.run(`
      INSERT INTO courses (title, description, audience, image_url, duration, certification, topics, registration_enabled)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title, 
      description, 
      audience, 
      image_url || null, 
      details.duration, 
      details.certification, 
      JSON.stringify(details.topics),
      registrationEnabled ? 1 : 0
    ]);

    const newCourse = await db.get('SELECT * FROM courses WHERE id = ?', [result.id]);
    const courseWithParsedTopics = {
      ...newCourse,
      details: {
        duration: newCourse.duration,
        certification: newCourse.certification,
        topics: JSON.parse(newCourse.topics || '[]')
      },
      registrationEnabled: Boolean(newCourse.registration_enabled)
    };
    
    res.status(201).json(courseWithParsedTopics);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// Update course (admin only)
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('title').optional().trim().isLength({ min: 1, max: 255 }),
  body('description').optional().trim().isLength({ min: 1 }),
  body('audience').optional().trim().isLength({ min: 1 }),
  body('image_url').optional().isURL(),
  body('details.duration').optional().trim().isLength({ min: 1 }),
  body('details.certification').optional().trim().isLength({ min: 1 }),
  body('details.topics').optional().isArray(),
  body('registrationEnabled').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, audience, image_url, details, registrationEnabled } = req.body;

    // Check if course exists
    const existing = await db.get('SELECT id FROM courses WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Build update fields
    const updateFields = [];
    const updateValues = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (audience !== undefined) {
      updateFields.push('audience = ?');
      updateValues.push(audience);
    }
    if (image_url !== undefined) {
      updateFields.push('image_url = ?');
      updateValues.push(image_url);
    }
    if (details) {
      if (details.duration !== undefined) {
        updateFields.push('duration = ?');
        updateValues.push(details.duration);
      }
      if (details.certification !== undefined) {
        updateFields.push('certification = ?');
        updateValues.push(details.certification);
      }
      if (details.topics !== undefined) {
        updateFields.push('topics = ?');
        updateValues.push(JSON.stringify(details.topics));
      }
    }
    if (registrationEnabled !== undefined) {
      updateFields.push('registration_enabled = ?');
      updateValues.push(registrationEnabled ? 1 : 0);
    }

    updateFields.push('updated_at = ?');
    updateValues.push(new Date().toISOString());
    updateValues.push(id);

    await db.run(`
      UPDATE courses 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `, updateValues);

    const updatedCourse = await db.get('SELECT * FROM courses WHERE id = ?', [id]);
    const courseWithParsedTopics = {
      ...updatedCourse,
      details: {
        duration: updatedCourse.duration,
        certification: updatedCourse.certification,
        topics: JSON.parse(updatedCourse.topics || '[]')
      },
      registrationEnabled: Boolean(updatedCourse.registration_enabled)
    };
    
    res.json(courseWithParsedTopics);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// Delete course (admin only)
router.delete('/:id', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    // Check if there are participants registered for this course
    const participants = await db.get('SELECT COUNT(*) as count FROM participants WHERE course_id = ?', [id]);
    if (participants.count > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete course with registered participants. Please handle participants first.' 
      });
    }

    const result = await db.run('DELETE FROM courses WHERE id = ?', [id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

module.exports = router;