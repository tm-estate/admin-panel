import { mdiChartTimelineVariant } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import CardBox from '@/components/CardBox';
import LayoutAuthenticated from '@/layouts/Authenticated';
import SectionMain from '@/components/SectionMain';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton';
import { getPageTitle } from '@/config';
import { update, getDealType } from '@/stores/thunks/deal-types';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { useRouter } from 'next/router';
import { IDealType } from "@/interfaces";
import DealTypeForm from '@/components/Deal_types/DealTypeForm';
import BreadcrumbsBar from "@/components/BreadcrumbsBar";

const EditDealType = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { deal_typesId } = router.query;
  const { deal_type, loading } = useAppSelector((state) => state.deal_types);
  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<IDealType | null>(null);

  // Fetch deal type data when component mounts
  useEffect(() => {
    if (deal_typesId) {
      setIsLoading(true);
      dispatch(getDealType(deal_typesId));
    }
  }, [deal_typesId, dispatch]);

  // Update form when deal type data is loaded
  useEffect(() => {
    if (deal_type && typeof deal_type === 'object') {
      setInitialValues(deal_type);
      setIsLoading(false);
    }
  }, [deal_type]);

  // Handle form submission
  const handleSubmit = async (data: IDealType) => {
    await dispatch(update({ id: deal_typesId, data }));
  };

  return (
      <>
        <Head>
          <title>{getPageTitle('Edit Deal Type')}</title>
        </Head>
        <SectionMain>
          <SectionTitleLineWithButton
              icon={mdiChartTimelineVariant}
              title="Edit Deal Type"
              main
          >
            <BreadcrumbsBar items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Deal Types', href: '/deal_types/deal_types-list' },
              { label: `Edit Deal Type ${deal_typesId}`, href: `/deal_types/${deal_typesId}` }
            ]} />
          </SectionTitleLineWithButton>
          <CardBox>
            {!isLoading && initialValues ? (
                <DealTypeForm
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    isLoading={loading}
                    isEdit={true}
                />
            ) : (
                <div className="flex justify-center items-center h-64">
                  <p className="text-lg text-gray-500">Loading deal type information...</p>
                </div>
            )}
          </CardBox>
        </SectionMain>
      </>
  );
};

EditDealType.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default EditDealType;
