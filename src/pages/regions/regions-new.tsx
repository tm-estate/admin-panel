import { mdiChartTimelineVariant } from '@mdi/js'
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

import { SelectFieldMany } from '../../components/SelectFieldMany'

import { create } from '../../stores/thunks/regions'
import { useAppDispatch } from '../../stores/hooks'
import { useRouter } from 'next/router'
import { IRegion } from "../../interfaces";

const TablesPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initValues: IRegion = {
    titleEn: '',
    titleRu: '',
    titleTm: '',
    coordinate: {
      latitude: null,
      longitude: null,
    },
    cities: [],
  }
  const handleSubmit = async (data: IRegion) => {
    await dispatch(create(data))
    await router.push('/regions/regions-list')
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

              <FormField label="Cities" labelFor="cities123">
                <Field
                  name="cities"
                  id="cities123"
                  itemRef={'cities'}
                  showField="titleRu"
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

TablesPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default TablesPage
