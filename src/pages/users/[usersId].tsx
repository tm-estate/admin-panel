import {
  mdiAccount,
  mdiChartTimelineVariant,
  mdiMail,
  mdiUpload,
} from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import CardBox from '@/components/CardBox';
import LayoutAuthenticated from '@/layouts/Authenticated';
import SectionMain from '@/components/SectionMain';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton';
import { getPageTitle } from '@/config';

import { Field, Form, Formik } from 'formik';
import FormField from '@/components/FormField';
import BaseDivider from '@/components/BaseDivider';
import BaseButtons from '@/components/BaseButtons';
import BaseButton from '@/components/BaseButton';
import FormCheckRadio from '@/components/FormCheckRadio';
import FormCheckRadioGroup from '@/components/FormCheckRadioGroup';
import FormFilePicker from '@/components/FormFilePicker';
import FormImagePicker from '@/components/FormImagePicker';
// import { SelectField } from '@/components/SelectField';
// import { SelectFieldMany } from '@/components/SelectFieldMany';
import { SwitchField } from '@/components/SwitchField';
import { RichTextField } from '@/components/RichTextField';

import { update, getUser } from '@/stores/thunks/users';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { useRouter } from 'next/router';
import { IUser } from "@/interfaces";
// TODO need users api put request from backend
const EditUsers = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initValues: IUser = {
    name: '',
    phone: '',
    email: '',
    isPhoneNumberConfirmed: false,
    savedProducts: [],
    disabled: false,
  };
  const [initialValues, setInitialValues] = useState(initValues);

  const { user } = useAppSelector((state) => state.users);

  const { usersId } = router.query;

  useEffect(() => {
    console.log(usersId)
    if(usersId) dispatch(getUser(usersId));
  }, [usersId]);

  useEffect(() => {
    if (typeof user === 'object') {
      setInitialValues(user);
    }

    console.log(user)
  }, [user]);


  const handleSubmit = async (data) => {
    await dispatch(update({ id: usersId, data }));
    await router.push('/users/users-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit users')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title='Edit users'
          main
        >
          Breadcrumbs
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label='First Name'>
                <Field name='firstName' placeholder='Your First Name' />
              </FormField>

              <FormField label='Last Name'>
                <Field name='lastName' placeholder='Your Last Name' />
              </FormField>

              <FormField label='Phone Number'>
                <Field name='phoneNumber' placeholder='Your Phone Number' />
              </FormField>

              <FormField label='E-Mail'>
                <Field name='email' placeholder='Your E-Mail' />
              </FormField>

              <FormField label='Role'>
                <FormCheckRadioGroup>
                  <FormCheckRadio type='radio' label='admin'>
                    <Field type='radio' name='role' value='admin' />
                  </FormCheckRadio>

                  <FormCheckRadio type='radio' label='user'>
                    <Field type='radio' name='role' value='user' />
                  </FormCheckRadio>
                </FormCheckRadioGroup>
              </FormField>

              <FormField label='Disabled' labelFor='disabled'>
                <Field
                  name='disabled'
                  id='disabled'
                  component={SwitchField}
                ></Field>
              </FormField>

              <FormField>
                <Field
                  label='Avatar'
                  color='info'
                  icon={mdiUpload}
                  path={'users/avatar'}
                  name='avatar'
                  id='avatar'
                  schema={{
                    size: undefined,
                    formats: undefined,
                  }}
                  component={FormImagePicker}
                ></Field>
              </FormField>

              <FormField label='Password'>
                <Field name='password' placeholder='Your password' />
              </FormField>

              <BaseDivider />

              <BaseButtons>
                <BaseButton type='submit' color='info' label='Submit' />
                <BaseButton type='reset' color='info' outline label='Reset' />
                <BaseButton
                  type='reset'
                  color='danger'
                  outline
                  label='Cancel'
                  onClick={() => router.push('/users/users-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditUsers.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default EditUsers;
