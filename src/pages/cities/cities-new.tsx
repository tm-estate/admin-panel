import { mdiChartTimelineVariant } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement } from 'react'
import 'react-toastify/dist/ReactToastify.min.css'
import CardBox from '@/components/Cardbox/CardBox'
import LayoutAuthenticated from '@/layouts/Authenticated'
import SectionMain from '@/components/Section/SectionMain'
import SectionTitleLineWithButton from '@/components/Section/SectionTitleLineWithButton'
import { getPageTitle } from '@/config'
import { create } from '@/stores/thunks/cities'
import { useAppDispatch, useAppSelector } from '@/stores/hooks'
import { ICity } from "@/interfaces";
import CityForm from '@/components/Cities/CityForm'
import BreadcrumbsBar from "@/components/BreadcrumbsBar";

const NewCityPage = () => {
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector((state) => state.cities)

  // Initial values
  const initialValues: ICity = {
    titleEn: '',
    titleRu: '',
    titleTm: '',
    coordinate: {
      latitude: null,
      longitude: null,
    },
    cityAreas: [],
  }

  // Handle form submission
  const handleSubmit = async (data: ICity) => {
    await dispatch(create(data))
  }

  return (
      <>
        <Head>
          <title>{getPageTitle('New City')}</title>
        </Head>
        <SectionMain>
          <SectionTitleLineWithButton
              icon={mdiChartTimelineVariant}
              title="New City"
              main
          >
            <BreadcrumbsBar items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Cities', href: '/cities/cities-list' },
              { label: 'New City', href: '/cities/cities-new' }
            ]} />
          </SectionTitleLineWithButton>
          <CardBox>
            <CityForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                isLoading={loading}
            />
          </CardBox>
        </SectionMain>
      </>
  )
}

NewCityPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default NewCityPage
