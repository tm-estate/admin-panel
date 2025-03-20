import React, { useEffect } from 'react';
import { getPropertyTypes, deletePropertyType } from '@/stores/thunks/property-types';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import dataFormatter from '@/helpers/dataFormatter';
import BaseTable from '@/components/UI/BaseTable';

const TablePropertyTypes = () => {
    const dispatch = useAppDispatch();

    // Get data from Redux store
    const {
        property_types,
        loading,
        count,
        notify: property_typesNotify,
    } = useAppSelector((state) => state.property_types);

    // Column configuration
    const columns = [
        { field: 'titleRu', label: 'Title Ru', sortable: true },
        { field: 'titleEn', label: 'Title En', sortable: true },
        { field: 'titleTm', label: 'Title Tm', sortable: true },
        { field: 'dealTypes', label: 'Deal Types', formatter: 'dealTypes' },
        { field: 'createdAt', label: 'Created At', sortable: true, formatter: 'date' },
        { field: 'updatedAt', label: 'Updated At', sortable: true, formatter: 'date' }
    ];

    // Load data with query parameters
    const loadPropertyTypes = ({ page, limit, sort, field }) => {
        const query = `?page=${page}&limit=${limit}&sort=${sort}&field=${field}`;
        dispatch(getPropertyTypes(query));
    };

    // Initial data load
    useEffect(() => {
        loadPropertyTypes({ page: 1, limit: 10, sort: 'desc', field: '' });
    }, [dispatch]);

    // Delete handler
    const handleDelete = (id) => {
        return dispatch(deletePropertyType(id));
    };

    return (
        <BaseTable
            items={property_types}
            loading={loading}
            count={count}
            columns={columns}
            entityPath="property_types"
            onDelete={handleDelete}
            onLoad={loadPropertyTypes}
            notifyState={property_typesNotify}
            formatters={{
                date: (value) => {
                    if (!value) return '';
                    return dataFormatter.dateFormatter(value);
                },
                dealTypes: (value) => {
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
                }
            }}
        />
    );
};

export default TablePropertyTypes;
