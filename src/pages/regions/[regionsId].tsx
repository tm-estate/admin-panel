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
import { SelectFieldMany } from '../../components/SelectFieldMany'

import { update, fetch } from '../../stores/regions/regionsSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'

const EditRegions = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {
    ['titleEn']: '',

    ['titleRu']: '',

    ['titleTm']: '',

    ['coordinate']: {
      latitude: null,
      longitude: null,
    },

    cities: [],
  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { regions } = useAppSelector((state) => state.regions)

  const { regionsId } = router.query

  useEffect(() => {
    if (regionsId) dispatch(fetch({ id: regionsId }))
  }, [regionsId])

  useEffect(() => {
    if (typeof regions === 'object') {
      setInitialValues(regions)
    }
  }, [regions])

  useEffect(() => {
    if (typeof regions === 'object') {
      const newInitialVal = { ...initVals }

      Object.keys(initVals).forEach((el) => (newInitialVal[el] = regions[el]))

      setInitialValues(newInitialVal)
    }
  }, [regions])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: regionsId, data }))
    await router.push('/regions/regions-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit regions')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="Edit regions" main>
          Breadcrumbs
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
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

              <FormField label="Coordinate">
                <Field name="coordinate.latitude" placeholder="latitude" />
                <Field name="coordinate.longitude" placeholder="longitude" />
              </FormField>

              <FormField label="Cities" labelFor="cities">
                <Field
                  name="cities"
                  id="cities"
                  component={SelectFieldMany}
                  options={initialValues.cities}
                  itemRef={'cities'}
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
                  onClick={() => router.push('/regions/regions-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditRegions.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default EditRegions
