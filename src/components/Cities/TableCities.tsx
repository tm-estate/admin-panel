import React, { useEffect } from 'react';
import { getCities, deleteCity } from '@/stores/thunks/cities';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import dataFormatter from '@/helpers/dataFormatter';
import BaseTable from '@/components/UI/BaseTable';

const TableCities = () => {
  const dispatch = useAppDispatch();

  // Get data from Redux store
  const {
    cities,
    loading,
    count,
    notify: citiesNotify,
  } = useAppSelector((state) => state.cities);

  // Column configuration
  const columns = [
    { field: 'titleEn', label: 'Title En', sortable: true },
    { field: 'titleRu', label: 'Title Ru', sortable: true },
    { field: 'titleTm', label: 'Title Tm', sortable: true },
    {
      field: 'cityAreas',
      label: 'City Areas',
      formatter: 'cityAreas'
    }
  ];

  // Load data with query parameters
  const loadCities = ({ page, limit, sort, field }) => {
    const query = `?page=${page}&limit=${limit}&sort=${sort}&field=${field}`;
    dispatch(getCities(query));
  };

  // Initial data load
  useEffect(() => {
    loadCities({ page: 1, limit: 10, sort: 'desc', field: '' });
  }, [dispatch]);

  // Delete handler
  const handleDelete = (id) => {
    return dispatch(deleteCity(id));
  };

  return (
      <BaseTable
          items={cities}
          loading={loading}
          count={count}
          columns={columns}
          entityPath="cities"
          onDelete={handleDelete}
          onLoad={loadCities}
          notifyState={citiesNotify}
          formatters={{
            cityAreas: (item) => {
              if (!item || !Array.isArray(item)) return '';
              return dataFormatter.city_areasManyListFormatter(item, 'titleRu').join(', ');
            }
          }}
      />
  );
};

export default TableCities;
