const db = require('../db/models');
const Property_typesDBApi = require('../db/api/property_types');

module.exports = class Property_typesService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      await Property_typesDBApi.create(data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  static async update(data, id, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      let property_types = await Property_typesDBApi.findBy(
        { id },
        { transaction },
      );

      if (!property_types) {
        throw new ValidationError('property_typesNotFound');
      }

      await Property_typesDBApi.update(id, data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
      return property_types;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async remove(id, currentUser) {
    const transaction = await db.sequelize.transaction();

    try {
      if (currentUser.role !== 'admin') {
        throw new ValidationError('errors.forbidden.message');
      }

      await Property_typesDBApi.remove(id, {
        currentUser,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
