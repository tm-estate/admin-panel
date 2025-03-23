import { mdiChartTimelineVariant } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement } from 'react'
import 'react-toastify/dist/ReactToastify.min.css'
import CardBox from '@/components/Cardbox/CardBox'
import LayoutAuthenticated from '@/layouts/Authenticated'
import SectionMain from '@/components/Section/SectionMain'
import SectionTitleLineWithButton from '@/components/Section/SectionTitleLineWithButton'
import { getPageTitle } from '@/config'
import { create } from '@/stores/thunks/agency-types'
import { useAppDispatch, useAppSelector } from '@/stores/hooks'
import { IAgencyType } from "@/interfaces";
import AgencyTypeForm from '@/components/Agency_types/AgencyTypeForm'
import BreadcrumbsBar from "@/components/BreadcrumbsBar";

const NewAgencyTypePage = () => {
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector((state) => state.agency_types)

  // Initial values
  const initialValues: IAgencyType = {
    titleRu: '',
    titleEn: '',
    titleTm: '',
  }

  // Handle form submission
  const handleSubmit = async (data: IAgencyType) => {
    await dispatch(create(data))
  }

  return (
      <>
        <Head>
          <title>{getPageTitle('New Agency Type')}</title>
        </Head>
        <SectionMain>
          <SectionTitleLineWithButton
              icon={mdiChartTimelineVariant}
              title="New Agency Type"
              main
          >
            <BreadcrumbsBar items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Agency Types', href: '/agency_types/agency_types-list' },
              { label: 'New Agency Type', href: '/agency_types/agency_types-new' }
            ]} />
          </SectionTitleLineWithButton>
          <CardBox>
            <AgencyTypeForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                isLoading={loading}
            />
          </CardBox>
        </SectionMain>
      </>
  )
}

NewAgencyTypePage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default NewAgencyTypePage
