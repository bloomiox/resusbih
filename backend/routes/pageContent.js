const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all page content (public)
router.get('/', async (req, res) => {
  try {
    const content = await db.all('SELECT * FROM page_content');
    
    // Convert to frontend format
    const pageContent = {};
    content.forEach(item => {
      pageContent[item.page_key] = JSON.parse(item.content);
    });
    
    res.json(pageContent);
  } catch (error) {
    console.error('Error fetching page content:', error);
    res.status(500).json({ error: 'Failed to fetch page content' });
  }
});

// Get specific page content (public)
router.get('/:pageKey', async (req, res) => {
  try {
    const { pageKey } = req.params;
    const content = await db.get('SELECT * FROM page_content WHERE page_key = ?', [pageKey]);
    
    if (!content) {
      return res.status(404).json({ error: 'Page content not found' });
    }
    
    res.json(JSON.parse(content.content));
  } catch (error) {
    console.error('Error fetching page content:', error);
    res.status(500).json({ error: 'Failed to fetch page content' });
  }
});

// Update page content (admin only)
router.put('/:pageKey', [
  authenticateToken,
  requireAdmin,
  body('content').isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { pageKey } = req.params;
    const { content } = req.body;

    // Check if page content exists
    const existing = await db.get('SELECT id FROM page_content WHERE page_key = ?', [pageKey]);
    
    if (existing) {
      // Update existing content
      await db.run(`
        UPDATE page_content 
        SET content = ?, updated_at = ?
        WHERE page_key = ?
      `, [JSON.stringify(content), new Date().toISOString(), pageKey]);
    } else {
      // Create new content
      await db.run(`
        INSERT INTO page_content (page_key, content)
        VALUES (?, ?)
      `, [pageKey, JSON.stringify(content)]);
    }

    const updatedContent = await db.get('SELECT * FROM page_content WHERE page_key = ?', [pageKey]);
    res.json({
      pageKey: updatedContent.page_key,
      content: JSON.parse(updatedContent.content)
    });
  } catch (error) {
    console.error('Error updating page content:', error);
    res.status(500).json({ error: 'Failed to update page content' });
  }
});

// Delete page content (admin only)
router.delete('/:pageKey', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const { pageKey } = req.params;

    const result = await db.run('DELETE FROM page_content WHERE page_key = ?', [pageKey]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Page content not found' });
    }

    res.json({ message: 'Page content deleted successfully' });
  } catch (error) {
    console.error('Error deleting page content:', error);
    res.status(500).json({ error: 'Failed to delete page content' });
  }
});

module.exports = router;