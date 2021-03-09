const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

// homepage
router.get('/', (req, res) => {
    // to console-log the session variables
    Post.findAll({
    attributes: [
        'id',
        'content',
        'title',
        'created_at'
    ],
    include: [
        {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
            model: User,
            attributes: ['username']
        }
        },
        {
        model: User,
        attributes: ['username']
        }
    ]
    })
    .then(dbPostData => {
        // This will loop over and map each Sequelize object 
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('homepage', {
            posts,
            // also pass a session variable to the template
            loggedIn: req.session.loggedIn
          });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// login
router.get('/login', (req, res) => {
    console.log("TESTING" + req.session);
    // redirect to homepage if login session exists
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

// post viewer
router.get('/post/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'content',
            'title',
            'created_at'
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }

        // serialize the data
        const post = dbPostData.get({ plain: true });
    
        // pass data with a session variable to the template
        res.render('single-post', {
            post,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;