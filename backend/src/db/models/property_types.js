const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const property_types = sequelize.define(
    'property_types',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      titleRu: {
        type: DataTypes.TEXT,
      },

      titleEn: {
        type: DataTypes.TEXT,
      },

      titleTm: {
        type: DataTypes.TEXT,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  property_types.associate = (db) => {
    db.property_types.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.property_types.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return property_types;
};
