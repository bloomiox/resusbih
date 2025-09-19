# RESUSBIH Backend API

A Node.js/Express backend API for the RESUSBIH website with SQLite database.

## Features

- **Authentication**: JWT-based admin authentication
- **News Management**: CRUD operations for news articles
- **Course Management**: Full course management with registration control
- **Team Management**: Team member profiles and information
- **CRM System**: Course participant management and registration
- **Page Content**: Dynamic page content management
- **Analytics**: Basic analytics and tracking
- **Security**: Rate limiting, CORS, input validation

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Initialize Database
```bash
npm run init-db
```

### 4. Start Server
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token
- `POST /api/auth/logout` - Logout

### News (Public read, Admin write)
- `GET /api/news` - Get all news
- `GET /api/news/:id` - Get single news article
- `POST /api/news` - Create news (admin)
- `PUT /api/news/:id` - Update news (admin)
- `DELETE /api/news/:id` - Delete news (admin)

### Courses (Public read, Admin write)
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create course (admin)
- `PUT /api/courses/:id` - Update course (admin)
- `DELETE /api/courses/:id` - Delete course (admin)

### Team (Public read, Admin write)
- `GET /api/team` - Get all team members
- `GET /api/team/:id` - Get single team member
- `POST /api/team` - Create team member (admin)
- `PUT /api/team/:id` - Update team member (admin)
- `DELETE /api/team/:id` - Delete team member (admin)

### Participants (Admin only, except registration)
- `POST /api/participants/register` - Public course registration
- `GET /api/participants` - Get all participants (admin)
- `GET /api/participants/:id` - Get single participant (admin)
- `POST /api/participants` - Create participant (admin)
- `PUT /api/participants/:id` - Update participant (admin)
- `DELETE /api/participants/:id` - Delete participant (admin)

### Page Content (Public read, Admin write)
- `GET /api/page-content` - Get all page content
- `GET /api/page-content/:pageKey` - Get specific page content
- `PUT /api/page-content/:pageKey` - Update page content (admin)

### Analytics (Admin only, except tracking)
- `POST /api/analytics/track` - Track event (public)
- `GET /api/analytics/dashboard` - Get analytics dashboard (admin)
- `GET /api/analytics/registrations` - Get registration analytics (admin)

## Database Schema

### Users
- Admin authentication and user management

### News
- News articles with title, content, images, and publish dates

### Courses
- Course information with details, topics, and registration settings

### Team Members
- Team member profiles with roles and specializations

### Participants
- Course registrations and participant management

### Page Content
- Dynamic page content for home, about, and contact pages

### Analytics
- Event tracking and analytics data

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive input validation and sanitization
- **CORS Protection**: Configurable CORS settings
- **Helmet Security**: Security headers with Helmet.js
- **SQL Injection Protection**: Parameterized queries

## Development

### Database Management
```bash
# Initialize/reset database
npm run init-db

# The database file is located at: ./database/resusbih.db
```

### Environment Variables
See `.env.example` for all available configuration options.

### Default Admin Credentials
- Email: `office@resusbih.org`
- Password: `AmelWeb1.1`

**⚠️ Change these in production!**

## Deployment

1. Set `NODE_ENV=production` in environment
2. Configure production database path
3. Set secure JWT secret
4. Configure CORS for production frontend URL
5. Set up reverse proxy (nginx recommended)
6. Enable HTTPS

## API Response Format

### Success Response
```json
{
  "data": "...",
  "message": "Success message (optional)"
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": "Additional error details (development only)"
}
```

## Contributing

1. Follow existing code style
2. Add proper error handling
3. Include input validation
4. Update documentation
5. Test all endpoints

## License

MIT License - see LICENSE file for details.