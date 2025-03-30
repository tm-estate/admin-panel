import React from 'react';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import FormField from '@/components/Form/FormField';
import BaseDivider from '@/components/Base/BaseDivider';
import BaseButtons from '@/components/Base/BaseButtons';
import BaseButton from '@/components/Base/BaseButton';
import FormCheckRadio from '@/components/Form/FormCheckRadio';
import FormCheckRadioGroup from '@/components/Form/FormCheckRadioGroup';
import SwitchField from '@/components/UI/SwitchField';
import { IProductParameter } from "@/interfaces";
import * as Yup from 'yup';
import AsyncSelectField from "@/components/UI/AsyncSelectField";

interface ProductParameterFormProps {
    initialValues: IProductParameter;
    onSubmit: (values: IProductParameter) => Promise<void>;
    isLoading?: boolean;
    isEdit?: boolean;
}

// Basic validation schema
const validationSchema = Yup.object().shape({
    titleEn: Yup.string().required('Title En is required'),
    titleRu: Yup.string().required('Title Ru is required'),
    titleTm: Yup.string().required('Title Tm is required'),
    selectType: Yup.string().required('Select Type is required'),
    key: Yup.string().required('Key is required')
});

const ProductParameterForm: React.FC<ProductParameterFormProps> = ({
                                                                       initialValues,
                                                                       onSubmit,
                                                                       isLoading = false,
                                                                       isEdit = false
                                                                   }) => {
    const router = useRouter();

    // Handle form submission
    const handleSubmit = async (values: IProductParameter) => {
        try {
            await onSubmit(values);
            await router.push('/product_parameters/product_parameters-list');
        } catch (error) {
            console.error('Error submitting form:', error);
            // You could add error handling here, e.g. with toast notifications
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
                <Form className="space-y-4">
                    <FormField
                        label="Title En"
                        labelFor="titleEn"
                        error={touched.titleEn && errors.titleEn ? errors.titleEn : undefined}
                    >
                        <Field
                            name="titleEn"
                            id="titleEn"
                            placeholder="Your Title En"
                            className="w-full"
                        />
                    </FormField>

                    <FormField
                        label="Title Ru"
                        labelFor="titleRu"
                        error={touched.titleRu && errors.titleRu ? errors.titleRu : undefined}
                    >
                        <Field
                            name="titleRu"
                            id="titleRu"
                            placeholder="Your Title Ru"
                            className="w-full"
                        />
                    </FormField>

                    <FormField
                        label="Title Tm"
                        labelFor="titleTm"
                        error={touched.titleTm && errors.titleTm ? errors.titleTm : undefined}
                    >
                        <Field
                            name="titleTm"
                            id="titleTm"
                            placeholder="Your Title Tm"
                            className="w-full"
                        />
                    </FormField>

                    <FormField
                        label="Select Type"
                        labelFor="selectType"
                        error={touched.selectType && errors.selectType ? errors.selectType : undefined}
                    >
                        <FormCheckRadioGroup>
                            <FormCheckRadio type="radio" label="Single">
                                <Field type="radio" name="selectType" value="Single" />
                            </FormCheckRadio>

                            <FormCheckRadio type="radio" label="Multi">
                                <Field type="radio" name="selectType" value="Multi" />
                            </FormCheckRadio>

                            <FormCheckRadio type="radio" label="String">
                                <Field type="radio" name="selectType" value="String" />
                            </FormCheckRadio>

                            <FormCheckRadio type="radio" label="Number">
                                <Field type="radio" name="selectType" value="Number" />
                            </FormCheckRadio>

                            <FormCheckRadio type="radio" label="Boolean">
                                <Field type="radio" name="selectType" value="Boolean" />
                            </FormCheckRadio>
                        </FormCheckRadioGroup>
                    </FormField>

                    <FormField
                        label="Is Required"
                        labelFor="isRequired"
                    >
                        <Field
                            name="isRequired"
                            id="isRequired"
                            component={SwitchField}
                        />
                    </FormField>

                    <FormField
                        label="Deal Types"
                        labelFor="dealTypes"
                    >
                        <Field
                            name="dealTypes"
                            id="dealTypes"
                            component={AsyncSelectField}
                            isMulti
                            options={initialValues?.dealTypes || []}
                            itemRef="dealTypes"
                            showField="titleRu"
                        />
                    </FormField>

                    <FormField
                        label="Property Types"
                        labelFor="propertyTypes"
                    >
                        <Field
                            name="propertyTypes"
                            id="propertyTypes"
                            component={AsyncSelectField}
                            isMulti
                            options={initialValues?.propertyTypes || []}
                            itemRef="propertyTypes"
                            showField="titleRu"
                        />
                    </FormField>

                    <FormField
                        label="Key"
                        labelFor="key"
                        error={touched.key && errors.key ? errors.key : undefined}
                    >
                        <Field
                            name="key"
                            id="key"
                            placeholder="Your Key"
                            className="w-full"
                        />
                    </FormField>

                    <FormField
                        label="Items"
                        labelFor="items"
                    >
                        <Field
                            name="items"
                            id="items"
                            component={AsyncSelectField}
                            isMulti
                            options={initialValues?.items || []}
                            itemRef="productParameterItems"
                            showField="titleRu"
                        />
                    </FormField>

                    <BaseDivider />

                    <BaseButtons>
                        <BaseButton
                            type="submit"
                            color="info"
                            label={isSubmitting ? 'Submitting...' : (isEdit ? 'Update' : 'Submit')}
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
                            onClick={() => router.push('/product_parameters/product_parameters-list')}
                        />
                    </BaseButtons>
                </Form>
            )}
        </Formik>
    );
};

export default ProductParameterForm;
