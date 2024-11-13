const worker = require("../helper/get-book").worker;
const redis = require("../cache"); // Import Redis client from the cache folder

exports.getBook = (req, res) => {
  try {
    if (!req.params) {
      return res.status(400).send("Request body is missing");
    }

    const cacheKey = `book:${req.params.bookId}`; // Unique cache key based on bookId

    // Step 1: Check Redis for cached book data
    redis.get(cacheKey, (err1, cachedBook) => {
      if (err1) {
        console.error("Error checking Redis cache:", err1);
      }

      if (cachedBook) {
        // Cache hit: Return the cached book data
        console.log("Cache hit for cachedBook:", cachedBook);

        console.log("Cache hit for book:", req.params.bookId);
        return res.status(200).json(JSON.parse(cachedBook)); // Send cached data as response


      } else {
        worker(

          req.params,
          (err, result) => {
            console.log("Inside worker")
            if (err.status !== 200) {
              res.statusMessage = err.message;
              return res.status(err.status).send(err.message);
            }
            // Step 3: Cache the result in Redis for future requests
            redis.setex(cacheKey, 3600, JSON.stringify(result)); // Cache the book for 1 hour (3600 seconds)

            res.write(JSON.stringify(result));
            res.end();
          }
        );
      }
    })


  } catch (error) {
    res.status(500).send("Internal server error");
  }
};
