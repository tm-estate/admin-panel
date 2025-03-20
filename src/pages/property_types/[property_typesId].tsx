import { mdiChartTimelineVariant } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import CardBox from '@/components/CardBox';
import LayoutAuthenticated from '@/layouts/Authenticated';
import SectionMain from '@/components/SectionMain';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton';
import { getPageTitle } from '@/config';
import { update, getPropertyType } from '@/stores/thunks/property-types';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { useRouter } from 'next/router';
import { IPropertyType } from "@/interfaces";
import PropertyTypeForm from '@/components/Property_types/PropertyTypeForm';
import BreadcrumbsBar from "@/components/BreadcrumbsBar";

const EditPropertyType = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { property_typesId } = router.query;
  const { property_type, loading } = useAppSelector((state) => state.property_types);
  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<IPropertyType | null>(null);

  // Fetch property type data when component mounts
  useEffect(() => {
    if (property_typesId) {
      setIsLoading(true);
      dispatch(getPropertyType(property_typesId));
    }
  }, [property_typesId, dispatch]);

  // Update form when property type data is loaded
  useEffect(() => {
    if (property_type && typeof property_type === 'object') {
      setInitialValues(property_type);
      setIsLoading(false);
    }
  }, [property_type]);

  // Handle form submission
  const handleSubmit = async (data: IPropertyType) => {
    await dispatch(update({ id: property_typesId, data }));
  };

  return (
      <>
        <Head>
          <title>{getPageTitle('Edit Property Type')}</title>
        </Head>
        <SectionMain>
          <SectionTitleLineWithButton
              icon={mdiChartTimelineVariant}
              title="Edit Property Type"
              main
          >
            <BreadcrumbsBar items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Property Types', href: 'property_types/property_types-list/' },
              { label: `Edit Property Type ${property_typesId}`, href: `/property_types/${property_typesId}` }
            ]} />
          </SectionTitleLineWithButton>
          <CardBox>
            {!isLoading && initialValues ? (
                <PropertyTypeForm
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    isLoading={loading}
                    isEdit={true}
                />
            ) : (
                <div className="flex justify-center items-center h-64">
                  <p className="text-lg text-gray-500">Loading property type information...</p>
                </div>
            )}
          </CardBox>
        </SectionMain>
      </>
  );
};

EditPropertyType.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default EditPropertyType;
