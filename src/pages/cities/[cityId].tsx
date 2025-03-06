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
import { AsyncSelectFieldMany } from '../../components/UI/AsyncSelectFieldMany'

import {getCity, update} from '../../stores/thunks/cities'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'
import { ICity } from "../../interfaces";

const EditCities = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initValues: ICity = {
    titleEn: '',
    titleRu: '',
    titleTm: '',
    coordinate: {
      latitude: null,
      longitude: null,
    },
    cityAreas: [],
  }
  const [initialValues, setInitialValues] = useState(initValues)
  const [isLoading, setIsLoading] = useState(true)
  const { city } = useAppSelector((state) => state.cities)
  const { cityId } = router.query

  useEffect(() => {
    if(cityId) dispatch(getCity(cityId))
  }, [cityId])

  useEffect(() => {
    if (typeof city === 'object') {
      setInitialValues(city);
      setIsLoading(false);
    }
  }, [city])

  const handleSubmit = async (data: ICity) => {
    await dispatch(update({ id: cityId, data }))
    await router.push('/cities/cities-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit cities')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="Edit cities" main>
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

              <FormField label="City Areas" labelFor="cityAreas">
                <Field
                  name="cityAreas"
                  id="cityAreas"
                  component={AsyncSelectFieldMany}
                  options={initialValues?.cityAreas}
                  itemRef={'cityAreas'}
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
                  onClick={() => router.push('/cities/cities-list')}
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

EditCities.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default EditCities
