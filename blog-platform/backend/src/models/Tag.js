const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Post = require('./Post');

const Tag = sequelize.define('Tag', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  slug: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
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
  tableName: 'tags',
  timestamps: true
});

// 定义关联
Tag.belongsToMany(Post, {
  through: 'post_tags',
  foreignKey: 'tag_id',
  otherKey: 'post_id'
});

module.exports = Tag;