import { mdiChartTimelineVariant, mdiPlus, mdiDownload } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement } from 'react';
import CardBox from '@/components/Cardbox/CardBox';
import LayoutAuthenticated from '@/layouts/Authenticated';
import SectionMain from '@/components/Section/SectionMain';
import SectionTitleLineWithButton from '@/components/Section/SectionTitleLineWithButton';
import { getPageTitle } from '@/config';
import TableProductParameters from '@/components/Product_parameters/TableProductParameters';
import BaseButton from '@/components/Base/BaseButton';
import axios from 'axios';
import BreadcrumbsBar from "@/components/BreadcrumbsBar";

const ProductParametersPage = () => {
  // Download CSV of product parameters
  const getProductParametersCSV = async () => {
    const response = await axios({
      url: '/productParameters?filetype=csv',
      method: 'GET',
      responseType: 'blob',
    });
    const type = response.headers['content-type'];
    const blob = new Blob([response.data], { type: type });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'product_parameters_export.csv';
    link.click();
  };

  return (
      <>
        <Head>
          <title>{getPageTitle('Product Parameters')}</title>
        </Head>
        <SectionMain>
          <SectionTitleLineWithButton
              icon={mdiChartTimelineVariant}
              title='Product Parameters Management'
              main
          >
            <BreadcrumbsBar items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Product Parameters', href: '/product_parameters/product_parameters-list' },
            ]} />
          </SectionTitleLineWithButton>

          {/* Action Buttons */}
          <CardBox className='mb-6 flex flex-wrap gap-4'>
            <BaseButton
                className='mr-2'
                href='/product_parameters/product_parameters-new'
                color='success'
                label='Add New Product Parameter'
                icon={mdiPlus}
            />
            <BaseButton
                color='warning'
                label='Export CSV'
                icon={mdiDownload}
                onClick={getProductParametersCSV}
            />
          </CardBox>

          {/* Product Parameters Table */}
          <CardBox className='mb-6' hasTable>
            <TableProductParameters />
          </CardBox>
        </SectionMain>
      </>
  );
};

ProductParametersPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default ProductParametersPage;
