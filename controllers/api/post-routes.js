const router = require('express').Router();
const { Post, User, Comment } = require('../../models');

// our custom middleware
const withAuth = require('../../utils/auth');

// GET api/posts
router.get('/', (req,res) => {
    Post.findAll({
        attributes: [
            'id', 
            'content', 
            'title', 
            'created_at'
        ],
        // display the most recently added posts first.
        order: [['created_at', 'DESC']], 
        include: [
            // include the Comment model here:
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
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET api/posts/1
router.get('/:id', (req, res) => {
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
        // test if there is a post with that id
        if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST api/posts/
router.post('/', withAuth, (req, res) => {
    Post.create({
        title: req.body.title,
        content: req.body.content,
        // get user id from the session
        user_id: req.session.user_id
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// PUT api/posts/1
router.put('/:id', withAuth, (req,res) => {
    Post.update( {
            title: req.body.title,
            content: req.body.content
        },
        {
            where: {
            id: req.params.id
            }
        }
    )
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// DELETE api/posts/1
router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
        where: {
        id: req.params.id
        }
    })
    .then(dbPostData => {
        // see if there is a matching id
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;