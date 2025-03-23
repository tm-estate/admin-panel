import React from 'react';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import FormField from '@/components/FormField';
import BaseDivider from '@/components/BaseDivider';
import BaseButtons from '@/components/BaseButtons';
import BaseButton from '@/components/BaseButton';
import { IAgencyType } from "@/interfaces";
import * as Yup from 'yup';

interface AgencyTypeFormProps {
    initialValues: IAgencyType;
    onSubmit: (values: IAgencyType) => Promise<void>;
    isLoading?: boolean;
    isEdit?: boolean;
}

const validationSchema = Yup.object().shape({
    titleRu: Yup.string().required('Title Ru is required'),
    titleEn: Yup.string().required('Title En is required'),
    titleTm: Yup.string().required('Title Tm is required'),
});

const AgencyTypeForm: React.FC<AgencyTypeFormProps> = ({
                                                           initialValues,
                                                           onSubmit,
                                                           isLoading = false,
                                                           isEdit = false
                                                       }) => {
    const router = useRouter();

    const handleSubmit = async (values: IAgencyType) => {
        try {
            await onSubmit(values);
            await router.push('/agency_types/agency_types-list');
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
                <Form className="space-y-4">
                    <FormField
                        label="Title Ru"
                        labelFor="titleRu"
                        error={touched.titleRu && errors.titleRu ? errors.titleRu : undefined}
                    >
                        <Field
                            name="titleRu"
                            placeholder="Your Title Ru"
                            className="w-full"
                        />
                    </FormField>

                    <FormField
                        label="Title En"
                        labelFor="titleEn"
                        error={touched.titleEn && errors.titleEn ? errors.titleEn : undefined}
                    >
                        <Field
                            name="titleEn"
                            placeholder="Your Title En"
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
                            placeholder="Your Title Tm"
                            className="w-full"
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
                            onClick={() => router.push('/agency_types/agency_types-list')}
                        />
                    </BaseButtons>
                </Form>
            )}
        </Formik>
    );
};

export default AgencyTypeForm;
