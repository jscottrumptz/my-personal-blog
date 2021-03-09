const router = require('express').Router();

// comment
router.get('/', (req, res) => {
    // to console-log the session variables
    console.log("COMMENT" + req.session);
})

module.exports = router;