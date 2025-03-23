import { mdiChartTimelineVariant, mdiPlus, mdiDownload } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement } from 'react';
import CardBox from '@/components/Cardbox/CardBox';
import LayoutAuthenticated from '@/layouts/Authenticated';
import SectionMain from '@/components/Section/SectionMain';
import SectionTitleLineWithButton from '@/components/Section/SectionTitleLineWithButton';
import { getPageTitle } from '@/config';
import TableCityAreas from '@/components/City_areas/TableCityAreas';
import BaseButton from '@/components/Base/BaseButton';
import axios from 'axios';
import BreadcrumbsBar from "@/components/BreadcrumbsBar";

const CityAreasPage = () => {
  // Download CSV of city areas
  const getCityAreasCSV = async () => {
    const response = await axios({
      url: '/city_areas?filetype=csv',
      method: 'GET',
      responseType: 'blob',
    });
    const type = response.headers['content-type'];
    const blob = new Blob([response.data], { type: type });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'city_areas_export.csv';
    link.click();
  };

  return (
      <>
        <Head>
          <title>{getPageTitle('City Areas')}</title>
        </Head>
        <SectionMain>
          <SectionTitleLineWithButton
              icon={mdiChartTimelineVariant}
              title='City Areas Management'
              main
          >
            <BreadcrumbsBar items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'City Areas', href: '/city_areas/city_areas-list' },
            ]} />
          </SectionTitleLineWithButton>

          {/* Action Buttons */}
          <CardBox className='mb-6 flex flex-wrap gap-4'>
            <BaseButton
                className='mr-2'
                href='/city_areas/city_areas-new'
                color='success'
                label='Add New City Area'
                icon={mdiPlus}
            />
            <BaseButton
                color='warning'
                label='Export CSV'
                icon={mdiDownload}
                onClick={getCityAreasCSV}
            />
          </CardBox>

          {/* City Areas Table */}
          <CardBox className='mb-6' hasTable>
            <TableCityAreas />
          </CardBox>
        </SectionMain>
      </>
  );
};

CityAreasPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default CityAreasPage;
