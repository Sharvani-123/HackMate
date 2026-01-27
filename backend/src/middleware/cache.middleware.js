const redis= require('../config/redis');

const cache= (ttl)=>{
    return async (req, res,next)=>{
        const key= req.originalUrl;
        const cachedData= await redis.get(key);

        if(cachedData){
            return res.status(200).json(JSON.parse(cachedData));
        }

        const originalJson = res.json.bind(res);

        res.json = (body) => {
            redis.set(key, JSON.stringify(body), 'EX', ttl);
            return originalJson(body);
        };

        next();
    }
}

module.exports= cache;