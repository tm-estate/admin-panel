const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Property_typesDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const property_types = await db.property_types.create(
      {
        id: data.id || undefined,

        titleRu: data.titleRu || null,
        titleEn: data.titleEn || null,
        titleTm: data.titleTm || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return property_types;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const property_types = await db.property_types.findByPk(id, {
      transaction,
    });

    await property_types.update(
      {
        titleRu: data.titleRu || null,
        titleEn: data.titleEn || null,
        titleTm: data.titleTm || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return property_types;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const property_types = await db.property_types.findByPk(id, options);

    await property_types.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await property_types.destroy({
      transaction,
    });

    return property_types;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const property_types = await db.property_types.findOne(
      { where },
      { transaction },
    );

    if (!property_types) {
      return property_types;
    }

    const output = property_types.get({ plain: true });

    return output;
  }

  static async findAll(filter, options) {
    var limit = filter.limit || 0;
    var offset = 0;
    const currentPage = +filter.page;

    offset = currentPage * limit;

    var orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.titleRu) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('property_types', 'titleRu', filter.titleRu),
        };
      }

      if (filter.titleEn) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('property_types', 'titleEn', filter.titleEn),
        };
      }

      if (filter.titleTm) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('property_types', 'titleTm', filter.titleTm),
        };
      }

      if (
        filter.active === true ||
        filter.active === 'true' ||
        filter.active === false ||
        filter.active === 'false'
      ) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    let { rows, count } = options?.countOnly
      ? {
          rows: [],
          count: await db.property_types.count({
            where,
            include,
            distinct: true,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            order:
              filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction,
          }),
        }
      : await db.property_types.findAndCountAll({
          where,
          include,
          distinct: true,
          limit: limit ? Number(limit) : undefined,
          offset: offset ? Number(offset) : undefined,
          order:
            filter.field && filter.sort
              ? [[filter.field, filter.sort]]
              : [['createdAt', 'desc']],
          transaction,
        });

    //    rows = await this._fillWithRelationsAndFilesForRows(
    //      rows,
    //      options,
    //    );

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit) {
    let where = {};

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('property_types', 'id', query),
        ],
      };
    }

    const records = await db.property_types.findAll({
      attributes: ['id', 'id'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['id', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.id,
    }));
  }
};
