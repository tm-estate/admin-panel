import {
  mdiAccount,
  mdiChartTimelineVariant,
  mdiMail,
  mdiUpload,
} from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
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

import { create } from '@/stores/thunks/deal-types';
import { useAppDispatch } from '@/stores/hooks';
import { useRouter } from 'next/router';
import { IDealType } from "@/interfaces";

const TablesPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initValues: IDealType = {
    titleRu: '',
    titleEn: '',
    titleTm: '',
  }

  const handleSubmit = async (data) => {
    await dispatch(create(data));
    await router.push('/deal_types/deal_types-list');
  };
  return (
    <>
      <Head>
        <title>{getPageTitle('New Item')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title='New Item'
          main
        >
          Breadcrumbs
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            initialValues={initValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label='Title Ru'>
                <Field name='titleRu' placeholder='Title Ru' />
              </FormField>

              <FormField label='Title En'>
                <Field name='titleEn' placeholder='Title En' />
              </FormField>

              <FormField label='Title Tm'>
                <Field name='titleTm' placeholder='Title Tm' />
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
                  onClick={() => router.push('/deal_types/deal_types-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

TablesPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default TablesPage;
