import { mdiChartTimelineVariant, mdiPlus, mdiDownload } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement } from 'react';
import CardBox from '@/components/Cardbox/CardBox';
import LayoutAuthenticated from '@/layouts/Authenticated';
import SectionMain from '@/components/Section/SectionMain';
import SectionTitleLineWithButton from '@/components/Section/SectionTitleLineWithButton';
import { getPageTitle } from '@/config';
import TableDealTypes from '@/components/Deal_types/TableDealTypes';
import BaseButton from '@/components/Base/BaseButton';
import axios from 'axios';
import BreadcrumbsBar from "@/components/BreadcrumbsBar";
import { withAuth } from "@/components/auth/withAuth";
import { Permission } from "@/constants/permissions";
import { PermissionGuard } from "@/components/auth/PermissionGuard";

const DealTypesPage = () => {
  // Download CSV of deal types
  const getDealTypesCSV = async () => {
    const response = await axios({
      url: '/dealTypes?filetype=csv',
      method: 'GET',
      responseType: 'blob',
    });
    const type = response.headers['content-type'];
    const blob = new Blob([response.data], { type: type });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'deal_types_export.csv';
    link.click();
  };

  return (
      <>
        <Head>
          <title>{getPageTitle('Deal Types')}</title>
        </Head>
        <SectionMain>
          <SectionTitleLineWithButton
              icon={mdiChartTimelineVariant}
              title='Deal Types Management'
              main
          >
            <BreadcrumbsBar items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Deal Types', href: '/deal_types/deal_types-list' },
            ]} />
          </SectionTitleLineWithButton>

          {/* Action Buttons */}
          <CardBox className='mb-6 flex flex-wrap gap-4'>
            <PermissionGuard permission={Permission.CREATE_DEAL_TYPE}>
              <BaseButton
                  className='mr-2'
                  href='/deal_types/deal_types-new'
                  color='success'
                  label='Add New Deal Type'
                  icon={mdiPlus}
              />
            </PermissionGuard>
            <BaseButton
                color='warning'
                label='Export CSV'
                icon={mdiDownload}
                onClick={getDealTypesCSV}
            />
          </CardBox>

          {/* Deal Types Table */}
          <CardBox className='mb-6' hasTable>
            <TableDealTypes />
          </CardBox>
        </SectionMain>
      </>
  );
};

DealTypesPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default withAuth(DealTypesPage, {
  permissions: [Permission.VIEW_DEAL_TYPES]
});
