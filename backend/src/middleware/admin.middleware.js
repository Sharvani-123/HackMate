/**
 * Admin middleware to check if user has admin privileges
 */

const isAdmin = (req, res, next) => {
    try {
        // Get the user email from the verified Firebase token
        const userEmail = req.user.email;
        // Get admin emails from environment variables
        const adminEmailsString = process.env.ADMIN_EMAILS || '';
        const adminEmails = adminEmailsString.split(',').map(email => email.trim()).filter(email => email);
        
        // Fallback check if no admin emails are configured
        if (adminEmails.length === 0) {
            console.error('No admin emails configured in environment variables');
            return res.status(500).json({
                success: false,
                message: 'Admin configuration error'
            });
        }
        
        if (!adminEmails.includes(userEmail)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error checking admin privileges',
            error: error.message
        });
    }
};

module.exports = {
    isAdmin
};