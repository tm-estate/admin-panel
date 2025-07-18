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
import dayjs from 'dayjs';

import CardBox from '@/components/Cardbox/CardBox';
import LayoutAuthenticated from '@/layouts/Authenticated';
import SectionMain from '@/components/Section/SectionMain';
import SectionTitleLineWithButton from '@/components/Section/SectionTitleLineWithButton';
import { getPageTitle } from '@/config';

import { Field, Form, Formik } from 'formik';
import FormField from '@/components/Form/FormField';
import BaseDivider from '@/components/Base/BaseDivider';
import BaseButtons from '@/components/Base/BaseButtons';
import BaseButton from '@/components/Base/BaseButton';
import FormCheckRadio from '@/components/Form/FormCheckRadio';
import FormCheckRadioGroup from '@/components/Form/FormCheckRadioGroup';
import FormFilePicker from '@/components/Form/FormFilePicker';
import FormImagePicker from '@/components/Form/FormImagePicker';
// import { SelectField } from '@/components/SelectField';
// import AsyncSelectField from '@/components/UI/AsyncSelectField';
import SwitchField from "@/components/UI/SwitchField";
import { RichTextField } from '@/components/RichTextField';

import {
  update,
  fetch,
} from '@/stores/slices/product_parameter_itemsSlice';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { useRouter } from 'next/router';

const EditProduct_parameter_items = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    titleEn: '',

    titleRu: '',

    titleTm: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { product_parameter_items } = useAppSelector(
    (state) => state.product_parameters_items,
  );

  const { product_parameter_itemsId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: product_parameter_itemsId }));
  }, [product_parameter_itemsId]);

  useEffect(() => {
    if (typeof product_parameter_items === 'object') {
      setInitialValues(product_parameter_items);
    }
  }, [product_parameter_items]);

  useEffect(() => {
    if (typeof product_parameter_items === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = product_parameter_items[el]),
      );

      setInitialValues(newInitialVal);
    }
  }, [product_parameter_items]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: product_parameter_itemsId, data }));
    await router.push('/product_parameter_items/product_parameter_items-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit product_parameter_items')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title='Edit product_parameter_items'
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
              <FormField label='Title En'>
                <Field name='titleEn' placeholder='Your Title En' />
              </FormField>

              <FormField label='Title Ru'>
                <Field name='titleRu' placeholder='Your Title Ru' />
              </FormField>

              <FormField label='Title Tm'>
                <Field name='titleTm' placeholder='Your Title Tm' />
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
                  onClick={() =>
                    router.push(
                      '/product_parameter_items/product_parameter_items-list',
                    )
                  }
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditProduct_parameter_items.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default EditProduct_parameter_items;
