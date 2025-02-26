import {
  mdiAccount,
  mdiChartTimelineVariant,
  mdiMail,
  mdiUpload,
} from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-datepicker/dist/react-datepicker.css';

import CardBox from '../../components/CardBox';
import LayoutAuthenticated from '../../layouts/Authenticated';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import { getPageTitle } from '../../config';

import { Field, Form, Formik } from 'formik';
import FormField from '../../components/FormField';
import BaseDivider from '../../components/BaseDivider';
import BaseButtons from '../../components/BaseButtons';
import BaseButton from '../../components/BaseButton';

import { update, getDealType } from '../../stores/thunks/deal-types';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { IDealType } from "../../interfaces";

const EditDeal_types = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initValues: IDealType = {
    titleRu: '',
    titleEn: '',
    titleTm: '',
  };
  const [initialValues, setInitialValues] = useState(initValues)
  const [isLoading, setIsLoading] = useState(true);
  const { deal_type } = useAppSelector((state) => state.deal_types);
  const { deal_typesId } = router.query;

  useEffect(() => {
    if(deal_typesId) dispatch(getDealType(deal_typesId));
  }, [deal_typesId]);

  useEffect(() => {
    if (typeof deal_type === 'object') {
      setInitialValues(deal_type);
      setIsLoading(false);
    }
  }, [deal_type]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: deal_typesId, data }));
    await router.push('/deal_types/deal_types-list');
    // setInitialValues(initValues);
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit deal_types')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title='Edit deal_types'
          main
        >
          Breadcrumbs
        </SectionTitleLineWithButton>
        <CardBox>
          { !isLoading && initialValues &&
            <Formik
              enableReinitialize
              initialValues={initialValues}
              onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label='Title Ru'>
                <Field name='titleRu' placeholder='Your Title Ru'/>
              </FormField>

              <FormField label='Title En'>
                <Field name='titleEn' placeholder='Your Title En'/>
              </FormField>

              <FormField label='Title Tm'>
                <Field name='titleTm' placeholder='Your Title Tm'/>
              </FormField>

              <BaseDivider/>

              <BaseButtons>
                <BaseButton type='submit' color='info' label='Submit'/>
                <BaseButton type='reset' color='info' outline label='Reset'/>
                <BaseButton
                    type='reset'
                    color='danger'
                    outline
                    label='Cancel'
                    onClick={() => {
                      router.push('/deal_types/deal_types-list')
                      setInitialValues(initValues);
                    }}
                />
              </BaseButtons>
            </Form>
          </Formik>
          }
        </CardBox>
      </SectionMain>
    </>
  );
};

EditDeal_types.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default EditDeal_types;
