import React, { useEffect, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import FormField from '@/components/Form/FormField';
import BaseDivider from '@/components/Base/BaseDivider';
import BaseButtons from '@/components/Base/BaseButtons';
import BaseButton from '@/components/Base/BaseButton';
import AsyncSelectField from '@/components/UI/AsyncSelectField';
import SwitchField from '@/components/UI/SwitchField';
import SelectField from '@/components/UI/SelectField';
import ImageGallery from '@/components/UI/Image/ImageGallery';
import { IProduct, IProductParameter } from '@/interfaces';
import * as Yup from 'yup';
import { getAutocompleteData } from "@/api/autocomplete";

interface ProductFormProps {
    initialValues: IProduct;
    onSubmit: (values: IProduct, newImages?: File[]) => Promise<void>;
    isLoading?: boolean;
    isEdit?: boolean;
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    address: Yup.string().required('Address is required'),
    price: Yup.number().required('Price is required').min(0, 'Price must be positive'),
    dealType: Yup.string().required('Deal Type is required')
});

const prepareInitialValues = (rawValues) => {
    const prepared = { ...rawValues };

    // List of top-level fields that need ID extraction
    const objectFields = ['dealType', 'propertyType', 'region', 'city', 'cityArea', 'creator'];

    // Process all object fields with the same logic
    objectFields.forEach(field => {
        if (prepared[field] && typeof prepared[field] === 'object') {
            prepared[field] = prepared[field]._id;
        }
    });

    // Handle product characteristics
    if (prepared.productCharacters) {
        const transformedChars = { ...prepared.productCharacters };

        Object.keys(transformedChars).forEach(key => {
            const value = transformedChars[key];

            // Skip non-object properties
            if (!value || typeof value !== 'object') {
                return;
            }

            // Extract IDs from either arrays or single objects
            transformedChars[key] = Array.isArray(value)
                ? value.map(item => item._id)
                : value._id;
        });

        prepared.productCharacters = transformedChars;
    }

    return prepared;
};

const ProductForm: React.FC<ProductFormProps> = ({
                                                     initialValues,
                                                     onSubmit,
                                                     isLoading = false,
                                                     isEdit = false
                                                 }) => {
    const router = useRouter();
    const [productCharacters, setProductCharacters] = useState<IProductParameter[]>([]);
    const [formattedInitialValues, setFormattedInitialValues] = useState(prepareInitialValues(initialValues));

    useEffect(() => {
        setFormattedInitialValues(prepareInitialValues(initialValues));
        const fetchProductCharacters = async () => {
            try {
                const { data } = await getAutocompleteData<IProductParameter[]>('productParameters');
                setProductCharacters(data);
            } catch (e) {
                console.error('Error fetching product parameters:', e);
            }
        };

        fetchProductCharacters();
    }, [initialValues]);

    const getInitialOption = (entity: any, fieldName: string) => {
        if (!entity || !entity._id) return null;

        if (Array.isArray(entity)) {
            return entity.map(item => ({
                value: item._id,
                label: item[fieldName] || item.titleRu || item.titleEn || item.name,
                original: item
            }));
        }

        return {
            value: entity._id,
            label: entity.titleRu || entity.titleEn || entity[fieldName] || entity.name,
            original: entity
        };
    };

    const handleSubmit = async (values: IProduct & { newImages?: File[] }) => {
        try {
            // Extract newImages from form values for separate handling
            const { newImages, ...productData } = values;

            // Pass the newImages separately to the onSubmit handler
            await onSubmit(productData, newImages);
            await router.push('/products/products-list');
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <Formik
            enableReinitialize
            initialValues={{
                ...formattedInitialValues,
                newImages: [] // Add field for new images
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ errors, touched, isSubmitting, setFieldValue }) => (
                <Form className="space-y-6">
                    {/*<FormField label="Images" labelFor="newImages">*/}
                    {/*    <Field*/}
                    {/*        name="newImages"*/}
                    {/*        id="newImages"*/}
                    {/*        component={ImageGallery}*/}
                    {/*        images={initialValues.images}*/}
                    {/*    />*/}
                    {/*</FormField>*/}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            label="Name"
                            labelFor="name"
                            error={touched.name && errors.name ? errors.name : undefined}
                        >
                            <Field name="name" type="text" placeholder="Product name" className="w-full" />
                        </FormField>

                        <FormField
                            label="Price"
                            labelFor="price"
                            error={touched.price && errors.price ? errors.price : undefined}
                        >
                            <Field name="price" type="number" placeholder="Product price" className="w-full" />
                        </FormField>
                    </div>

                    <FormField
                        label="Description"
                        labelFor="description"
                        error={touched.description && errors.description ? errors.description : undefined}
                    >
                        <Field
                            name="description"
                            as="textarea"
                            placeholder="Product description"
                            className="w-full"
                        />
                    </FormField>

                    <FormField
                        label="Address"
                        labelFor="address"
                        error={touched.address && errors.address ? errors.address : undefined}
                    >
                        <Field name="address" type="text" placeholder="Product address" className="w-full" />
                    </FormField>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField label="Deal Type" labelFor="dealType">
                            <Field
                                name="dealType"
                                id="dealType"
                                component={AsyncSelectField}
                                initialOption={getInitialOption(initialValues.dealType, "titleRu")}
                                itemRef="dealTypes"
                                showField="titleRu"
                                placeholder="Select deal type..."
                                className="w-full"
                                onChange={(selected) => {
                                    setFieldValue('dealType', selected ? selected.value : null);
                                }}
                            />
                        </FormField>

                        <FormField label="Property Type" labelFor="propertyType">
                            <Field
                                name="propertyType"
                                id="propertyType"
                                component={AsyncSelectField}
                                initialOption={getInitialOption(initialValues.propertyType, "titleRu")}
                                itemRef="propertyTypes"
                                showField="titleRu"
                                onChange={(selected) => {
                                    setFieldValue('propertyType', selected ? selected.value : null);
                                }}
                            />
                        </FormField>

                        <FormField label="Region" labelFor="region">
                            <Field
                                name="region"
                                id="region"
                                component={AsyncSelectField}
                                initialOption={getInitialOption(initialValues.region, "titleRu")}
                                itemRef="regions"
                                showField="titleRu"
                                onChange={(selected) => {
                                    setFieldValue('region', selected ? selected.value : null);
                                }}
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="City" labelFor="city">
                            <Field
                                name="city"
                                id="city"
                                component={AsyncSelectField}
                                initialOption={getInitialOption(initialValues.city, "titleRu")}
                                itemRef="cities"
                                showField="titleRu"
                                onChange={(selected) => {
                                    setFieldValue('city', selected ? selected.value : null);
                                }}
                            />
                        </FormField>

                        <FormField label="City Area" labelFor="cityArea">
                            <Field
                                name="cityArea"
                                id="cityArea"
                                component={AsyncSelectField}
                                initialOption={getInitialOption(initialValues.cityArea, "titleRu")}
                                itemRef="cityAreas"
                                showField="titleRu"
                                onChange={(selected) => {
                                    setFieldValue('cityArea', selected ? selected.value : null);
                                }}
                            />
                        </FormField>
                    </div>

                    {productCharacters.length > 0 && (
                        <>
                            <BaseDivider />
                            <h2 className="text-xl font-bold mb-4">Product Characteristics</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {productCharacters.map((item) => {
                                    if (item.selectType === "Boolean") {
                                        return (
                                            <FormField
                                                label={item.titleEn}
                                                labelFor={`productCharacters.${item.key}`}
                                                key={item.key}
                                            >
                                                <Field
                                                    name={`productCharacters.${item.key}`}
                                                    id={item.key}
                                                    component={SwitchField}
                                                />
                                            </FormField>
                                        );
                                    }

                                    if (item.selectType === "Number") {
                                        return (
                                            <FormField
                                                label={item.titleEn}
                                                labelFor={`productCharacters.${item.key}`}
                                                key={item.key}
                                            >
                                                <Field
                                                    name={`productCharacters.${item.key}`}
                                                    type="number"
                                                    placeholder={`Enter ${item.titleEn.toLowerCase()}`}
                                                    className="w-full"
                                                />
                                            </FormField>
                                        );
                                    }

                                    if (item.selectType === "Multi") {
                                        // Get the array of values from initialValues
                                        const multiValues = initialValues.productCharacters[item.key];

                                        // Map the array to the format expected by the select component
                                        const initialOptions = Array.isArray(multiValues) && multiValues.length > 0
                                            ? multiValues.map(val => ({
                                                value: val._id,
                                                label: val.titleRu || val.titleEn || val.name,
                                                original: val
                                            }))
                                            : null;

                                        return (
                                            <FormField
                                                label={item.titleEn}
                                                labelFor={`productCharacters.${item.key}`}
                                                key={item.key}
                                            >
                                                <Field
                                                    name={`productCharacters.${item.key}`}
                                                    id={item.key}
                                                    component={SelectField}
                                                    isMulti={true}
                                                    initial={initialOptions}
                                                    options={item.items}
                                                    showField="titleRu"
                                                    placeholder={`Select ${item.titleEn.toLowerCase()}...`}
                                                    className="w-full"
                                                    onChange={(selected) => {
                                                        const values = selected && selected.length > 0
                                                            ? selected.map(item => item.value)
                                                            : [];
                                                        setFieldValue(`productCharacters.${item.key}`, values);
                                                    }}
                                                />
                                            </FormField>
                                        );
                                    }

                                    return (
                                        <FormField
                                            label={item.titleEn}
                                            labelFor={`productCharacters.${item.key}`}
                                            key={item.key}
                                        >
                                            <Field
                                                name={`productCharacters.${item.key}`}
                                                id={item.key}
                                                component={SelectField}
                                                initialValue={initialValues.productCharacters[item.key]?._id}
                                                options={item.items}
                                                showField="titleRu"
                                                onChange={(selected) => {
                                                    setFieldValue(`productCharacters.${item.key}`, selected ? selected.value : null);
                                                }}
                                            />
                                        </FormField>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    <BaseDivider />

                    {/* Form Actions */}
                    <BaseButtons>
                        <BaseButton
                            type="submit"
                            color="info"
                            label={isSubmitting ? 'Submitting...' : (isEdit ? 'Update' : 'Create')}
                            disabled={isSubmitting || isLoading}
                        />
                        <BaseButton
                            type="reset"
                            color="info"
                            outline
                            label="Reset"
                            disabled={isSubmitting || isLoading}
                        />
                        <BaseButton
                            type="button"
                            color="danger"
                            outline
                            label="Cancel"
                            disabled={isSubmitting || isLoading}
                            onClick={() => router.push('/products/products-list')}
                        />
                    </BaseButtons>
                </Form>
            )}
        </Formik>
    );
};

export default ProductForm;
