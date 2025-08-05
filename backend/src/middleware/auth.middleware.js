const admin= require('firebase-admin');

const serviceAccount = require('../config/firebase-service-account.json');

if(!admin.apps.length){
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const verifyFirebaseToken = async (req, res, next) => {
  try {
    // Get token from Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided or invalid format'
      });
    }

    const token = authHeader.split(' ')[1];
     // Verify the token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Add user info to request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified
    };
     next();
    }
    catch(error){
        console.error('Token verification failed:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
            error: error.message
        });
    }
};


module.exports= {verifyFirebaseToken};

