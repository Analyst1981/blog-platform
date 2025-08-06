const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Post = require('./Post');
const User = require('./User');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Post,
      key: 'id'
    },
    field: 'post_id'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    },
    field: 'user_id'
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'comments',
      key: 'id'
    },
    field: 'parent_id'
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    onUpdate: Sequelize.NOW
  }
}, {
  tableName: 'comments',
  timestamps: true,
  underscored: true
});

// 定义自关联（嵌套评论）
Comment.hasMany(Comment, {
  as: 'replies',
  foreignKey: 'parent_id'
});

// 定义关联
Comment.belongsTo(Post, { foreignKey: 'post_id' });
Comment.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Comment;