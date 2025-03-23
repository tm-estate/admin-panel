import { mdiChartTimelineVariant, mdiPlus, mdiDownload } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement } from 'react';
import CardBox from '@/components/Cardbox/CardBox';
import LayoutAuthenticated from '@/layouts/Authenticated';
import SectionMain from '@/components/Section/SectionMain';
import SectionTitleLineWithButton from '@/components/Section/SectionTitleLineWithButton';
import { getPageTitle } from '@/config';
import TablePropertyTypes from '@/components/Property_types/TablePropertyTypes';
import BaseButton from '@/components/Base/BaseButton';
import axios from 'axios';
import BreadcrumbsBar from "@/components/BreadcrumbsBar";

const PropertyTypesPage = () => {
  // Download CSV of property types
  const getPropertyTypesCSV = async () => {
    const response = await axios({
      url: '/propertyTypes?filetype=csv',
      method: 'GET',
      responseType: 'blob',
    });
    const type = response.headers['content-type'];
    const blob = new Blob([response.data], { type: type });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'property_types_export.csv';
    link.click();
  };

  return (
      <>
        <Head>
          <title>{getPageTitle('Property Types')}</title>
        </Head>
        <SectionMain>
          <SectionTitleLineWithButton
              icon={mdiChartTimelineVariant}
              title='Property Types Management'
              main
          >
            <BreadcrumbsBar items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Property Types', href: 'property_types/property_types-list/' },
            ]} />
          </SectionTitleLineWithButton>

          {/* Action Buttons */}
          <CardBox className='mb-6 flex flex-wrap gap-4'>
            <BaseButton
                className='mr-2'
                href='/property_types/property_types-new'
                color='success'
                label='Add New Property Type'
                icon={mdiPlus}
            />
            <BaseButton
                color='warning'
                label='Export CSV'
                icon={mdiDownload}
                onClick={getPropertyTypesCSV}
            />
          </CardBox>

          {/* Property Types Table */}
          <CardBox className='mb-6' hasTable>
            <TablePropertyTypes />
          </CardBox>
        </SectionMain>
      </>
  );
};

PropertyTypesPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default PropertyTypesPage;
