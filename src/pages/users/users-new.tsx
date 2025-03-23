import { mdiChartTimelineVariant } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import CardBox from '@/components/CardBox';
import LayoutAuthenticated from '@/layouts/Authenticated';
import SectionMain from '@/components/SectionMain';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton';
import { getPageTitle } from '@/config';
import { create } from '@/stores/thunks/users';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { IUser } from "@/interfaces";
import UserForm from '@/components/Users/UserForm';
import BreadcrumbsBar from "@/components/BreadcrumbsBar";

const NewUserPage = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.users);

  const initialValues: IUser = {
    name: '',
    phone: '',
    email: '',
    role: 'user',
    isAgent: false,
    isPhoneNumberConfirmed: false,
    disabled: false,
    savedProducts: [],
  };

  const handleSubmit = async (data: IUser) => {
    await dispatch(create(data));
  };

  return (
      <>
        <Head>
          <title>{getPageTitle('New User')}</title>
        </Head>
        <SectionMain>
          <SectionTitleLineWithButton
              icon={mdiChartTimelineVariant}
              title="New User"
              main
          >
            <BreadcrumbsBar items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Users', href: '/users/users-list' },
              { label: 'New User', href: '/users/users-new' }
            ]} />
          </SectionTitleLineWithButton>
          <CardBox>
            <UserForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                isLoading={loading}
            />
          </CardBox>
        </SectionMain>
      </>
  );
};

NewUserPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default NewUserPage;
