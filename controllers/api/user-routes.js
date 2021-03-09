const router = require('express').Router();

// user
router.get('/', (req, res) => {
    // to console-log the session variables
    console.log("USER" + req.session);
})

module.exports = router;