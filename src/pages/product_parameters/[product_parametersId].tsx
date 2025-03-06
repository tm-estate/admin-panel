import { mdiAccount, mdiChartTimelineVariant, mdiMail, mdiUpload } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement, useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.min.css'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import dayjs from 'dayjs'

import CardBox from '@/components/CardBox'
import LayoutAuthenticated from '@/layouts/Authenticated'
import SectionMain from '@/components/SectionMain'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton'
import { getPageTitle } from '@/config'

import { Field, Form, Formik } from 'formik'
import FormField from '@/components/FormField'
import BaseDivider from '@/components/BaseDivider'
import BaseButtons from '@/components/BaseButtons'
import BaseButton from '@/components/BaseButton'
import FormCheckRadio from '@/components/FormCheckRadio'
import FormCheckRadioGroup from '@/components/FormCheckRadioGroup'
import FormFilePicker from '@/components/FormFilePicker'
import FormImagePicker from '@/components/FormImagePicker'
// import { SelectField } from '@/components/SelectField'
import { SelectFieldMany } from '@/components/UI/SelectFieldMany'
import { SwitchField } from '@/components/SwitchField'
import { RichTextField } from '@/components/RichTextField'

import { update, getProductParameter } from '@/stores/thunks/product-parameters'
import { useAppDispatch, useAppSelector } from '@/stores/hooks'
import { useRouter } from 'next/router'
import { IProductParameter } from "@/interfaces";
import {AsyncSelectFieldMany} from "@/components/UI/AsyncSelectFieldMany";

const EditProduct_parameters = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initValues: IProductParameter = {
    titleEn: '',
    titleRu: '',
    titleTm: '',
    selectType: '',
    isRequired: false,
    dealTypes: [],
    propertyTypes: [],
    key: '',
    items: [],
  }
  const [initialValues, setInitialValues] = useState(initValues)
  const [isLoading, setIsLoading] = useState(true);
  const { product_parameter } = useAppSelector((state) => state.product_parameters)
  const { product_parametersId } = router.query

  useEffect(() => {
    if(product_parametersId) dispatch(getProductParameter(product_parametersId))
  }, [product_parametersId])

  useEffect(() => {
    if (typeof product_parameter === 'object') {
      setInitialValues(product_parameter)
      setIsLoading(false)
    }
  }, [product_parameter])

  const handleSubmit = async (data: IProductParameter) => {
    await dispatch(update({ id: product_parametersId, data }))
    await router.push('/product_parameters/product_parameters-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit product_parameters')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title="Edit product_parameters"
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
                <FormField label="Title En">
                  <Field name="titleEn" placeholder="Your Title En"/>
                </FormField>

                <FormField label="Title Ru">
                  <Field name="titleRu" placeholder="Your Title Ru"/>
                </FormField>

                <FormField label="Title Tm">
                  <Field name="titleTm" placeholder="Your Title Tm"/>
                </FormField>

                <FormField label="Select Type">
                  <FormCheckRadioGroup>
                    <FormCheckRadio type="radio" label="Single">
                      <Field type="radio" name="selectType" value="Single"/>
                    </FormCheckRadio>

                    <FormCheckRadio type="radio" label="Multi">
                      <Field type="radio" name="selectType" value="Multi"/>
                    </FormCheckRadio>

                    <FormCheckRadio type="radio" label="String">
                      <Field type="radio" name="selectType" value="String"/>
                    </FormCheckRadio>

                    <FormCheckRadio type="radio" label="Number">
                      <Field type="radio" name="selectType" value="Number"/>
                    </FormCheckRadio>

                    <FormCheckRadio type="radio" label="Boolean">
                      <Field type="radio" name="selectType" value="Boolean"/>
                    </FormCheckRadio>
                  </FormCheckRadioGroup>
                </FormField>

                <FormField label="Is Required" labelFor="isRequired">
                  <Field
                      name="isRequired"
                      value={initialValues.isRequired}
                      id="isRequired"
                      component={SwitchField}
                  ></Field>
                </FormField>

                <FormField label="Deal Types" labelFor="dealTypes">
                  <Field
                      name="dealTypes"
                      id="dealTypes"
                      component={AsyncSelectFieldMany}
                      options={initialValues.dealTypes}
                      itemRef={'dealTypes'}
                      showField={'titleRu'}
                  ></Field>
                </FormField>

                <FormField label="Property Types" labelFor="propertyTypes">
                  <Field
                      name="propertyTypes"
                      id="propertyTypes"
                      component={AsyncSelectFieldMany}
                      options={initialValues.propertyTypes}
                      itemRef={'propertyTypes'}
                      showField={'titleRu'}
                  ></Field>
                </FormField>

                <FormField label="Key">
                  <Field name="key" placeholder="Your Key"/>
                </FormField>

                <FormField label="Items" labelFor="items">
                  <Field
                      name="items"
                      id="items"
                      component={AsyncSelectFieldMany}
                      options={initialValues.items}
                      itemRef={'productParameterItems'}
                      showField={'titleRu'}
                  ></Field>
                </FormField>

                <BaseDivider/>

                <BaseButtons>
                  <BaseButton type="submit" color="info" label="Submit"/>
                  <BaseButton type="reset" color="info" outline label="Reset"/>
                  <BaseButton
                      type="reset"
                      color="danger"
                      outline
                      label="Cancel"
                      onClick={() => router.push('/product_parameters/product_parameters-list')}
                  />
                </BaseButtons>
              </Form>
            </Formik>
          }
        </CardBox>
      </SectionMain>
    </>
  )
}

EditProduct_parameters.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default EditProduct_parameters
