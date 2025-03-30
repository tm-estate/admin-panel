import { mdiChartTimelineVariant } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import CardBox from '@/components/Cardbox/CardBox';
import LayoutAuthenticated from '@/layouts/Authenticated';
import SectionMain from '@/components/Section/SectionMain';
import SectionTitleLineWithButton from '@/components/Section/SectionTitleLineWithButton';
import { getPageTitle } from '@/config';
import { create } from '@/stores/thunks/deal-types';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { IDealType } from "@/interfaces";
import DealTypeForm from '@/components/Deal_types/DealTypeForm';
import BreadcrumbsBar from "@/components/BreadcrumbsBar";

const NewDealTypePage = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.deal_types);

  // Initial values
  const initialValues: IDealType = {
    titleRu: '',
    titleEn: '',
    titleTm: '',
  };

  // Handle form submission
  const handleSubmit = async (data: IDealType) => {
    await dispatch(create(data));
  };

  return (
      <>
        <Head>
          <title>{getPageTitle('New Deal Type')}</title>
        </Head>
        <SectionMain>
          <SectionTitleLineWithButton
              icon={mdiChartTimelineVariant}
              title="New Deal Type"
              main
          >
            <BreadcrumbsBar items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Deal Types', href: '/deal_types/deal_types-list' },
              { label: 'New Deal Type', href: '/deal_types/deal_types-new' }
            ]} />
          </SectionTitleLineWithButton>
          <CardBox>
            <DealTypeForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                isLoading={loading}
            />
          </CardBox>
        </SectionMain>
      </>
  );
};

NewDealTypePage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default NewDealTypePage;
