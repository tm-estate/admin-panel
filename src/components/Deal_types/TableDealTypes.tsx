import React, { useEffect } from 'react';
import { getDealTypes, deleteDealType } from '@/stores/thunks/deal-types';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import BaseTable from '@/components/UI/BaseTable';
import dataFormatter from '@/helpers/dataFormatter';

const TableDealTypes = () => {
  const dispatch = useAppDispatch();

  // Get data from Redux store
  const {
    deal_types,
    loading,
    count,
    notify: deal_typesNotify,
  } = useAppSelector((state) => state.deal_types);

  // Column configuration
  const columns = [
    { field: 'titleRu', label: 'Title Ru', sortable: true },
    { field: 'titleEn', label: 'Title En', sortable: true },
    { field: 'titleTm', label: 'Title Tm', sortable: true },
    { field: 'createdAt', label: 'Created At', sortable: true, formatter: 'date' },
    { field: 'updatedAt', label: 'Updated At', sortable: true, formatter: 'date' }
  ];

  // Load data with query parameters
  const loadDealTypes = ({ page, limit, sort, field }) => {
    const query = `?page=${page}&limit=${limit}&sort=${sort}&field=${field}`;
    dispatch(getDealTypes(query));
  };

  // Initial data load
  useEffect(() => {
    loadDealTypes({ page: 1, limit: 10, sort: 'desc', field: '' });
  }, [dispatch]);

  // Delete handler
  const handleDelete = (id) => {
    return dispatch(deleteDealType(id));
  };

  return (
      <BaseTable
          items={deal_types}
          loading={loading}
          count={count}
          columns={columns}
          entityPath="deal_types"
          onDelete={handleDelete}
          onLoad={loadDealTypes}
          notifyState={deal_typesNotify}
          formatters={{
            date: (value) => dataFormatter.dateFormatter(value)
          }}
      />
  );
};

export default TableDealTypes;
