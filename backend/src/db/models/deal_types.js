const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const deal_types = sequelize.define(
    'deal_types',
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

  deal_types.associate = (db) => {
    db.deal_types.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.deal_types.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return deal_types;
};
