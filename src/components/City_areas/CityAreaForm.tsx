import React from 'react';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import FormField from '@/components/FormField';
import BaseDivider from '@/components/BaseDivider';
import BaseButtons from '@/components/BaseButtons';
import BaseButton from '@/components/BaseButton';
import { ICityArea } from "@/interfaces";
import * as Yup from 'yup';

interface CityAreaFormProps {
    initialValues: ICityArea;
    onSubmit: (values: ICityArea) => Promise<void>;
    isLoading?: boolean;
    isEdit?: boolean;
}

// Basic validation schema
const validationSchema = Yup.object().shape({
    titleEn: Yup.string().required('Title En is required'),
    titleRu: Yup.string().required('Title Ru is required'),
    titleTm: Yup.string().required('Title Tm is required'),
    // Coordinates are optional, but if provided should be valid
    coordinate: Yup.object().shape({
        latitude: Yup.number().nullable(),
        longitude: Yup.number().nullable()
    })
});

const CityAreaForm: React.FC<CityAreaFormProps> = ({
                                                       initialValues,
                                                       onSubmit,
                                                       isLoading = false,
                                                       isEdit = false
                                                   }) => {
    const router = useRouter();

    // Handle form submission
    const handleSubmit = async (values: ICityArea) => {
        try {
            await onSubmit(values);
            await router.push('/city_areas/city_areas-list');
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            label="Latitude"
                            labelFor="coordinate.latitude"
                        >
                            <Field
                                name="coordinate.latitude"
                                id="coordinate.latitude"
                                placeholder="Enter latitude"
                                type="number"
                                step="any"
                                className="w-full"
                            />
                        </FormField>
                        <FormField
                            label="Longitude"
                            labelFor="coordinate.longitude"
                        >
                            <Field
                                name="coordinate.longitude"
                                id="coordinate.longitude"
                                placeholder="Enter longitude"
                                type="number"
                                step="any"
                                className="w-full"
                            />
                        </FormField>
                    </div>

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
                            onClick={() => router.push('/city_areas/city_areas-list')}
                        />
                    </BaseButtons>
                </Form>
            )}
        </Formik>
    );
};

export default CityAreaForm;
