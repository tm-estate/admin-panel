import React, { useEffect } from 'react';
import { getProductParameters, deleteProductParameter } from '@/stores/thunks/product-parameters';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import dataFormatter from '@/helpers/dataFormatter';
import BaseTable from '@/components/UI/BaseTable';

const TableProductParameters = () => {
    const dispatch = useAppDispatch();

    // Get data from Redux store
    const {
        product_parameters,
        loading,
        count,
        notify: product_parametersNotify,
    } = useAppSelector((state) => state.product_parameters);

    // Safe formatter for arrays of objects
    const safeListFormatter = (items, field = 'titleRu') => {
        if (!items) return '';
        if (!Array.isArray(items)) return String(items);

        return items
            .map(item => {
                if (!item) return '';
                if (typeof item === 'string') return item;
                if (typeof item === 'object' && item[field]) return item[field];
                return '';
            })
            .filter(Boolean)
            .join(', ');
    };

    // Column configuration
    const columns = [
        { field: 'titleEn', label: 'Title En', sortable: true },
        { field: 'titleRu', label: 'Title Ru', sortable: true },
        { field: 'titleTm', label: 'Title Tm', sortable: true },
        { field: 'selectType', label: 'Select Type' },
        { field: 'isRequired', label: 'Is Required', formatter: 'boolean' },
        { field: 'key', label: 'Key', sortable: true },
        { field: 'dealTypes', label: 'Deal Types', formatter: 'dealTypes' },
        { field: 'propertyTypes', label: 'Property Types', formatter: 'propertyTypes' },
        { field: 'items', label: 'Items', formatter: 'items' },
        { field: 'createdAt', label: 'Created At', sortable: true, formatter: 'date' },
        { field: 'updatedAt', label: 'Updated At', sortable: true, formatter: 'date' }
    ];

    // Load data with query parameters
    const loadProductParameters = ({ page, limit, sort, field }) => {
        const query = `?page=${page}&limit=${limit}&sort=${sort}&field=${field}`;
        dispatch(getProductParameters(query));
    };

    // Initial data load
    useEffect(() => {
        loadProductParameters({ page: 1, limit: 10, sort: 'desc', field: '' });
    }, [dispatch]);

    // Delete handler
    const handleDelete = (id) => {
        return dispatch(deleteProductParameter(id));
    };

    return (
        <BaseTable
            items={product_parameters}
            loading={loading}
            count={count}
            columns={columns}
            entityPath="product_parameters"
            onDelete={handleDelete}
            onLoad={loadProductParameters}
            notifyState={product_parametersNotify}
            formatters={{
                boolean: (value) => dataFormatter.booleanFormatter(value),
                date: (value) => dataFormatter.dateFormatter(value),
                dealTypes: (value) => safeListFormatter(value, 'titleRu'),
                propertyTypes: (value) => safeListFormatter(value, 'titleRu'),
                items: (value) => safeListFormatter(value, 'titleRu')
            }}
        />
    );
};

export default TableProductParameters;
