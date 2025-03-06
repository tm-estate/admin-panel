import { mdiChartTimelineVariant } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement, useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.min.css'
import 'react-datepicker/dist/react-datepicker.css'

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

import { useAppDispatch, useAppSelector } from '@/stores/hooks'
import { useRouter } from 'next/router'
import { getCityArea, update } from "@/stores/thunks/city-areas";

const EditCity_areas = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initValues = {
    titleEn: '',
    titleRu: '',
    titleTm: '',
    coordinate: {
      latitude: null,
      longitude: null,
    },
  }
  const [initialValues, setInitialValues] = useState(initValues)
  const [isLoading, setIsLoading] = useState(true)
  const { city_area } = useAppSelector((state) => state.city_areas)
  const { city_areasId } = router.query

  useEffect(() => {
    if(city_areasId) dispatch(getCityArea(city_areasId))
  }, [city_areasId])

  useEffect(() => {
    if (typeof city_area === 'object') {
      setInitialValues(city_area)
      setIsLoading(false)
    }
  }, [city_area])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: city_areasId, data }))
    await router.push('/city_areas/city_areas-list')
    setInitialValues(initValues);
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit city_areas')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="Edit city_areas" main>
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

                <BaseDivider />

                <BaseButtons>
                  <BaseButton type="submit" color="info" label="Submit" />
                  <BaseButton type="reset" color="info" outline label="Reset" />
                  <BaseButton
                    type="reset"
                    color="danger"
                    outline
                    label="Cancel"
                    onClick={() => {
                      router.push('/city_areas/city_areas-list')
                      setInitialValues(initValues)
                    }}
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

EditCity_areas.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default EditCity_areas
