const router = require('express').Router();

// post
router.get('/', (req, res) => {
    // to console-log the session variables
    console.log("POST" + req.session);
})

module.exports = router;