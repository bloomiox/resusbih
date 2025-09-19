const express = require('express');
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Track event (public)
router.post('/track', async (req, res) => {
  try {
    const { eventType, eventData } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    await db.run(`
      INSERT INTO analytics (event_type, event_data, ip_address, user_agent)
      VALUES (?, ?, ?, ?)
    `, [eventType, JSON.stringify(eventData || {}), ipAddress, userAgent]);

    res.json({ message: 'Event tracked successfully' });
  } catch (error) {
    console.error('Error tracking event:', error);
    res.status(500).json({ error: 'Failed to track event' });
  }
});

// Get analytics data (admin only)
router.get('/dashboard', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query;
    
    let dateFilter = '';
    const now = new Date();
    
    switch (timeRange) {
      case '7d':
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFilter = `WHERE created_at >= '${sevenDaysAgo.toISOString()}'`;
        break;
      case '30d':
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        dateFilter = `WHERE created_at >= '${thirtyDaysAgo.toISOString()}'`;
        break;
      case '90d':
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        dateFilter = `WHERE created_at >= '${ninetyDaysAgo.toISOString()}'`;
        break;
    }

    // Get basic metrics
    const totalEvents = await db.get(`
      SELECT COUNT(*) as count FROM analytics ${dateFilter}
    `);

    const uniqueVisitors = await db.get(`
      SELECT COUNT(DISTINCT ip_address) as count FROM analytics ${dateFilter}
    `);

    const eventsByType = await db.all(`
      SELECT event_type, COUNT(*) as count 
      FROM analytics ${dateFilter}
      GROUP BY event_type 
      ORDER BY count DESC
    `);

    // Get recent events
    const recentEvents = await db.all(`
      SELECT * FROM analytics 
      ORDER BY created_at DESC 
      LIMIT 100
    `);

    res.json({
      timeRange,
      metrics: {
        totalEvents: totalEvents.count,
        uniqueVisitors: uniqueVisitors.count,
        eventsByType,
        recentEvents: recentEvents.map(event => ({
          ...event,
          eventData: JSON.parse(event.event_data || '{}')
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

// Get course registration analytics (admin only)
router.get('/registrations', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const registrationsByMonth = await db.all(`
      SELECT 
        strftime('%Y-%m', registration_date) as month,
        COUNT(*) as count
      FROM participants 
      GROUP BY month 
      ORDER BY month DESC
      LIMIT 12
    `);

    const registrationsByCourse = await db.all(`
      SELECT 
        course_name,
        COUNT(*) as count
      FROM participants 
      GROUP BY course_name 
      ORDER BY count DESC
    `);

    const statusDistribution = await db.all(`
      SELECT 
        status,
        COUNT(*) as count
      FROM participants 
      GROUP BY status
    `);

    res.json({
      registrationsByMonth,
      registrationsByCourse,
      statusDistribution
    });
  } catch (error) {
    console.error('Error fetching registration analytics:', error);
    res.status(500).json({ error: 'Failed to fetch registration analytics' });
  }
});

module.exports = router;