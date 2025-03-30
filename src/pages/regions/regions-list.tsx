import { mdiChartTimelineVariant, mdiPlus, mdiDownload } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement } from 'react';
import CardBox from '@/components/Cardbox/CardBox';
import LayoutAuthenticated from '@/layouts/Authenticated';
import SectionMain from '@/components/Section/SectionMain';
import SectionTitleLineWithButton from '@/components/Section/SectionTitleLineWithButton';
import { getPageTitle } from '@/config';
import TableRegions from '@/components/Regions/TableRegions';
import BaseButton from '@/components/Base/BaseButton';
import axios from 'axios';
import BreadcrumbsBar from "@/components/BreadcrumbsBar";
import { withAuth } from "@/components/auth/withAuth";
import { Permission } from "@/constants/permissions";
import { PermissionGuard } from "@/components/auth/PermissionGuard";

const RegionsPage = () => {
  // Download CSV of regions
  const getRegionsCSV = async () => {
    const response = await axios({
      url: '/regions?filetype=csv',
      method: 'GET',
      responseType: 'blob',
    });
    const type = response.headers['content-type'];
    const blob = new Blob([response.data], { type: type });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'regions_export.csv';
    link.click();
  };

  return (
      <>
        <Head>
          <title>{getPageTitle('Regions')}</title>
        </Head>
        <SectionMain>
          <SectionTitleLineWithButton
              icon={mdiChartTimelineVariant}
              title='Regions Management'
              main
          >
            <BreadcrumbsBar items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Regions', href: '/regions/regions-list' },
            ]} />
          </SectionTitleLineWithButton>

          {/* Action Buttons */}
          <CardBox className='mb-6 flex flex-wrap gap-4'>
            <PermissionGuard permission={Permission.CREATE_REGION}>
              <BaseButton
                  className='mr-2'
                  href='/regions/regions-new'
                  color='success'
                  label='Add New Region'
                  icon={mdiPlus}
              />
            </PermissionGuard>
            <BaseButton
                color='warning'
                label='Export CSV'
                icon={mdiDownload}
                onClick={getRegionsCSV}
            />
          </CardBox>

          {/* Regions Table */}
          <CardBox className='mb-6' hasTable>
            <TableRegions />
          </CardBox>
        </SectionMain>
      </>
  );
};

RegionsPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default withAuth(RegionsPage, {
  permissions: [Permission.VIEW_PRODUCTS]
});
