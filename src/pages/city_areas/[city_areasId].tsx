import { mdiChartTimelineVariant } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import CardBox from '@/components/Cardbox/CardBox';
import LayoutAuthenticated from '@/layouts/Authenticated';
import SectionMain from '@/components/Section/SectionMain';
import SectionTitleLineWithButton from '@/components/Section/SectionTitleLineWithButton';
import { getPageTitle } from '@/config';
import { update, getCityArea } from '@/stores/thunks/city-areas';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { useRouter } from 'next/router';
import { ICityArea } from "@/interfaces";
import CityAreaForm from '@/components/City_areas/CityAreaForm';
import BreadcrumbsBar from "@/components/BreadcrumbsBar";

const EditCityArea = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { city_areasId } = router.query;
  const { city_area, loading } = useAppSelector((state) => state.city_areas);
  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<ICityArea | null>(null);

  // Initial empty state
  const emptyCityArea: ICityArea = {
    titleEn: '',
    titleRu: '',
    titleTm: '',
    coordinate: {
      latitude: null,
      longitude: null,
    },
  };

  // Fetch city area data when component mounts
  useEffect(() => {
    if (city_areasId) {
      setIsLoading(true);
      dispatch(getCityArea(city_areasId));
    }
  }, [city_areasId, dispatch]);

  // Update form when city area data is loaded
  useEffect(() => {
    if (city_area && typeof city_area === 'object') {
      setInitialValues(city_area);
      setIsLoading(false);
    }
  }, [city_area]);

  // Handle form submission
  const handleSubmit = async (data: ICityArea) => {
    await dispatch(update({ id: city_areasId, data }));
  };

  return (
      <>
        <Head>
          <title>{getPageTitle('Edit City Area')}</title>
        </Head>
        <SectionMain>
          <SectionTitleLineWithButton
              icon={mdiChartTimelineVariant}
              title="Edit City Area"
              main
          >
            <BreadcrumbsBar items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'City Areas', href: '/city_areas/city_areas-list' },
              { label: `Edit City Area ${city_areasId}`, href: `/city_areas/${city_areasId}` }
            ]} />
          </SectionTitleLineWithButton>
          <CardBox>
            {!isLoading && initialValues ? (
                <CityAreaForm
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    isLoading={loading}
                    isEdit={true}
                />
            ) : (
                <div className="flex justify-center items-center h-64">
                  <p className="text-lg text-gray-500">Loading city area information...</p>
                </div>
            )}
          </CardBox>
        </SectionMain>
      </>
  );
};

EditCityArea.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default EditCityArea;
