// import models
const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment')

// create associations
User.hasMany(Post, {
    foreignKey: 'user_id'
});

Post.belongsTo(User, {
    foreignKey: 'user_id',
    // delete all posts by user if user is deleted
    onDelete: 'cascade'
})

Comment.belongsTo(User, {
    foreignKey: 'user_id'
});
  
Comment.belongsTo(Post, {
    foreignKey: 'post_id',
    // delete all comments when post is deleted
    onDelete: 'cascade'
});
  
User.hasMany(Comment, {
    foreignKey: 'user_id'
});
  
Post.hasMany(Comment, {
    foreignKey: 'post_id'
});

module.exports = { User, Post, Comment };