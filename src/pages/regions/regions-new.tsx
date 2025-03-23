import { mdiChartTimelineVariant } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import CardBox from '@/components/CardBox';
import LayoutAuthenticated from '@/layouts/Authenticated';
import SectionMain from '@/components/SectionMain';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton';
import { getPageTitle } from '@/config';
import { create } from '@/stores/thunks/regions';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { IRegion } from "@/interfaces";
import RegionForm from '@/components/Regions/RegionForm';
import BreadcrumbsBar from "@/components/BreadcrumbsBar";

const NewRegionPage = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.regions);

  // Initial values
  const initialValues: IRegion = {
    titleEn: '',
    titleRu: '',
    titleTm: '',
    coordinate: {
      latitude: null,
      longitude: null,
    },
    cities: [],
  };

  // Handle form submission
  const handleSubmit = async (data: IRegion) => {
    await dispatch(create(data));
  };

  return (
      <>
        <Head>
          <title>{getPageTitle('New Region')}</title>
        </Head>
        <SectionMain>
          <SectionTitleLineWithButton
              icon={mdiChartTimelineVariant}
              title="New Region"
              main
          >
            <BreadcrumbsBar items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Regions', href: '/regions/regions-list' },
              { label: 'New Region', href: '/regions/regions-new/' }
            ]} />
          </SectionTitleLineWithButton>
          <CardBox>
            <RegionForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                isLoading={loading}
            />
          </CardBox>
        </SectionMain>
      </>
  );
};

NewRegionPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default NewRegionPage;
