import React, { useEffect } from 'react';
import { getRegions, deleteRegion } from '@/stores/thunks/regions';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import dataFormatter from '@/helpers/dataFormatter';
import BaseTable from '@/components/UI/BaseTable';

const TableRegions = () => {
  const dispatch = useAppDispatch();

  // Get data from Redux store
  const {
    regions,
    loading,
    count,
    notify: regionsNotify,
  } = useAppSelector((state) => state.regions);

  // Column configuration
  const columns = [
    { field: 'titleEn', label: 'Title En', sortable: true },
    { field: 'titleRu', label: 'Title Ru', sortable: true },
    { field: 'titleTm', label: 'Title Tm', sortable: true },
    { field: 'cities', label: 'Cities', formatter: 'cities' },
  ];

  // Load data with query parameters
  const loadRegions = ({ page, limit, sort, field }) => {
    const query = `?page=${page}&limit=${limit}&sort=${sort}&field=${field}`;
    dispatch(getRegions(query));
  };

  // Initial data load
  useEffect(() => {
    loadRegions({ page: 1, limit: 10, sort: 'desc', field: '' });
  }, [dispatch]);

  // Delete handler
  const handleDelete = (id) => {
    return dispatch(deleteRegion(id));
  };

  // Function to safely convert any field to string
  const toSafeString = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    return '';
  };

  return (
      <BaseTable
          items={regions}
          loading={loading}
          count={count}
          columns={columns}
          entityPath="regions"
          onDelete={handleDelete}
          onLoad={loadRegions}
          notifyState={regionsNotify}
          formatters={{
            date: (value) => {
              if (!value) return '';
              return dataFormatter.dateFormatter(value);
            },
            cities: (value) => {
              if (!value) return '';
              if (!Array.isArray(value)) return '';

              return value
                  .map(item => {
                    if (!item) return '';
                    if (typeof item === 'string') return item;
                    return item.titleRu || '';
                  })
                  .filter(Boolean)
                  .join(', ');
            },
            // Fallback formatter for any other fields
            default: (value) => {
              if (value === null || value === undefined) return '';
              if (typeof value === 'object') {
                if (Array.isArray(value)) {
                  return value.map(toSafeString).filter(Boolean).join(', ');
                }
                return JSON.stringify(value);
              }
              return String(value);
            }
          }}
      />
  );
};

export default TableRegions;
