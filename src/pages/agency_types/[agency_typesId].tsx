import { mdiChartTimelineVariant } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement, useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.min.css'
import CardBox from '@/components/CardBox'
import LayoutAuthenticated from '@/layouts/Authenticated'
import SectionMain from '@/components/SectionMain'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton'
import { getPageTitle } from '@/config'
import { update, getAgencyType } from '@/stores/thunks/agency-types'
import { useAppDispatch, useAppSelector } from '@/stores/hooks'
import { useRouter } from 'next/router'
import { IAgencyType } from "@/interfaces";
import AgencyTypeForm from '@/components/Agency_types/AgencyTypeForm'
import BreadcrumbsBar from "@/components/BreadcrumbsBar";

const EditAgencyType = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { agency_typesId } = router.query
  const { agency_type, loading } = useAppSelector((state) => state.agency_types)
  const [isLoading, setIsLoading] = useState(true)
  const [initialValues, setInitialValues] = useState<IAgencyType | null>(null)

  // Initial empty state
  const emptyAgencyType: IAgencyType = {
    titleRu: '',
    titleEn: '',
    titleTm: '',
  }

  // Fetch agency type data when component mounts
  useEffect(() => {
    if (agency_typesId) {
      setIsLoading(true)
      dispatch(getAgencyType(agency_typesId))
    }
  }, [agency_typesId, dispatch])

  // Update form when agency type data is loaded
  useEffect(() => {
    if (agency_type && typeof agency_type === 'object') {
      setInitialValues(agency_type)
      setIsLoading(false)
    }
  }, [agency_type])

  // Handle form submission
  const handleSubmit = async (data: IAgencyType) => {
    await dispatch(update({ id: agency_typesId, data }))
  }

  return (
      <>
        <Head>
          <title>{getPageTitle('Edit Agency Type')}</title>
        </Head>
        <SectionMain>
          <SectionTitleLineWithButton
              icon={mdiChartTimelineVariant}
              title="Edit Agency Type"
              main
          >
            <BreadcrumbsBar items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Agency Types', href: '/agency_types/agency_types-list' },
              { label: `Edit Agency Type ${agency_typesId}`, href: `/agency_types/${agency_typesId}` }
            ]} />
          </SectionTitleLineWithButton>
          <CardBox>
            {!isLoading && initialValues ? (
                <AgencyTypeForm
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    isLoading={loading}
                    isEdit={true}
                />
            ) : (
                <div className="flex justify-center items-center h-64">
                  <p className="text-lg text-gray-500">Loading agency type information...</p>
                </div>
            )}
          </CardBox>
        </SectionMain>
      </>
  )
}

EditAgencyType.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default EditAgencyType
