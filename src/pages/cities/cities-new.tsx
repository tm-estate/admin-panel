import { mdiChartTimelineVariant } from '@mdi/js'
import Head from 'next/head'
import React, {ReactElement, useState} from 'react'
import 'react-toastify/dist/ReactToastify.min.css'
import CardBox from '../../components/CardBox'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'

import { useAppDispatch } from '../../stores/hooks'
import { create } from '../../stores/thunks/cities'
import { getPageTitle } from '../../config'

import { Field, Form, Formik } from 'formik'
import FormField from '../../components/FormField'
import BaseDivider from '../../components/BaseDivider'
import BaseButtons from '../../components/BaseButtons'
import BaseButton from '../../components/BaseButton'
import { AsyncSelectFieldMany } from '../../components/UI/AsyncSelectFieldMany'

import { useRouter } from 'next/router'
import { ICity } from "../../interfaces";

const TablesPage = () => {
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

  const handleSubmit = async (data: ICity) => {
    await dispatch(create(data)).then(res => console.log(res))
    await router.push('/cities/cities-list')
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

              <FormField label="Coordinate">
                <Field name="coordinate.latitude" placeholder="latitude" />
                <Field name="coordinate.longitude" placeholder="longitude" />
              </FormField>

              <FormField label="City Areas" labelFor="cityAreas">
                <Field
                  name="cityAreas"
                  id="cityAreas"
                  itemRef={'cityAreas'}
                  options={[]}
                  showField={'titleRu'}
                  component={AsyncSelectFieldMany}
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
        </CardBox>
      </SectionMain>
    </>
  )
}

TablesPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default TablesPage
