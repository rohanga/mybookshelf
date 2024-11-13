const Redis = require('ioredis');

const redis = new Redis("redis://red-csqcpatds78s73d2apu0:6379")
  
redis.connect(()=>console.log("Redis connection"))

module.exports=redis
