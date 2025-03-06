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

import { update, getAgencyType } from '../../stores/thunks/agency-types'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'
import { IAgencyType } from "../../interfaces";

const EditAgency_types = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initValues: IAgencyType = {
    titleRu: '',
    titleEn: '',
    titleTm: '',
  }
  const [initialValues, setInitialValues] = useState(initValues)
  const [isLoading, setIsLoading] = useState(true);
  const { agency_type } = useAppSelector((state) => state.agency_types)
  const { agency_typesId } = router.query


  useEffect(() => {
    if(agency_typesId) dispatch(getAgencyType(agency_typesId))
  }, [agency_typesId])

  useEffect(() => {
    if (typeof agency_type === 'object') {
      setInitialValues(agency_type)
      setIsLoading(false)
    }
  }, [agency_type])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: agency_typesId, data }))
    await router.push('/agency_types/agency_types-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit agency_types')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="Edit agency_types" main>
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

                <BaseDivider/>

                <BaseButtons>
                  <BaseButton type="submit" color="info" label="Submit"/>
                  <BaseButton type="reset" color="info" outline label="Reset"/>
                  <BaseButton
                      type="reset"
                      color="danger"
                      outline
                      label="Cancel"
                      onClick={() => router.push('/agency_types/agency_types-list')}
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

EditAgency_types.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default EditAgency_types
