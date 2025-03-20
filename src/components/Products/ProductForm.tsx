import React, { useEffect, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import FormField from '@/components/FormField';
import BaseDivider from '@/components/BaseDivider';
import BaseButtons from '@/components/BaseButtons';
import BaseButton from '@/components/BaseButton';
import FormImagePicker from '@/components/FormImagePicker';
import AsyncSelectField from '@/components/UI/AsyncSelectField';
import SwitchField from '@/components/UI/SwitchField';
import SelectField from '@/components/UI/SelectField';
import { IProduct, IProductParameter } from '@/interfaces';
import productParametersApi from '@/api/productParameters';
import * as Yup from 'yup';

interface ProductFormProps {
    initialValues: IProduct;
    onSubmit: (values: IProduct) => Promise<void>;
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

const ProductForm: React.FC<ProductFormProps> = ({
                                                     initialValues,
                                                     onSubmit,
                                                     isLoading = false,
                                                     isEdit = false
                                                 }) => {
    const router = useRouter();
    const [productCharacters, setProductCharacters] = useState<IProductParameter[]>([]);

    useEffect(() => {
        const fetchProductCharacters = async () => {
            try {
                const { data } = await productParametersApi.getProductParametersAutocomplete();
                setProductCharacters(data);
            } catch (e) {
                console.error('Error fetching product parameters:', e);
            }
        };

        fetchProductCharacters();
    }, []);

    const handleSubmit = async (values: IProduct) => {
        try {
            await onSubmit(values);
            await router.push('/products/products-list');
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
        >
            {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-6">
                    <FormField label="Images" labelFor="images">
                        <Field
                            name="images"
                            id="images"
                            component={FormImagePicker}
                            options={initialValues.images}
                            itemRef="images"
                            showField="image"
                        />
                    </FormField>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            label="Name"
                            labelFor="name"
                            error={touched.name && errors.name ? errors.name : undefined}
                        >
                            <Field name="name" placeholder="Product name" className="w-full" />
                        </FormField>

                        <FormField
                            label="Price"
                            labelFor="price"
                            error={touched.price && errors.price ? errors.price : undefined}
                        >
                            <Field
                                name="price"
                                type="number"
                                placeholder="Product price"
                                className="w-full"
                            />
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
                            className="w-full h-24"
                        />
                    </FormField>

                    <FormField
                        label="Address"
                        labelFor="address"
                        error={touched.address && errors.address ? errors.address : undefined}
                    >
                        <Field name="address" placeholder="Product address" className="w-full" />
                    </FormField>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField label="Deal Type" labelFor="dealType">
                            <Field
                                name="dealType"
                                id="dealType"
                                component={AsyncSelectField}
                                options={initialValues.dealType}
                                itemRef="dealTypes"
                                showField="titleRu"
                            />
                        </FormField>

                        <FormField label="Property Type" labelFor="propertyType">
                            <Field
                                name="propertyType"
                                id="propertyType"
                                component={AsyncSelectField}
                                options={initialValues.propertyType}
                                itemRef="propertyTypes"
                                showField="titleRu"
                            />
                        </FormField>

                        <FormField label="Region" labelFor="region">
                            <Field
                                name="region"
                                id="region"
                                component={AsyncSelectField}
                                options={initialValues.region}
                                itemRef="regions"
                                showField="titleRu"
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="City" labelFor="city">
                            <Field
                                name="city"
                                id="city"
                                component={AsyncSelectField}
                                options={initialValues.city}
                                itemRef="cities"
                                showField="titleRu"
                            />
                        </FormField>

                        <FormField label="City Area" labelFor="cityArea">
                            <Field
                                name="cityArea"
                                id="cityArea"
                                component={AsyncSelectField}
                                options={initialValues.cityArea}
                                itemRef="cityAreas"
                                showField="titleRu"
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
                                                    isMulti
                                                    initial={initialValues.productCharacters[item.key]}
                                                    options={item.items}
                                                    showField="titleRu"
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
                                                initial={initialValues.productCharacters[item.key]}
                                                options={item.items}
                                                showField="titleRu"
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
