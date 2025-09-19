const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all participants (admin only)
router.get('/', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const participants = await db.all(`
      SELECT p.*, c.title as course_title 
      FROM participants p
      LEFT JOIN courses c ON p.course_id = c.id
      ORDER BY p.created_at DESC
    `);
    
    // Convert database format to frontend format
    const formattedParticipants = participants.map(p => ({
      id: p.id,
      firstName: p.first_name,
      lastName: p.last_name,
      email: p.email,
      phone: p.phone,
      address: p.address,
      dateOfBirth: p.date_of_birth,
      profession: p.profession,
      courseId: p.course_id,
      courseName: p.course_name,
      registrationDate: p.registration_date,
      completionDate: p.completion_date,
      certificateIssued: Boolean(p.certificate_issued),
      certificateNumber: p.certificate_number,
      status: p.status,
      notes: p.notes
    }));
    
    res.json(formattedParticipants);
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ error: 'Failed to fetch participants' });
  }
});

// Get single participant (admin only)
router.get('/:id', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;
    const participant = await db.get(`
      SELECT p.*, c.title as course_title 
      FROM participants p
      LEFT JOIN courses c ON p.course_id = c.id
      WHERE p.id = ?
    `, [id]);
    
    if (!participant) {
      return res.status(404).json({ error: 'Participant not found' });
    }
    
    const formattedParticipant = {
      id: participant.id,
      firstName: participant.first_name,
      lastName: participant.last_name,
      email: participant.email,
      phone: participant.phone,
      address: participant.address,
      dateOfBirth: participant.date_of_birth,
      profession: participant.profession,
      courseId: participant.course_id,
      courseName: participant.course_name,
      registrationDate: participant.registration_date,
      completionDate: participant.completion_date,
      certificateIssued: Boolean(participant.certificate_issued),
      certificateNumber: participant.certificate_number,
      status: participant.status,
      notes: participant.notes
    };
    
    res.json(formattedParticipant);
  } catch (error) {
    console.error('Error fetching participant:', error);
    res.status(500).json({ error: 'Failed to fetch participant' });
  }
});

// Register for course (public)
router.post('/register', [
  body('firstName').trim().isLength({ min: 1, max: 100 }),
  body('lastName').trim().isLength({ min: 1, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('phone').trim().isLength({ min: 1, max: 20 }),
  body('courseId').isInt({ min: 1 }),
  body('address').optional().trim().isLength({ max: 500 }),
  body('dateOfBirth').optional().isISO8601(),
  body('profession').optional().trim().isLength({ max: 100 }),
  body('notes').optional().trim().isLength({ max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, phone, courseId, address, dateOfBirth, profession, notes } = req.body;

    // Verify course exists and registration is enabled
    const course = await db.get('SELECT * FROM courses WHERE id = ? AND registration_enabled = 1', [courseId]);
    if (!course) {
      return res.status(400).json({ error: 'Course not found or registration not enabled' });
    }

    // Check if user already registered for this course
    const existingRegistration = await db.get(
      'SELECT id FROM participants WHERE email = ? AND course_id = ?', 
      [email, courseId]
    );
    if (existingRegistration) {
      return res.status(400).json({ error: 'Already registered for this course' });
    }

    const result = await db.run(`
      INSERT INTO participants (
        first_name, last_name, email, phone, address, date_of_birth, 
        profession, course_id, course_name, registration_date, notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      firstName, lastName, email, phone, address || null, dateOfBirth || null,
      profession || null, courseId, course.title, new Date().toISOString().split('T')[0], notes || null
    ]);

    const newParticipant = await db.get('SELECT * FROM participants WHERE id = ?', [result.id]);
    
    res.status(201).json({
      message: 'Registration successful',
      participant: {
        id: newParticipant.id,
        firstName: newParticipant.first_name,
        lastName: newParticipant.last_name,
        email: newParticipant.email,
        courseName: newParticipant.course_name
      }
    });
  } catch (error) {
    console.error('Error registering participant:', error);
    res.status(500).json({ error: 'Failed to register for course' });
  }
});

// Create participant (admin only)
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('firstName').trim().isLength({ min: 1, max: 100 }),
  body('lastName').trim().isLength({ min: 1, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('phone').trim().isLength({ min: 1, max: 20 }),
  body('courseId').isInt({ min: 1 }),
  body('registrationDate').isISO8601(),
  body('status').optional().isIn(['registered', 'completed', 'cancelled'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      firstName, lastName, email, phone, courseId, courseName,
      registrationDate, completionDate, certificateNumber, 
      certificateIssued, status, address, dateOfBirth, profession, notes 
    } = req.body;

    const result = await db.run(`
      INSERT INTO participants (
        first_name, last_name, email, phone, address, date_of_birth, profession,
        course_id, course_name, registration_date, completion_date, 
        certificate_number, certificate_issued, status, notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      firstName, lastName, email, phone, address || null, dateOfBirth || null, profession || null,
      courseId, courseName, registrationDate, completionDate || null,
      certificateNumber || null, certificateIssued ? 1 : 0, status || 'registered', notes || null
    ]);

    const newParticipant = await db.get('SELECT * FROM participants WHERE id = ?', [result.id]);
    res.status(201).json(newParticipant);
  } catch (error) {
    console.error('Error creating participant:', error);
    res.status(500).json({ error: 'Failed to create participant' });
  }
});

// Update participant (admin only)
router.put('/:id', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if participant exists
    const existing = await db.get('SELECT id FROM participants WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Participant not found' });
    }

    // Convert frontend format to database format
    const dbUpdates = {};
    if (updates.firstName !== undefined) dbUpdates.first_name = updates.firstName;
    if (updates.lastName !== undefined) dbUpdates.last_name = updates.lastName;
    if (updates.email !== undefined) dbUpdates.email = updates.email;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
    if (updates.address !== undefined) dbUpdates.address = updates.address;
    if (updates.dateOfBirth !== undefined) dbUpdates.date_of_birth = updates.dateOfBirth;
    if (updates.profession !== undefined) dbUpdates.profession = updates.profession;
    if (updates.courseId !== undefined) dbUpdates.course_id = updates.courseId;
    if (updates.courseName !== undefined) dbUpdates.course_name = updates.courseName;
    if (updates.registrationDate !== undefined) dbUpdates.registration_date = updates.registrationDate;
    if (updates.completionDate !== undefined) dbUpdates.completion_date = updates.completionDate;
    if (updates.certificateNumber !== undefined) dbUpdates.certificate_number = updates.certificateNumber;
    if (updates.certificateIssued !== undefined) dbUpdates.certificate_issued = updates.certificateIssued ? 1 : 0;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

    // Build dynamic update query
    const fields = Object.keys(dbUpdates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(dbUpdates), new Date().toISOString(), id];

    await db.run(`
      UPDATE participants 
      SET ${fields}, updated_at = ?
      WHERE id = ?
    `, values);

    const updatedParticipant = await db.get('SELECT * FROM participants WHERE id = ?', [id]);
    res.json(updatedParticipant);
  } catch (error) {
    console.error('Error updating participant:', error);
    res.status(500).json({ error: 'Failed to update participant' });
  }
});

// Delete participant (admin only)
router.delete('/:id', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.run('DELETE FROM participants WHERE id = ?', [id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Participant not found' });
    }

    res.json({ message: 'Participant deleted successfully' });
  } catch (error) {
    console.error('Error deleting participant:', error);
    res.status(500).json({ error: 'Failed to delete participant' });
  }
});

module.exports = router;