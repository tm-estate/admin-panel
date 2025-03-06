import { mdiChartTimelineVariant } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement } from 'react'
import 'react-toastify/dist/ReactToastify.min.css'
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

import { create } from '@/stores/thunks/property-types'
import { useAppDispatch } from '@/stores/hooks'
import { useRouter } from 'next/router'
import { AsyncSelectFieldMany } from '@/components/UI/AsyncSelectFieldMany'
import { IPropertyType } from "@/interfaces";

const TablesPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initValues: IPropertyType = {
    titleRu: '',
    titleEn: '',
    titleTm: '',
    dealTypes: [],
  }

  const handleSubmit = async (data: IPropertyType) => {
    await dispatch(create(data))
    await router.push('/property_types/property_types-list')
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
                  itemRef={'dealTypes'}
                  showField={'titleRu'}
                  options={[]}
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

TablesPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default TablesPage
