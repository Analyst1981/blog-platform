const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Post = require('./Post');

const Category = sequelize.define('Category', {
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
  description: {
    type: DataTypes.TEXT,
    allowNull: true
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
  tableName: 'categories',
  timestamps: true
});

// 定义关联
Category.belongsToMany(Post, {
  through: 'post_categories',
  foreignKey: 'category_id',
  otherKey: 'post_id'
});

module.exports = Category;