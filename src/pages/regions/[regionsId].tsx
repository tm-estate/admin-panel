import { mdiChartTimelineVariant } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import CardBox from '@/components/CardBox';
import LayoutAuthenticated from '@/layouts/Authenticated';
import SectionMain from '@/components/SectionMain';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton';
import { getPageTitle } from '@/config';
import { update, getRegion } from '@/stores/thunks/regions';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { useRouter } from 'next/router';
import { IRegion } from "@/interfaces";
import RegionForm from '@/components/Regions/RegionForm';
import BreadcrumbsBar from "@/components/BreadcrumbsBar";

const EditRegion = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { regionsId } = router.query;
  const { region, loading } = useAppSelector((state) => state.regions);
  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<IRegion | null>(null);

  // Fetch region data when component mounts
  useEffect(() => {
    if (regionsId) {
      setIsLoading(true);
      dispatch(getRegion(regionsId));
    }
  }, [regionsId, dispatch]);

  // Update form when region data is loaded
  useEffect(() => {
    if (region && typeof region === 'object') {
      setInitialValues(region);
      setIsLoading(false);
    }
  }, [region]);

  // Handle form submission
  const handleSubmit = async (data: IRegion) => {
    await dispatch(update({ id: regionsId, data }));
  };

  return (
      <>
        <Head>
          <title>{getPageTitle('Edit Region')}</title>
        </Head>
        <SectionMain>
          <SectionTitleLineWithButton
              icon={mdiChartTimelineVariant}
              title="Edit Region"
              main
          >
            <BreadcrumbsBar items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Regions', href: '/regions/regions-list' },
              { label: `Edit Region ${regionsId}`, href: `/regions/${regionsId}` }
            ]} />
          </SectionTitleLineWithButton>
          <CardBox>
            {!isLoading && initialValues ? (
                <RegionForm
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    isLoading={loading}
                    isEdit={true}
                />
            ) : (
                <div className="flex justify-center items-center h-64">
                  <p className="text-lg text-gray-500">Loading region information...</p>
                </div>
            )}
          </CardBox>
        </SectionMain>
      </>
  );
};

EditRegion.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default EditRegion;
