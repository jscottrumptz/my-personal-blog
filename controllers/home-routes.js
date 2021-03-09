const router = require('express').Router();

// homepage
router.get('/', (req, res) => {
    // to console-log the session variables
    console.log("HOMEPAGE" + req.session);
})

module.exports = router;