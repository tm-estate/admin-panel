import { mdiChartTimelineVariant } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import CardBox from '@/components/CardBox';
import LayoutAuthenticated from '@/layouts/Authenticated';
import SectionMain from '@/components/SectionMain';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton';
import { getPageTitle } from '@/config';
import { update, getProduct } from '@/stores/thunks/products';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { useRouter } from 'next/router';
import { IProduct } from "@/interfaces";
import ProductForm from '@/components/Products/ProductForm';
import BreadcrumbsBar from "@/components/BreadcrumbsBar";

const EditProduct = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { productsId } = router.query;
    const { product, loading } = useAppSelector((state) => state.products);
    const [isLoading, setIsLoading] = useState(true);
    const [initialValues, setInitialValues] = useState<IProduct | null>(null);

    useEffect(() => {
        if (productsId) {
            setIsLoading(true);
            dispatch(getProduct(productsId));
        }
    }, [productsId, dispatch]);

    useEffect(() => {
        if (product && typeof product === 'object') {
            setInitialValues(product);
            setIsLoading(false);
        }
    }, [product]);

    const handleSubmit = async (data: IProduct) => {
        await dispatch(update({ id: productsId, data }));
        await router.push('/products/products-list');
    };

    return (
        <>
            <Head>
                <title>{getPageTitle('Edit Product')}</title>
            </Head>
            <SectionMain>
                <SectionTitleLineWithButton
                    icon={mdiChartTimelineVariant}
                    title="Edit Product"
                    main
                >
                    <BreadcrumbsBar items={[
                        { label: 'Dashboard', href: '/dashboard' },
                        { label: 'Products', href: '/products/products-list' },
                        { label: `Edit Product ${productsId}`, href: `/products/${productsId}` }
                    ]} />
                </SectionTitleLineWithButton>

                <CardBox className="mb-6">
                    {!isLoading && initialValues ? (
                        <ProductForm
                            initialValues={initialValues}
                            onSubmit={handleSubmit}
                            isLoading={loading}
                            isEdit={true}
                        />
                    ) : (
                        <div className="flex justify-center items-center h-64">
                            <p className="text-lg text-gray-500">Loading product information...</p>
                        </div>
                    )}
                </CardBox>
            </SectionMain>
        </>
    );
};

EditProduct.getLayout = function getLayout(page: ReactElement) {
    return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default EditProduct;
