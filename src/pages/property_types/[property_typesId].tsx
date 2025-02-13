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

import { update, fetch } from '../../stores/property_types/property_typesSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'
import { SelectFieldMany } from '../../components/SelectFieldMany'

const EditProperty_types = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {
    ['titleRu']: '',

    ['titleEn']: '',

    ['titleTm']: '',

    dealTypes: [],
  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { property_types } = useAppSelector((state) => state.property_types)

  const { property_typesId } = router.query

  useEffect(() => {
    dispatch(fetch({ id: property_typesId }))
  }, [property_typesId])

  useEffect(() => {
    if (typeof property_types === 'object') {
      setInitialValues(property_types)
    }
  }, [property_types])

  useEffect(() => {
    if (typeof property_types === 'object') {
      const newInitialVal = { ...initVals }

      Object.keys(initVals).forEach((el) => (newInitialVal[el] = property_types[el]))

      setInitialValues(newInitialVal)
    }
  }, [property_types])

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
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label="Title Ru">
                <Field name="titleRu" placeholder="Your Title Ru" />
              </FormField>

              <FormField label="Title En">
                <Field name="titleEn" placeholder="Your Title En" />
              </FormField>

              <FormField label="Title Tm">
                <Field name="titleTm" placeholder="Your Title Tm" />
              </FormField>

              <FormField label="Deal Types" labelFor="dealTypes">
                <Field
                  name="dealTypes"
                  id="dealTypes"
                  component={SelectFieldMany}
                  options={initialValues.dealTypes}
                  itemRef={'dealTypes'}
                  showField={'titleRu'}
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
                  onClick={() => router.push('/property_types/property_types-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditProperty_types.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default EditProperty_types
