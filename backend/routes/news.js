const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all news articles (public)
router.get('/', async (req, res) => {
  try {
    const news = await db.all(`
      SELECT * FROM news 
      ORDER BY publish_date DESC, created_at DESC
    `);
    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Get single news article (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const article = await db.get('SELECT * FROM news WHERE id = ?', [id]);
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// Create news article (admin only)
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('title').trim().isLength({ min: 1, max: 255 }),
  body('publish_date').isLength({ min: 1 }),
  body('short_description').trim().isLength({ min: 1, max: 500 }),
  body('full_content').trim().isLength({ min: 1 }),
  body('image_url').optional().isURL()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, publish_date, short_description, full_content, image_url } = req.body;

    const result = await db.run(`
      INSERT INTO news (title, publish_date, short_description, full_content, image_url)
      VALUES (?, ?, ?, ?, ?)
    `, [title, publish_date, short_description, full_content, image_url || null]);

    const newArticle = await db.get('SELECT * FROM news WHERE id = ?', [result.id]);
    res.status(201).json(newArticle);
  } catch (error) {
    console.error('Error creating news article:', error);
    res.status(500).json({ error: 'Failed to create article' });
  }
});

// Update news article (admin only)
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('title').optional().trim().isLength({ min: 1, max: 255 }),
  body('publish_date').optional().isLength({ min: 1 }),
  body('short_description').optional().trim().isLength({ min: 1, max: 500 }),
  body('full_content').optional().trim().isLength({ min: 1 }),
  body('image_url').optional().isURL()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updates = req.body;

    // Check if article exists
    const existing = await db.get('SELECT id FROM news WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Build dynamic update query
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), new Date().toISOString(), id];

    await db.run(`
      UPDATE news 
      SET ${fields}, updated_at = ?
      WHERE id = ?
    `, values);

    const updatedArticle = await db.get('SELECT * FROM news WHERE id = ?', [id]);
    res.json(updatedArticle);
  } catch (error) {
    console.error('Error updating news article:', error);
    res.status(500).json({ error: 'Failed to update article' });
  }
});

// Delete news article (admin only)
router.delete('/:id', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.run('DELETE FROM news WHERE id = ?', [id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting news article:', error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

module.exports = router;