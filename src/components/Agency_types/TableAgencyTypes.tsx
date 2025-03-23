import React, { useEffect } from 'react';
import { getAgencyTypes, deleteAgencyType } from '@/stores/thunks/agency-types';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import BaseTable from '@/components/UI/BaseTable';

const TableAgencyTypes = () => {
  const dispatch = useAppDispatch();

  // Get data from Redux store
  const {
    agency_types,
    loading,
    count,
    notify: agency_typesNotify,
  } = useAppSelector((state) => state.agency_types);

  // Column configuration
  const columns = [
    { field: 'titleRu', label: 'Title Ru', sortable: true },
    { field: 'titleEn', label: 'Title En', sortable: true },
    { field: 'titleTm', label: 'Title Tm', sortable: true },
    { field: 'createdAt', label: 'Created At', sortable: true },
    { field: 'updatedAt', label: 'Updated At', sortable: true }
  ];

  // Load data with query parameters
  const loadAgencyTypes = ({ page, limit, sort, field }) => {
    const query = `?page=${page}&limit=${limit}&sort=${sort}&field=${field}`;
    dispatch(getAgencyTypes(query));
  };

  // Initial data load
  useEffect(() => {
    loadAgencyTypes({ page: 1, limit: 10, sort: 'desc', field: '' });
  }, [dispatch]);

  // Delete handler
  const handleDelete = (id) => {
    return dispatch(deleteAgencyType(id));
  };

  return (
      <BaseTable
          items={agency_types}
          loading={loading}
          count={count}
          columns={columns}
          entityPath="agency_types"
          onDelete={handleDelete}
          onLoad={loadAgencyTypes}
          notifyState={agency_typesNotify}
          formatters={{}}
      />
  );
};

export default TableAgencyTypes;
