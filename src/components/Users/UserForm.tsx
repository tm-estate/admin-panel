import React from 'react';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import FormField from '@/components/Form/FormField';
import BaseDivider from '@/components/Base/BaseDivider';
import BaseButtons from '@/components/Base/BaseButtons';
import BaseButton from '@/components/Base/BaseButton';
import FormCheckRadio from '@/components/Form/FormCheckRadio';
import FormCheckRadioGroup from '@/components/Form/FormCheckRadioGroup';
import FormImagePicker from '@/components/Form/FormImagePicker';
import SwitchField from '@/components/UI/SwitchField';
import { IUser } from "@/interfaces";
import { mdiUpload } from '@mdi/js';
import * as Yup from 'yup';

interface UserFormProps {
    initialValues: IUser;
    onSubmit: (values: IUser) => Promise<void>;
    isLoading?: boolean;
    isEdit?: boolean;
}

// Basic validation schema
const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    phone: Yup.string().required('Phone number is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    role: Yup.string().required('Role is required')
});

const UserForm: React.FC<UserFormProps> = ({
                                               initialValues,
                                               onSubmit,
                                               isLoading = false,
                                               isEdit = false
                                           }) => {
    const router = useRouter();

    // Handle form submission
    const handleSubmit = async (values: IUser) => {
        try {
            await onSubmit(values);
            await router.push('/users/users-list');
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
                        label="Name"
                        labelFor="name"
                        help={touched.name && errors.name ? errors.name : undefined}
                    >
                        <Field
                            name="name"
                            id="name"
                            placeholder="User's full name"
                            className="w-full"
                        />
                    </FormField>

                    <FormField
                        label="Phone Number"
                        labelFor="phone"
                        help={touched.phone && errors.phone ? errors.phone : undefined}
                    >
                        <Field
                            name="phone"
                            id="phone"
                            placeholder="Phone number"
                            className="w-full"
                        />
                    </FormField>

                    <FormField
                        label="E-Mail"
                        labelFor="email"
                        help={touched.email && errors.email ? errors.email : undefined}
                    >
                        <Field
                            name="email"
                            id="email"
                            type="email"
                            placeholder="Email address"
                            className="w-full"
                        />
                    </FormField>

                    <FormField
                        label="Role"
                        labelFor="role"
                        help={touched.role && errors.role ? errors.role : undefined}
                    >
                        <FormCheckRadioGroup>
                            <FormCheckRadio type="radio" label="admin">
                                <Field type="radio" name="role" value="admin" />
                            </FormCheckRadio>

                            <FormCheckRadio type="radio" label="user">
                                <Field type="radio" name="role" value="user" />
                            </FormCheckRadio>
                        </FormCheckRadioGroup>
                    </FormField>

                    <FormField
                        label="Is Phone Number Confirmed"
                        labelFor="isPhoneNumberConfirmed"
                    >
                        <Field
                            name="isPhoneNumberConfirmed"
                            id="isPhoneNumberConfirmed"
                            component={SwitchField}
                        />
                    </FormField>

                    <FormField
                        label="Is Agent"
                        labelFor="isAgent"
                    >
                        <Field
                            name="isAgent"
                            id="isAgent"
                            component={SwitchField}
                        />
                    </FormField>

                    <FormField
                        label="Disabled"
                        labelFor="disabled"
                    >
                        <Field
                            name="disabled"
                            id="disabled"
                            component={SwitchField}
                        />
                    </FormField>

                    <FormField>
                        <Field
                            label="Avatar"
                            color="info"
                            icon={mdiUpload}
                            path="users/avatar"
                            name="avatar"
                            id="avatar"
                            schema={{
                                size: undefined,
                                formats: undefined,
                            }}
                            component={FormImagePicker}
                        />
                    </FormField>

                    {isEdit && (
                        <FormField
                            label="Password"
                            labelFor="password"
                            help="Leave blank to keep current password"
                        >
                            <Field
                                name="password"
                                id="password"
                                type="password"
                                placeholder="New password (optional)"
                                className="w-full"
                            />
                        </FormField>
                    )}

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
                            onClick={() => router.push('/users/users-list')}
                        />
                    </BaseButtons>
                </Form>
            )}
        </Formik>
    );
};

export default UserForm;
