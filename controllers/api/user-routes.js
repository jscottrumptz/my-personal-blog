const router = require('express').Router();
const { User, Post, Comment } = require("../../models");

// GET /api/users
router.get('/', (req, res) => {
    // select all users from the user table in the database
    User.findAll({
        // exclude a field when getting data
        attributes: { exclude: ['password'] }
        })
        // and send it back as JSON
        .then(dbUserData => res.json(dbUserData))
        // if there is an err catch it and send a response
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// GET /api/users/1
router.get('/:id', (req, res) => {
    // only returns one user based on its req.params.id value
    User.findOne({
        // exclude a field when getting data
        attributes: { exclude: ['password'] },
        // define required param
        where: {
            id: req.params.id
        },
        include: [
            {
                // will come under the property name posts
                model: Post,
                attributes: ['id', 'title', 'content', 'created_at']
            },
                // include comment model here
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            }
        ]
    })
    // send a reply back as JSON
    .then(dbUserData => {
        // see if a user matched the id
        if (!dbUserData) {
            // if not, send a respone
            res.status(404).json({ message: 'No user found with this id'});
            return;
        }
        // if so, send the user data
        res.json(dbUserData);
    })
    // if there is an err catch it and send a response
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST /api/users
router.post('/', (req, res) => {
    // create a new user and add them to the user table in the database
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    // insert the new user into the db and send it back as a json
    .then(dbUserData => {
        // This gives our server easy access to the user's user_id, 
        // username, and a Boolean describing whether or not the user is logged in.
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;
            
            // send response as a json
            res.json(dbUserData);
        });
    })
    // if there is an err catch it and send a response
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// POST /api/login
router.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then (dbUserData => {
        if(!dbUserData) {
            res.status(400).json({ message: 'No user found with this email address'});
            return;
        }
        // verify user password using a method within our User class
        const validPassword = dbUserData.checkPassword(req.body.password);

        if(!validPassword) {
            res.status(400).json({ message: 'Incorrect Password!' });
            return;
        }
        // This gives our server easy access to the user's user_id, 
        // username, and a Boolean describing whether or not the user is logged in.
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;
            
            // send response as a json
            res.json({ user: dbUserData, message: 'You are now logged in!' });
        });
    }); 
});

// POST /api/logout
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
            });
        }
        else {
            res.status(404).end();
        }
});

// PUT /api/users/1
router.put('/:id', (req, res) => {
    // update a current user in the database
    User.update(req.body, {
        // option set to true to enable bcrypt hashing of passwords
        individualHooks: true,
        where: {
            id:req.params.id
        }
    })
    // send a reply back as JSON
    .then(dbUserData => {
        // see if a user matched the id
        if (!dbUserData[0]) {
            // if not, send a respone
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        // if so, update and send the data
        res.json(dbUserData);
    })
    // if there is an err catch it and send a response
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
})

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
    // removes a user from the database based on its req.params.id value
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    // send a reply back as JSON
    .then(dbUserData => {
        // see if a user matched the id
        if(!dbUserData) {
            // if not, send a respone
            res.status(404).json({ message: 'No user found with this id'});
            return;
        }
        // if so, send the data
        res.json(dbUserData);
    })
    // if there is an err catch it and send a response
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    });
});

module.exports = router;