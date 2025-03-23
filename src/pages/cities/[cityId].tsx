import { mdiChartTimelineVariant } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement, useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.min.css'
import CardBox from '@/components/CardBox'
import LayoutAuthenticated from '@/layouts/Authenticated'
import SectionMain from '@/components/SectionMain'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton'
import { getPageTitle } from '@/config'
import { update, getCity } from '@/stores/thunks/cities'
import { useAppDispatch, useAppSelector } from '@/stores/hooks'
import { useRouter } from 'next/router'
import { ICity } from "@/interfaces";
import CityForm from '@/components/Cities/CityForm'
import BreadcrumbsBar from "@/components/BreadcrumbsBar";

const EditCity = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { cityId } = router.query
  const { city, loading } = useAppSelector((state) => state.cities)
  const [isLoading, setIsLoading] = useState(true)
  const [initialValues, setInitialValues] = useState<ICity | null>(null)

  // Initial empty state
  const emptyCity: ICity = {
    titleEn: '',
    titleRu: '',
    titleTm: '',
    coordinate: {
      latitude: null,
      longitude: null,
    },
    cityAreas: [],
  }

  // Fetch city data when component mounts
  useEffect(() => {
    if (cityId) {
      setIsLoading(true)
      dispatch(getCity(cityId))
    }
  }, [cityId, dispatch])

  // Update form when city data is loaded
  useEffect(() => {
    if (city && typeof city === 'object') {
      setInitialValues(city)
      setIsLoading(false)
    }
  }, [city])

  // Handle form submission
  const handleSubmit = async (data: ICity) => {
    await dispatch(update({ id: cityId, data }))
  }

  return (
      <>
        <Head>
          <title>{getPageTitle('Edit City')}</title>
        </Head>
        <SectionMain>
          <SectionTitleLineWithButton
              icon={mdiChartTimelineVariant}
              title="Edit City"
              main
          >
            <BreadcrumbsBar items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Cities', href: '/cities/cities-list' },
              { label: `Edit City ${cityId}`, href: `/cities/${cityId}` }
            ]} />
          </SectionTitleLineWithButton>
          <CardBox>
            {!isLoading && initialValues ? (
                <CityForm
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    isLoading={loading}
                    isEdit={true}
                />
            ) : (
                <div className="flex justify-center items-center h-64">
                  <p className="text-lg text-gray-500">Loading city information...</p>
                </div>
            )}
          </CardBox>
        </SectionMain>
      </>
  )
}

EditCity.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default EditCity
