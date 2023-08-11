const db = require('../db/models');
const Deal_typesDBApi = require('../db/api/deal_types');

module.exports = class Deal_typesService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      await Deal_typesDBApi.create(data, {
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
      let deal_types = await Deal_typesDBApi.findBy({ id }, { transaction });

      if (!deal_types) {
        throw new ValidationError('deal_typesNotFound');
      }

      await Deal_typesDBApi.update(id, data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
      return deal_types;
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

      await Deal_typesDBApi.remove(id, {
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
