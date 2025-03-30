import { mdiChartTimelineVariant } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import CardBox from '@/components/Cardbox/CardBox';
import LayoutAuthenticated from '@/layouts/Authenticated';
import SectionMain from '@/components/Section/SectionMain';
import SectionTitleLineWithButton from '@/components/Section/SectionTitleLineWithButton';
import { getPageTitle } from '@/config';
import { create } from '@/stores/thunks/property-types';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { IPropertyType } from "@/interfaces";
import PropertyTypeForm from '@/components/Property_types/PropertyTypeForm';
import BreadcrumbsBar from "@/components/BreadcrumbsBar";

const NewPropertyTypePage = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.property_types);

  // Initial values
  const initialValues: IPropertyType = {
    titleRu: '',
    titleEn: '',
    titleTm: '',
    dealTypes: [],
  };

  // Handle form submission
  const handleSubmit = async (data: IPropertyType) => {
    await dispatch(create(data));
  };

  return (
      <>
        <Head>
          <title>{getPageTitle('New Property Type')}</title>
        </Head>
        <SectionMain>
          <SectionTitleLineWithButton
              icon={mdiChartTimelineVariant}
              title="New Property Type"
              main
          >
            <BreadcrumbsBar items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Property Types', href: 'property_types/property_types-list/' },
              { label: 'New Property Type', href: 'property_types/property_types-new/' }
            ]} />
          </SectionTitleLineWithButton>
          <CardBox>
            <PropertyTypeForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                isLoading={loading}
            />
          </CardBox>
        </SectionMain>
      </>
  );
};

NewPropertyTypePage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default NewPropertyTypePage;
