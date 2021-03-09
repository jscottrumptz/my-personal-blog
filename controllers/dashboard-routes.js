const router = require('express').Router();

// dashboard
router.get('/', (req, res) => {
    // to console-log the session variables
    console.log("DASHBOARD" + req.session);
})

module.exports = router;