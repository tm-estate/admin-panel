import {mdiChartTimelineVariant} from "@mdi/js";
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import CardBox from '@/components/Cardbox/CardBox';
import LayoutAuthenticated from '@/layouts/Authenticated';
import SectionMain from '@/components/Section/SectionMain';
import SectionTitleLineWithButton from '@/components/Section/SectionTitleLineWithButton';
import { getPageTitle } from '@/config';
import { update, getUser } from '@/stores/thunks/users';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { useRouter } from 'next/router';
import { IUser } from "@/interfaces";
import UserForm from '@/components/Users/UserForm';
import BreadcrumbsBar from "@/components/BreadcrumbsBar";

const EditUser = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { usersId } = router.query;
  const { user, loading } = useAppSelector((state) => state.users);
  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<IUser | null>(null);

  useEffect(() => {
    if (usersId) {
      setIsLoading(true);
      dispatch(getUser(usersId));
    }
  }, [usersId, dispatch]);

  useEffect(() => {
    if (user && typeof user === 'object') {
      setInitialValues(user);
      setIsLoading(false);
    }
  }, [user]);

  const handleSubmit = async (data: IUser) => {
    await dispatch(update({ id: usersId, data }));
  };

  return (
      <>
        <Head>
          <title>{getPageTitle('Edit User')}</title>
        </Head>
        <SectionMain>
          <SectionTitleLineWithButton
              icon={mdiChartTimelineVariant}
              title="Edit User"
              main
          >
            <BreadcrumbsBar items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Users', href: '/users/users-list' },
              { label: `Edit User ${usersId}`, href: `/users/${usersId}` }
            ]} />
          </SectionTitleLineWithButton>
          <CardBox>
            {!isLoading && initialValues ? (
                <UserForm
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    isLoading={loading}
                    isEdit={true}
                />
            ) : (
                <div className="flex justify-center items-center h-64">
                  <p className="text-lg text-gray-500">Loading user information...</p>
                </div>
            )}
          </CardBox>
        </SectionMain>
      </>
  );
};

EditUser.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default EditUser;
