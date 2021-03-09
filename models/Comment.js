// Model and Datatypes from the sequelize package
const { Model, DataTypes } = require('sequelize');
// the connection to MySQL
const sequelize = require('../config/connection');

// create the comment model
class Comment extends Model {}

// create feilds/columns for the comment model
Comment.init(
  {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true            
        },
        comment_text: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // the comment must be at least 1 character long
                len: [1]
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'post',
                key: 'id'
            }
        }
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'comment'
  }
);

module.exports = Comment;