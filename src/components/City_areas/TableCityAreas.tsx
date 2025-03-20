import React, { useEffect } from 'react';
import { getCityAreas, deleteCityArea } from '@/stores/thunks/city-areas';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import BaseTable from '@/components/UI/BaseTable';
import dataFormatter from '@/helpers/dataFormatter';

const TableCityAreas = () => {
  const dispatch = useAppDispatch();

  // Get data from Redux store
  const {
    city_areas,
    loading,
    count,
    notify: city_areasNotify,
  } = useAppSelector((state) => state.city_areas);

  // Column configuration
  const columns = [
    { field: 'titleEn', label: 'Title En', sortable: true },
    { field: 'titleRu', label: 'Title Ru', sortable: true },
    { field: 'titleTm', label: 'Title Tm', sortable: true }
  ];

  // Load data with query parameters
  const loadCityAreas = ({ page, limit, sort, field }) => {
    const query = `?page=${page}&limit=${limit}&sort=${sort}&field=${field}`;
    dispatch(getCityAreas(query));
  };

  // Initial data load
  useEffect(() => {
    loadCityAreas({ page: 1, limit: 10, sort: 'desc', field: '' });
  }, [dispatch]);

  // Delete handler
  const handleDelete = (id) => {
    return dispatch(deleteCityArea(id));
  };

  return (
      <BaseTable
          items={city_areas}
          loading={loading}
          count={count}
          columns={columns}
          entityPath="city_areas"
          onDelete={handleDelete}
          onLoad={loadCityAreas}
          notifyState={city_areasNotify}
          formatters={{
            date: (value) => dataFormatter.dateFormatter(value)
          }}
      />
  );
};

export default TableCityAreas;
