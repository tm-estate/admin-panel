import { mdiChartTimelineVariant } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement } from 'react';
import CardBox from '@/components/Cardbox/CardBox';
import LayoutAuthenticated from '@/layouts/Authenticated';
import SectionMain from '@/components/Section/SectionMain';
import SectionTitleLineWithButton from '@/components/Section/SectionTitleLineWithButton';
import TableSampleClients from '@/components/TableSampleClients';
import { getPageTitle } from '@/config';

const TablesPage = () => {
  return (
    <>
      <Head>
        <title>{getPageTitle('Tables')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title='Table'
          main
        >
          Breadcrumbs
        </SectionTitleLineWithButton>
        <CardBox className='mb-6' hasTable>
          <TableSampleClients />
        </CardBox>
      </SectionMain>
    </>
  );
};

TablesPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default TablesPage;
