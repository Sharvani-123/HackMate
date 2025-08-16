const { body, validationResult } = require('express-validator');

// Generic validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }
  next();
};

// Team validation rules
const validateTeamCreation = [
  body('hackathonName')
    .notEmpty()
    .withMessage('Hackathon name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Hackathon name must be between 3 and 100 characters'),
  
  body('hackathonType')
    .isIn(['Same College', 'Cross College'])
    .withMessage('Hackathon type must be either "Same College" or "Cross College"'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  
  body('skills.*')
    .optional()
    .isString()
    .withMessage('Each skill must be a string'),
  
  handleValidationErrors //error handler
];


const validateTeamUpdate = [
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  
  body('skills.*')
    .optional()
    .isString()
    .withMessage('Each skill must be a string'),
    
  body('maxMembers')
    .optional()
    .isInt({ min: 2, max: 10 })
    .withMessage('Max members must be between 2 and 10'),
  
  handleValidationErrors
];


module.exports = {
  validateTeamCreation,
  validateTeamUpdate,  
  handleValidationErrors
};
