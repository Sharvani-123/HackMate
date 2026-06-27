# HackMate

HackMate is a hackathon discovery and team formation platform. The current repository contains a Node.js/Express backend with MongoDB models, Firebase authentication, team workflows, notifications, Redis-backed caching, and early Socket.io support. A React/Vite frontend is present in the repository, but it is still in progress, so this README focuses on the backend API.

## Features

- Firebase ID token authentication for protected API routes
- User profile creation, profile lookup, and profile updates
- Hackathon listing with filtering, search, sorting, pagination, and tag lookup
- Admin-only hackathon management
- Team creation, discovery, member requests, approval/rejection, status updates, and team deletion
- Notification APIs for unread counts and read status
- Redis cache middleware for selected read routes
- Socket.io setup for user rooms, typing events, messages, and notification delivery hooks

## Tech Stack

| Layer | Technology |
| --- | --- |
| Backend runtime | Node.js |
| API framework | Express.js |
| Database | MongoDB, Mongoose |
| Authentication | Firebase Admin SDK |
| Cache | Redis, ioredis |
| Realtime | Socket.io |
| Validation | express-validator |
| Security and logging | Helmet, CORS, Morgan, express-rate-limit, Winston |
| Frontend | React, Vite, Firebase, Tailwind CSS |

## Repository Structure

```text
HackMate/
|-- backend/
|   |-- server.js
|   |-- package.json
|   |-- src/
|   |   |-- app.js
|   |   |-- config/
|   |   |   |-- db.js
|   |   |   |-- environment.js
|   |   |   `-- redis.js
|   |   |-- controllers/
|   |   |   |-- admin.controller.js
|   |   |   |-- hackathon.controller.js
|   |   |   |-- message.controller.js
|   |   |   |-- notification.controller.js
|   |   |   |-- team.controller.js
|   |   |   `-- user.controller.js
|   |   |-- middleware/
|   |   |   |-- admin.middleware.js
|   |   |   |-- auth.middleware.js
|   |   |   |-- cache.middleware.js
|   |   |   |-- rateLimiter.middleware.js
|   |   |   `-- validation.middleware.js
|   |   |-- models/
|   |   |   |-- Hackathon.js
|   |   |   |-- Message.js
|   |   |   |-- Notification.js
|   |   |   |-- Team.js
|   |   |   `-- User.js
|   |   |-- routes/
|   |   |   |-- admin.route.js
|   |   |   |-- hackathons.route.js
|   |   |   |-- messages.route.js
|   |   |   |-- notification.route.js
|   |   |   |-- teams.route.js
|   |   |   `-- users.route.js
|   |   |-- services/
|   |   `-- utils/
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- utils/
|   |   |-- App.jsx
|   |   `-- firebase.js
|   |-- package.json
|   `-- vite.config.js
`-- README.md
```

## API Overview

Most routes are protected with Firebase authentication. Send the Firebase ID token in the request header:

```http
Authorization: Bearer <firebase_id_token>
```

### Health Check

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/` | Confirms the server is running |

### Users

Base path: `/api/users`

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/profile` | Create the authenticated user's profile |
| GET | `/profile` | Get the authenticated user's profile |
| PATCH | `/profile` | Update the authenticated user's profile |
| GET | `/college/:university` | Get users from a university who are open to teaming up |

### Hackathons

Base path: `/api/hackathons`

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/` | List hackathons with pagination, filters, search, and sorting |
| GET | `/tags` | Get available hackathon tags |
| GET | `/:id` | Get one hackathon by ID |

Supported query parameters for `GET /api/hackathons`:

| Parameter | Description |
| --- | --- |
| `page` | Page number, defaults to `1` |
| `limit` | Items per page, defaults to `12` |
| `college` | Filter by `Same College` or `Cross College` |
| `tag` | Filter by one tag |
| `teamSize` | Filter by team size such as `1-3`, `2-4`, `3-4`, or `5-6` |
| `search` | Search by hackathon name or tag |
| `sortBy` | Field to sort by, defaults to `deadline` |
| `sortOrder` | `asc` or `desc`, defaults to `asc` |

### Teams

Base path: `/api/teams`

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/` | List available teams with filters and pagination |
| POST | `/` | Create a team |
| GET | `/my-teams` | Get teams created by or joined by the authenticated user |
| GET | `/:teamId` | Get team details |
| POST | `/:teamId/request` | Request to join a team |
| GET | `/:teamId/requests` | Get pending join requests for a team |
| PUT | `/:teamId/approve/:userId` | Approve a join request |
| PUT | `/:teamId/reject/:userId` | Reject a join request |
| DELETE | `/:teamId/leave` | Leave a team |
| DELETE | `/:teamId` | Delete a team |
| PATCH | `/:teamId/status` | Mark a team as full or available |
| PATCH | `/:teamId` | Update team details |

Supported query parameters for `GET /api/teams`:

| Parameter | Description |
| --- | --- |
| `page` | Page number, defaults to `1` |
| `limit` | Items per page, defaults to `10` |
| `hackathonType` | Filter by `Same College` or `Cross College` |
| `hackathonName` | Filter by hackathon name |

### Notifications

Base path: `/api/notifications`

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/` | Get recent notifications for the authenticated user |
| GET | `/unread-count` | Get unread notification count |
| PATCH | `/mark-all-read` | Mark all notifications as read |
| PATCH | `/:id/read` | Mark one notification as read |

### Admin

Base path: `/api/admin`

Admin routes require a valid Firebase token and an email listed in `ADMIN_EMAILS`.

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/hackathons` | Create a hackathon |
| GET | `/hackathons` | List all hackathons for admin use |
| GET | `/hackathons/:id` | Get one hackathon for admin use |
| PATCH | `/hackathons/:id` | Update a hackathon |
| DELETE | `/hackathons/:id` | Delete a hackathon |

### Messages

The repository includes `backend/src/routes/messages.route.js` and `backend/src/controllers/message.controller.js` for direct user-to-user messages:

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/messages/inbox` | Get latest message per conversation |
| GET | `/api/messages/:userId` | Get a paginated conversation with one user |
| POST | `/api/messages` | Send a message |
| DELETE | `/api/messages/:messageId` | Delete a sent message |

These routes are not currently registered in `backend/src/app.js`, so they must be mounted before they are available from the running API.

## Setup

### Prerequisites

- Node.js 18 or newer
- MongoDB connection string
- Redis running locally on `127.0.0.1:6379`
- Firebase project with a service account JSON file

### Backend Installation

```bash
git clone https://github.com/Sharvani-123/HackMate.git
cd HackMate/backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173
ADMIN_EMAILS=admin@example.com
RESEND_API_KEY=your_resend_api_key
```

Add your Firebase Admin service account file at:

```text
backend/src/config/firebase-service-account.json
```

### Run the Backend

```bash
npm run dev
```

The API runs at:

```text
http://localhost:5000
```

For production:

```bash
npm start
```

## Frontend Status

The `frontend/` folder contains a React/Vite app with pages for home, sign-in, profile creation, teams, hackathons, about, and contact. It is still incomplete, so the main documented surface of this repository is the backend API.

To run the frontend during development:

```bash
cd frontend
npm install
npm run dev
```

## Notes

- Redis is configured directly in `backend/src/config/redis.js` for local development.
- Firebase token verification is handled by `backend/src/middleware/auth.middleware.js`.
- Admin access is controlled by the comma-separated `ADMIN_EMAILS` environment variable.
- Socket.io events are defined in `backend/server.js` for joining user rooms and typing indicators.

## Author

**Sharvani**

- GitHub: [Sharvani-123](https://github.com/Sharvani-123)
- Repository: [Sharvani-123/HackMate](https://github.com/Sharvani-123/HackMate)
- LinkedIn: [sharvani123](https://www.linkedin.com/in/sharvani123)
