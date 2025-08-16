const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { validateTeamCreation,validateTeamUpdate } = require('../middleware/validation.middleware');

// Protected routes
router.use(authenticateToken);

// GET /api/teams - Get all teams with filtering
router.get('/', teamController.getAllTeams);

// POST /api/teams - Create new team
router.post('/', validateTeamCreation, teamController.createTeam);

// GET /api/teams/my-teams - Get user's teams
router.get('/my-teams', teamController.getMyTeams);


// GET /api/teams/:teamId - Get team by ID
router.get('/:teamId', teamController.getTeamById);

// POST /api/teams/:teamId/request - Request to join team
router.post('/:teamId/request', teamController.requestToJoin);

// PUT /api/teams/:teamId/approve/:userId - Approve join request
router.put('/:teamId/approve/:userId', teamController.approveRequest);

// GET /api/teams/:teamId/requests - Get pending requests
router.get('/:teamId/requests', teamController.getPendingRequests);

// PUT /api/teams/:teamId/reject/:userId - Reject join request
router.put('/:teamId/reject/:userId', teamController.rejectRequest);

// DELETE /api/teams/:teamId/leave - Leave team
router.delete('/:teamId/leave', teamController.leaveTeam);

// DELETE /api/teams/:teamId - Delete team
router.delete('/:teamId', teamController.deleteTeam);

// PATCH /api/teams/:teamId/status - Update team status
router.patch('/:teamId/status', teamController.updateTeamStatus);

// PATCH /api/teams/:teamId - Edit team details
router.patch('/:teamId', validateTeamUpdate, teamController.updateTeam);

module.exports = router;
