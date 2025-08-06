const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Tag = require('./Tag');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  content: {
    type: DataTypes.LONGTEXT,
    allowNull: false
  },
  cover_image: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    },
    field: 'user_id'
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'view_count'
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft'
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
  tableName: 'posts',
  timestamps: true,
  underscored: true
});

// 定义关联
Post.belongsTo(User, { foreignKey: 'user_id' });
Post.belongsToMany(Category, {
  through: 'post_categories',
  foreignKey: 'post_id',
  otherKey: 'category_id'
});
Post.belongsToMany(Tag, {
  through: 'post_tags',
  foreignKey: 'post_id',
  otherKey: 'tag_id'
});

module.exports = Post;