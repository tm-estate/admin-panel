import { mdiChartTimelineVariant } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import CardBox from '@/components/CardBox';
import LayoutAuthenticated from '@/layouts/Authenticated';
import SectionMain from '@/components/SectionMain';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton';
import { getPageTitle } from '@/config';
import { update, getProductParameter } from '@/stores/thunks/product-parameters';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { useRouter } from 'next/router';
import { IProductParameter } from "@/interfaces";
import ProductParameterForm from '@/components/Product_parameters/ProductParameterForm';
import BreadcrumbsBar from "@/components/BreadcrumbsBar";

const EditProductParameter = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { product_parametersId } = router.query;
  const { product_parameter, loading } = useAppSelector((state) => state.product_parameters);
  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<IProductParameter | null>(null);

  // Fetch product parameter data when component mounts
  useEffect(() => {
    if (product_parametersId) {
      setIsLoading(true);
      dispatch(getProductParameter(product_parametersId));
    }
  }, [product_parametersId, dispatch]);

  // Update form when product parameter data is loaded
  useEffect(() => {
    if (product_parameter && typeof product_parameter === 'object') {
      setInitialValues(product_parameter);
      setIsLoading(false);
    }
  }, [product_parameter]);

  // Handle form submission
  const handleSubmit = async (data: IProductParameter) => {
    await dispatch(update({ id: product_parametersId, data }));
  };

  return (
      <>
        <Head>
          <title>{getPageTitle('Edit Product Parameter')}</title>
        </Head>
        <SectionMain>
          <SectionTitleLineWithButton
              icon={mdiChartTimelineVariant}
              title="Edit Product Parameter"
              main
          >
            <BreadcrumbsBar items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Product Parameters', href: '/product_parameters/product_parameters-list' },
              { label: `Edit Product Parameter ${product_parametersId}`, href: `/product_parameters/${product_parametersId}` }
            ]} />
          </SectionTitleLineWithButton>
          <CardBox>
            {!isLoading && initialValues ? (
                <ProductParameterForm
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    isLoading={loading}
                    isEdit={true}
                />
            ) : (
                <div className="flex justify-center items-center h-64">
                  <p className="text-lg text-gray-500">Loading product parameter information...</p>
                </div>
            )}
          </CardBox>
        </SectionMain>
      </>
  );
};

EditProductParameter.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default EditProductParameter;
