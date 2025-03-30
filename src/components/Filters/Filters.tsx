import React, { useEffect, useMemo, useCallback, useRef } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import CardBox from '@/components/Cardbox/CardBox';
import { useAppDispatch } from '@/stores/hooks';
import { IFilterConfig, IFilterItem } from '@/interfaces';
import { isRangeFilter } from '@/utils/filter/filterTypes';
import {generateFilterQuery, parseQueryToFilterItems, updateBrowserUrl} from '@/utils/filter/queryHelpers';
import { prefetchFilterData, prefetchSingleFilter } from '@/utils/filter/prefetchHelpers';
import FilterItem from './FilterItem';
import FilterControls from './FilterControls';
import AppliedFilters from './AppliedFilters';
import { FILTER_TYPES } from "@/constants/filterTypes";

interface FiltersProps {
    filters: IFilterConfig[];
    filterItems: IFilterItem[];
    setFilterItems: (items: IFilterItem[]) => void;
    onApplyFilters: (filterQuery: { object: any, query: string }) => void;
    showAppliedFilters?: boolean;
    className?: string;
}

const Filters: React.FC<FiltersProps> = ({
                                             filters,
                                             filterItems,
                                             setFilterItems,
                                             onApplyFilters,
                                             showAppliedFilters = true,
                                             className = '',
                                         }) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const initialRenderRef = useRef(true);
    const formikRef = useRef(null);

    useEffect(() => {
        if (initialRenderRef.current && Object.keys(router.query).length > 0) {
            initialRenderRef.current = false;

            const urlParams = new URLSearchParams(router.asPath.split('?')[1] || '');
            const initialFilterItems = parseQueryToFilterItems(urlParams, filters);

            if (initialFilterItems.length > 0) {
                setFilterItems(initialFilterItems);

                const filterData = generateFilterQuery(initialFilterItems);
                onApplyFilters(filterData);
            }
        }
    }, [filters, router.query, setFilterItems, onApplyFilters, router.asPath]);

    useEffect(() => {
        if (filters.length > 0) {
            prefetchFilterData(filters, dispatch);
        }
    }, [filters, dispatch]);

    const handleFilterValueChange = useCallback((id: string, name: string, value: any) => {
        const updatedItems = filterItems.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    fields: {
                        ...item.fields,
                        [name]: value
                    }
                };
            }
            return item;
        });

        setFilterItems(updatedItems);
    }, [filterItems, setFilterItems]);

    const handleFilterTypeChange = useCallback((id: string, selectedFilter: IFilterConfig) => {
        prefetchSingleFilter(selectedFilter, dispatch);

        const updatedItems = filterItems.map(item => {
            if (item.id === id) {
                const isBoolean = selectedFilter.selectType === FILTER_TYPES.BOOLEAN;

                return {
                    id,
                    fields: {
                        ...item.fields,
                        selectedField: selectedFilter.key,
                        filterValue: '',
                        filterBooleanValue: isBoolean ? false : undefined,
                        filterValueFrom: '',
                        filterValueTo: ''
                    },
                    config: selectedFilter
                };
            }
            return item;
        });

        setFilterItems(updatedItems);

        if (formikRef.current) {
            formikRef.current.setFieldValue(`${id}_type`, selectedFilter.key);
        }
    }, [filterItems, setFilterItems, dispatch]);
    const deleteFilter = useCallback((id: string) => {
        const newItems = filterItems.filter(item => item.id !== id);
        setFilterItems(newItems);
    }, [filterItems, setFilterItems]);

    const validationSchema = useMemo(() => {
        const schemaShape = {};

        filterItems.forEach((item) => {
            const fieldId = item.id;

            schemaShape[`${fieldId}_type`] = Yup.string()
                .required('Please select a filter type');

            if (!item.fields.selectedField || !item.config) return;

            const filterConfig = item.config;

            if (isRangeFilter(filterConfig.selectType)) {
                schemaShape[`${fieldId}_from_to`] = Yup.string().test(
                    'at-least-one-range-field',
                    'At least one range field must be filled',
                    function() {
                        const from = this.parent[`${fieldId}_from`];
                        const to = this.parent[`${fieldId}_to`];
                        return (from && from.trim() !== '') || (to && to.trim() !== '');
                    }
                );

                schemaShape[`${fieldId}_from`] = Yup.string().test(
                    'from-value-validation',
                    function() {
                        const from = this.parent[`${fieldId}_from`];
                        if (!from || from.trim() === '') return true;

                        if (filterConfig.key === 'price') {
                            const fromNum = Number(from);
                            if (isNaN(fromNum) || fromNum < 0) {
                                return this.createError({
                                    message: 'Price must be greater than or equal to 0',
                                    path: `${fieldId}_from`
                                });
                            }
                        }

                        const to = this.parent[`${fieldId}_to`];
                        if (to && to.trim() !== '') {
                            if (filterConfig.selectType === 'date') {
                                const fromDate = new Date(from);
                                const toDate = new Date(to);

                                if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) return true;

                                if (fromDate > toDate) {
                                    return this.createError({
                                        message: 'Start date must be before or equal to end date',
                                        path: `${fieldId}_from`
                                    });
                                }
                            } else {
                                const fromNum = Number(from);
                                const toNum = Number(to);

                                if (isNaN(fromNum) || isNaN(toNum)) return true;

                                if (fromNum > toNum) {
                                    return this.createError({
                                        message: 'From value must be less than or equal to To value',
                                        path: `${fieldId}_from`
                                    });
                                }
                            }
                        }

                        return true;
                    }
                );

                schemaShape[`${fieldId}_to`] = Yup.string().test(
                    'to-value-validation',
                    function() {
                        const to = this.parent[`${fieldId}_to`];
                        if (!to || to.trim() === '') return true;

                        const from = this.parent[`${fieldId}_from`];
                        if (from && from.trim() !== '') {
                            if (filterConfig.selectType === 'date') {
                                const fromDate = new Date(from);
                                const toDate = new Date(to);

                                if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) return true;

                                if (toDate < fromDate) {
                                    return this.createError({
                                        message: 'End date must be after or equal to start date',
                                        path: `${fieldId}_to`
                                    });
                                }
                            } else {
                                const fromNum = Number(from);
                                const toNum = Number(to);

                                if (isNaN(fromNum) || isNaN(toNum)) return true;

                                if (toNum < fromNum) {
                                    return this.createError({
                                        message: 'To value must be greater than or equal to From value',
                                        path: `${fieldId}_to`
                                    });
                                }
                            }
                        }

                        return true;
                    }
                );
            } else if (filterConfig.selectType === FILTER_TYPES.MULTI) {
                schemaShape[`${fieldId}_value`] = Yup.string()
                    .test(
                        'at-least-one-multi-item',
                        'At least one item must be selected',
                        function(value) {
                            return typeof value === 'string' && value.trim() !== '';
                        }
                    );
            } else if (filterConfig.selectType === FILTER_TYPES.SELECT) {
                schemaShape[`${fieldId}_value`] = Yup.string()
                    .required('A value must be selected');
            } else if (filterConfig.selectType === FILTER_TYPES.SEARCH || filterConfig.selectType === FILTER_TYPES.TEXT) {
                schemaShape[`${fieldId}_value`] = Yup.string()
                    .required('This field must be filled');
            } else if (filterConfig.selectType === FILTER_TYPES.BOOLEAN) {
                schemaShape[`${fieldId}_value`] = Yup.mixed();
            }
        });

        return Yup.object().shape(schemaShape);
    }, [filterItems]);

    const handleApplyFilters = useCallback(async () => {
        if (formikRef.current) {
            try {
                const errors = await formikRef.current.validateForm();

                if (Object.keys(errors).length === 0) {
                    const filterData = generateFilterQuery(filterItems);

                    if (typeof updateBrowserUrl === 'function') {
                        updateBrowserUrl(filterData.query);
                    }

                    onApplyFilters(filterData);
                    return true;
                } else {
                    formikRef.current.setTouched(
                        Object.keys(errors).reduce((acc, key) => {
                            acc[key] = true;
                            return acc;
                        }, {})
                    );

                    formikRef.current.validateForm();
                    return false;
                }
            } catch (error) {
                console.error('Error during validation:', error);
                return false;
            }
        }
        return false;
    }, [filterItems, onApplyFilters, updateBrowserUrl]);

    const initialValues = useMemo(() => {
        const values = {};

        filterItems.forEach((item) => {
            const fieldId = item.id;

            values[`${fieldId}_type`] = item.fields.selectedField || '';

            if (!item.config) return;

            if (isRangeFilter(item.config.selectType)) {
                values[`${fieldId}_from`] = item.fields.filterValueFrom || '';
                values[`${fieldId}_to`] = item.fields.filterValueTo || '';
                values[`${fieldId}_from_to`] = '';
            } else if (item.config.selectType === FILTER_TYPES.BOOLEAN) {
                values[`${fieldId}_value`] = !!item.fields.filterBooleanValue;
            } else {
                values[`${fieldId}_value`] = item.fields.filterValue || '';
            }
        });

        return values;
    }, [filterItems]);

    const handleResetFilters = useCallback(() => {
        setFilterItems([]);
        onApplyFilters({ object: {}, query: '' });
    }, [setFilterItems, onApplyFilters]);

    if (!filterItems || !filterItems.length) return null;

    return (
        <>
            {showAppliedFilters && (
                <AppliedFilters
                    filterItems={filterItems}
                    onRemoveFilter={deleteFilter}
                />
            )}

            <CardBox className={`filter-container ${className}`}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={() => null}
                    innerRef={formikRef}
                    enableReinitialize={true}
                >
                    {({ errors, touched, setFieldValue, setFieldTouched }) => (
                        <Form>
                            {filterItems.map((filterItem) => (
                                <FilterItem
                                    key={filterItem.id}
                                    filterItem={filterItem}
                                    filterItems={filterItems}
                                    filters={filters}
                                    handleFilterTypeChange={handleFilterTypeChange}
                                    handleFilterValueChange={handleFilterValueChange}
                                    deleteFilter={deleteFilter}
                                    setFieldValue={setFieldValue}
                                    setFieldTouched={setFieldTouched}
                                    errors={errors}
                                    touched={touched}
                                />
                            ))}

                            {/* Action Buttons */}
                            <FilterControls
                                handleApplyFilters={handleApplyFilters}
                                handleResetFilters={handleResetFilters}
                                hasFilters={filterItems.length > 0}
                            />
                        </Form>
                    )}
                </Formik>
            </CardBox>
        </>
    );
};
export default Filters;
