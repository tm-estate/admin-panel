import { mdiAccount, mdiChartTimelineVariant, mdiMail, mdiUpload } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement } from 'react'
import 'react-toastify/dist/ReactToastify.min.css'
import CardBox from '../../components/CardBox'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'

import { Field, Form, Formik } from 'formik'
import FormField from '../../components/FormField'
import BaseDivider from '../../components/BaseDivider'
import BaseButtons from '../../components/BaseButtons'
import BaseButton from '../../components/BaseButton'
import FormCheckRadio from '../../components/FormCheckRadio'
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup'
import FormFilePicker from '../../components/FormFilePicker'
import FormImagePicker from '../../components/FormImagePicker'
import { SwitchField } from '../../components/SwitchField'

import { SelectField } from '../../components/SelectField'
import { SelectFieldMany } from '../../components/SelectFieldMany'
import { RichTextField } from '../../components/RichTextField'

import { create } from '../../stores/thunks/product-parameters'
import { useAppDispatch } from '../../stores/hooks'
import { useRouter } from 'next/router'
import { IProductParameter } from "../../interfaces";

const TablesPage = () => {
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
  const handleSubmit = async (data) => {
    await dispatch(create(data))
    await router.push('/product_parameters/product_parameters-list')
  }
  return (
    <>
      <Head>
        <title>{getPageTitle('New Item')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="New Item" main>
          Breadcrumbs
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            initialValues={initValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label="Title En">
                <Field name="titleEn" placeholder="Your Title En" />
              </FormField>

              <FormField label="Title Ru">
                <Field name="titleRu" placeholder="Your Title Ru" />
              </FormField>

              <FormField label="Title Tm">
                <Field name="titleTm" placeholder="Your Title Tm" />
              </FormField>

              <FormField label="Select Type">
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

              <FormField label="Is Required" labelFor="isRequired">
                <Field name="isRequired" id="isRequired" component={SwitchField}></Field>
              </FormField>

              <FormField label="Deal Types" labelFor="dealTypes">
                <Field
                  name="dealTypes"
                  id="dealTypes"
                  itemRef={'dealTypes'}
                  showField={'titleRu'}
                  options={[]}
                  component={SelectFieldMany}
                ></Field>
              </FormField>

              <FormField label="Property Types" labelFor="propertyTypes">
                <Field
                  name="propertyTypes"
                  id="propertyTypes"
                  itemRef={'propertyTypes'}
                  showField={'titleRu'}
                  options={[]}
                  component={SelectFieldMany}
                ></Field>
              </FormField>

              <FormField label="Key">
                <Field name="key" placeholder="Your Key" />
              </FormField>

              <FormField label="Items" labelFor="items">
                <Field
                  name="items"
                  id="items"
                  itemRef={'productParameterItems'}
                  showField={'titleRu'}
                  options={[]}
                  component={SelectFieldMany}
                ></Field>
              </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
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
        </CardBox>
      </SectionMain>
    </>
  )
}

TablesPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default TablesPage
