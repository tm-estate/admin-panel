import { mdiChartTimelineVariant } from '@mdi/js';
import Head from 'next/head';
import React from 'react';
import axios from 'axios';
import type { ReactElement } from 'react';
import LayoutAuthenticated from '../layouts/Authenticated';
import SectionMain from '../components/SectionMain';
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton';
import { mdiInformation } from '@mdi/js';
import BaseIcon from '../components/BaseIcon';
import { getPageTitle } from '../config';
import Link from 'next/link';

const Dashboard = () => {
  const [users, setUsers] = React.useState('Loading...');
  const [deal_types, setDeal_types] = React.useState('Loading...');
  const [property_types, setProperty_types] = React.useState('Loading...');

  async function loadData() {
    const fns = [setUsers, setDeal_types, setProperty_types];

    const responseUsers = await axios.get(`/users/count`);
    const responseDeal_types = await axios.get(`/deal_types/count`);
    const responseProperty_types = await axios.get(`/property_types/count`);
    Promise.all([responseUsers, responseDeal_types, responseProperty_types])
      .then((res) => res.map((el) => el.data))
      .then((data) => data.forEach((el, i) => fns[i](el.count)));
  }

  React.useEffect(() => {
    loadData().then();
  }, []);
  return (
    <>
      <Head>
        <title>{getPageTitle('Dashboard')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title='Overview'
          main
        >
          Breadcrumbs
        </SectionTitleLineWithButton>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6'>
          <Link href={'/users/users-list'} className='mr-3'>
            <div className='rounded dark:bg-gray-900/70 bg-white border border-pavitra-400 p-6'>
              <div className='flex justify-between align-center'>
                <div>
                  <div className='text-lg leading-tight text-gray-500 dark:text-gray-400'>
                    Users
                  </div>
                  <div className='text-3xl leading-tight font-semibold'>
                    {users}
                  </div>
                </div>
                <div>
                  <BaseIcon
                    className='text-blue-500'
                    w='w-16'
                    h='h-16'
                    size={48}
                    path={mdiInformation}
                  />
                </div>
              </div>
            </div>
          </Link>

          <Link href={'/deal_types/deal_types-list'} className='mr-3'>
            <div className='rounded dark:bg-gray-900/70 bg-white border border-pavitra-400 p-6'>
              <div className='flex justify-between align-center'>
                <div>
                  <div className='text-lg leading-tight text-gray-500 dark:text-gray-400'>
                    Deal_types
                  </div>
                  <div className='text-3xl leading-tight font-semibold'>
                    {deal_types}
                  </div>
                </div>
                <div>
                  <BaseIcon
                    className='text-blue-500'
                    w='w-16'
                    h='h-16'
                    size={48}
                    path={mdiInformation}
                  />
                </div>
              </div>
            </div>
          </Link>

          <Link href={'/property_types/property_types-list'} className='mr-3'>
            <div className='rounded dark:bg-gray-900/70 bg-white border border-pavitra-400 p-6'>
              <div className='flex justify-between align-center'>
                <div>
                  <div className='text-lg leading-tight text-gray-500 dark:text-gray-400'>
                    Property_types
                  </div>
                  <div className='text-3xl leading-tight font-semibold'>
                    {property_types}
                  </div>
                </div>
                <div>
                  <BaseIcon
                    className='text-blue-500'
                    w='w-16'
                    h='h-16'
                    size={48}
                    path={mdiInformation}
                  />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </SectionMain>
    </>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default Dashboard;
