import React, { ReactElement } from 'react';
import Head from 'next/head';
import { mdiChartTimelineVariant } from '@mdi/js';
import 'react-toastify/dist/ReactToastify.min.css';
import CardBox from '@/components/Cardbox/CardBox';
import LayoutAuthenticated from '@/layouts/Authenticated';
import SectionMain from '@/components/Section/SectionMain';
import SectionTitleLineWithButton from '@/components/Section/SectionTitleLineWithButton';
import { getPageTitle } from '@/config';
import { create } from '@/stores/thunks/city-areas';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { ICityArea } from "@/interfaces";
import CityAreaForm from '@/components/City_areas/CityAreaForm';
import BreadcrumbsBar from "@/components/BreadcrumbsBar";

const NewCityAreaPage = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.city_areas);

  // Initial values
  const initialValues: ICityArea = {
    titleEn: '',
    titleRu: '',
    titleTm: '',
    coordinate: {
      latitude: null,
      longitude: null,
    },
  };

  // Handle form submission
  const handleSubmit = async (data: ICityArea) => {
    await dispatch(create(data));
  };

  return (
      <>
        <Head>
          <title>{getPageTitle('New City Area')}</title>
        </Head>
        <SectionMain>
          <SectionTitleLineWithButton
              icon={mdiChartTimelineVariant}
              title="New City Area"
              main
          >
            <BreadcrumbsBar items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'City Areas', href: '/city_areas/city_areas-list' },
              { label: 'New City Area', href: '/city_areas/city_areas-new' }
            ]} />
          </SectionTitleLineWithButton>
          <CardBox>
            <CityAreaForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                isLoading={loading}
            />
          </CardBox>
        </SectionMain>
      </>
  );
};

NewCityAreaPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default NewCityAreaPage;
