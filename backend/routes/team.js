const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all team members (public)
router.get('/', async (req, res) => {
  try {
    const members = await db.all(`
      SELECT * FROM team_members 
      ORDER BY created_at ASC
    `);
    
    // Convert database format to frontend format
    const formattedMembers = members.map(member => ({
      id: member.id,
      name: member.name,
      role: member.role,
      spec: member.specialization,
      imageUrl: member.image_url
    }));
    
    res.json(formattedMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

// Get single team member (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const member = await db.get('SELECT * FROM team_members WHERE id = ?', [id]);
    
    if (!member) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    
    const formattedMember = {
      id: member.id,
      name: member.name,
      role: member.role,
      spec: member.specialization,
      imageUrl: member.image_url
    };
    
    res.json(formattedMember);
  } catch (error) {
    console.error('Error fetching team member:', error);
    res.status(500).json({ error: 'Failed to fetch team member' });
  }
});

// Create team member (admin only)
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('name').trim().isLength({ min: 1, max: 255 }),
  body('role').trim().isLength({ min: 1, max: 255 }),
  body('spec').trim().isLength({ min: 1, max: 255 }),
  body('imageUrl').optional().isURL()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, role, spec, imageUrl } = req.body;

    const result = await db.run(`
      INSERT INTO team_members (name, role, specialization, image_url)
      VALUES (?, ?, ?, ?)
    `, [name, role, spec, imageUrl || null]);

    const newMember = await db.get('SELECT * FROM team_members WHERE id = ?', [result.id]);
    
    const formattedMember = {
      id: newMember.id,
      name: newMember.name,
      role: newMember.role,
      spec: newMember.specialization,
      imageUrl: newMember.image_url
    };
    
    res.status(201).json(formattedMember);
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(500).json({ error: 'Failed to create team member' });
  }
});

// Update team member (admin only)
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('name').optional().trim().isLength({ min: 1, max: 255 }),
  body('role').optional().trim().isLength({ min: 1, max: 255 }),
  body('spec').optional().trim().isLength({ min: 1, max: 255 }),
  body('imageUrl').optional().isURL()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, role, spec, imageUrl } = req.body;

    // Check if member exists
    const existing = await db.get('SELECT id FROM team_members WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    // Build update fields
    const updateFields = [];
    const updateValues = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (role !== undefined) {
      updateFields.push('role = ?');
      updateValues.push(role);
    }
    if (spec !== undefined) {
      updateFields.push('specialization = ?');
      updateValues.push(spec);
    }
    if (imageUrl !== undefined) {
      updateFields.push('image_url = ?');
      updateValues.push(imageUrl);
    }

    updateFields.push('updated_at = ?');
    updateValues.push(new Date().toISOString());
    updateValues.push(id);

    await db.run(`
      UPDATE team_members 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `, updateValues);

    const updatedMember = await db.get('SELECT * FROM team_members WHERE id = ?', [id]);
    
    const formattedMember = {
      id: updatedMember.id,
      name: updatedMember.name,
      role: updatedMember.role,
      spec: updatedMember.specialization,
      imageUrl: updatedMember.image_url
    };
    
    res.json(formattedMember);
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({ error: 'Failed to update team member' });
  }
});

// Delete team member (admin only)
router.delete('/:id', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.run('DELETE FROM team_members WHERE id = ?', [id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ error: 'Failed to delete team member' });
  }
});

module.exports = router;