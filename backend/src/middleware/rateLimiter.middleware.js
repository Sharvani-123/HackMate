const { rateLimit, ipKeyGenerator } = require('express-rate-limit');


const keyGenerator= (req) =>req.user?.uid || ipKeyGenerator(req);

const globalLimiter= rateLimit({
    windowMs:15*60*1000,
    max:70,
    keyGenerator,
    standardHeaders: true,
    legacyHeaders: false,
    message:{
        success: false,
        message: 'Too many requests, please try again later.',
    },
    statusCode: 429,
});

const teamCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  keyGenerator,
  message: {
    success: false,
    message: "Too many teams created. Try later."
  },
  statusCode: 429,
});

module.exports= {globalLimiter,teamCreationLimiter};