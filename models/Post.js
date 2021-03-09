// Model and Datatypes from the sequelize package
const { Model, DataTypes } = require('sequelize');
// the connection to MySQL
const sequelize = require('../config/connection');

// create the post model
class Post extends Model {}

// create feilds/columns for the post model
Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // the title must be at least 1 character long
                len: [1]
            }
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // the content must be at least 1 character long
                len: [1]
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            // create a reference to the user model, specifically to the id column.
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        // do not pluralize the table name set it equal to the model name
        freezeTableName: true,
        // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
        underscored: true,
        // assign our model name (keep lowercase)
        modelName: 'post'
    }
);

module.exports = Post;