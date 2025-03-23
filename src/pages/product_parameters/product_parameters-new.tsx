import { mdiChartTimelineVariant } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import CardBox from '@/components/CardBox';
import LayoutAuthenticated from '@/layouts/Authenticated';
import SectionMain from '@/components/SectionMain';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton';
import { getPageTitle } from '@/config';
import { create } from '@/stores/thunks/product-parameters';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { IProductParameter } from "@/interfaces";
import ProductParameterForm from '@/components/Product_parameters/ProductParameterForm';
import BreadcrumbsBar from "@/components/BreadcrumbsBar";

const NewProductParameterPage = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.product_parameters);

  // Initial values
  const initialValues: IProductParameter = {
    titleEn: '',
    titleRu: '',
    titleTm: '',
    selectType: '',
    isRequired: false,
    dealTypes: [],
    propertyTypes: [],
    key: '',
    items: [],
  };

  // Handle form submission
  const handleSubmit = async (data: IProductParameter) => {
    await dispatch(create(data));
  };

  return (
      <>
        <Head>
          <title>{getPageTitle('New Product Parameter')}</title>
        </Head>
        <SectionMain>
          <SectionTitleLineWithButton
              icon={mdiChartTimelineVariant}
              title="New Product Parameter"
              main
          >
            <BreadcrumbsBar items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Product Parameters', href: '/product_parameters/product_parameters-list' },
              { label: 'New Product Parameter', href: '/product_parameters/product_parameters-new' }
            ]} />
          </SectionTitleLineWithButton>
          <CardBox>
            <ProductParameterForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                isLoading={loading}
            />
          </CardBox>
        </SectionMain>
      </>
  );
};

NewProductParameterPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default NewProductParameterPage;
