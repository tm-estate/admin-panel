import { mdiChartTimelineVariant, mdiFilterVariant, mdiPlus, mdiDownload } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useState } from 'react';
import CardBox from '@/components/Cardbox/CardBox';
import LayoutAuthenticated from '@/layouts/Authenticated';
import SectionMain from '@/components/Section/SectionMain';
import SectionTitleLineWithButton from '@/components/Section/SectionTitleLineWithButton';
import { getPageTitle } from '@/config';
import TableUsers from '@/components/Users/TableUsers';
import BaseButton from '@/components/Base/BaseButton';
import axios from 'axios';
import { addFilter } from '@/components/Filters';
import { IFilterItem } from '@/interfaces';
import BreadcrumbsBar from "@/components/BreadcrumbsBar";
import { usersFilters } from "@/constants/usersFilters";
import { withAuth } from "@/components/auth/withAuth";
import { Permission } from "@/constants/permissions";
import { PermissionGuard } from "@/components/auth/PermissionGuard";

const UsersPage = () => {
  const [filterItems, setFilterItems] = useState<IFilterItem[]>([]);

  const [filters] = useState(usersFilters);

  const handleAddFilter = () => {
    addFilter(filters, setFilterItems, filterItems);
  };

  const getUsersCSV = async () => {
    try {
      const response = await axios({
        url: '/users?filetype=csv',
        method: 'GET',
        responseType: 'blob',
      });

      const type = response.headers['content-type'];
      const blob = new Blob([response.data], { type: type });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'users_export.csv';
      link.click();

      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };

  return (
      <>
        <Head>
          <title>{getPageTitle('Users')}</title>
        </Head>
        <SectionMain>
          <SectionTitleLineWithButton
              icon={mdiChartTimelineVariant}
              title='Users Management'
              main
          >
            <BreadcrumbsBar items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Users', href: '/users/users-list' },
            ]} />
          </SectionTitleLineWithButton>

          {/* Action Buttons */}
          <CardBox className='mb-6 flex flex-wrap gap-4'>
            <PermissionGuard permission={Permission.CREATE_USER}>
              <BaseButton
                  className='mr-2'
                  href='/users/users-new'
                  color='success'
                  label='Add New User'
                  icon={mdiPlus}
              />
            </PermissionGuard>
            <BaseButton
                color='info'
                className='mr-2'
                label='Add Filter'
                icon={mdiFilterVariant}
                onClick={handleAddFilter}
            />
            <BaseButton
                color='warning'
                label='Export CSV'
                icon={mdiDownload}
                onClick={getUsersCSV}
            />
          </CardBox>

          {/* Users Table with Filters */}
          <CardBox className='mb-6' hasTable>
            <TableUsers
                filterItems={filterItems}
                setFilterItems={setFilterItems}
                filters={filters}
            />
          </CardBox>
        </SectionMain>
      </>
  );
};

UsersPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default withAuth(UsersPage, {
  permissions: [Permission.VIEW_USERS]
});
