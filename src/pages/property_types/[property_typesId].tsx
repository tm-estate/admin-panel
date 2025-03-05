import { mdiChartTimelineVariant } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement, useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.min.css'
import 'react-datepicker/dist/react-datepicker.css'

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

import { update, getPropertyType } from '../../stores/thunks/property-types'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'
import { AsyncSelectFieldMany } from '../../components/UI/AsyncSelectFieldMany'
import { IPropertyType } from "../../interfaces";

const EditProperty_types = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initValues: IPropertyType = {
    titleRu: '',
    titleEn: '',
    titleTm: '',
    dealTypes: [],
  }
  const [initialValues, setInitialValues] = useState(initValues)
  const [isLoading, setIsLoading] = useState(true);
  const { property_type } = useAppSelector((state) => state.property_types)
  const { property_typesId } = router.query

  useEffect(() => {
    if(property_typesId) dispatch(getPropertyType(property_typesId))
  }, [property_typesId])

  useEffect(() => {
    if (typeof property_type === 'object') {
      setInitialValues(property_type)
      setIsLoading(false)
    }
  }, [property_type])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: property_typesId, data }))
    await router.push('/property_types/property_types-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit property_types')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="Edit property_types" main>
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
                <FormField label="Title Ru">
                  <Field name="titleRu" placeholder="Your Title Ru"/>
                </FormField>

                <FormField label="Title En">
                  <Field name="titleEn" placeholder="Your Title En"/>
                </FormField>

                <FormField label="Title Tm">
                  <Field name="titleTm" placeholder="Your Title Tm"/>
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

                <BaseDivider/>

                <BaseButtons>
                  <BaseButton type="submit" color="info" label="Submit"/>
                  <BaseButton type="reset" color="info" outline label="Reset"/>
                  <BaseButton
                      type="reset"
                      color="danger"
                      outline
                      label="Cancel"
                      onClick={() => router.push('/property_types/property_types-list')}
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

EditProperty_types.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default EditProperty_types
