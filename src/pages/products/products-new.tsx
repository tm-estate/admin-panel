import { mdiChartTimelineVariant } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import CardBox from '@/components/Cardbox/CardBox';
import LayoutAuthenticated from '@/layouts/Authenticated';
import SectionMain from '@/components/Section/SectionMain';
import SectionTitleLineWithButton from '@/components/Section/SectionTitleLineWithButton';
import { getPageTitle } from '@/config';
import { create } from '@/stores/thunks/products';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { IProduct } from "@/interfaces";
import ProductForm from '@/components/Products/ProductForm';
import BreadcrumbsBar from "@/components/BreadcrumbsBar";


const ProductsNewPage = () => {
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.products);

    const initialValues: IProduct = {
        images: [],
        name: '',
        description: '',
        address: '',
        price: 0,
        dealType: null,
        propertyType: null,
        region: null,
        city: null,
        cityArea: null,
        productCharacters: {
            bathroom: '',
            balcony: '',
            bedsQuantity: '',
            ceilingHeight: '',
            constructionYear: '',
            floor: '',
            homeInfrastructure: [],
            inBathroom: [],
            inKitchen: [],
            levelsNumber: '',
            lifeArrangement: [],
            propertyCondition: '',
            rentalType: '',
            repair: '',
            roomsQuantity: '',
            storeysNumber: '',
            studio: false,
            totalArea_sq_m: 0,
            wallMaterial: '',
        },
        coordinate: {
            latitude: null,
            longitude: null,
        },
    };

    const handleSubmit = async (data: IProduct) => {
        await dispatch(create(data));
    };

    return (
        <>
            <Head>
                <title>{getPageTitle('New Product')}</title>
            </Head>
            <SectionMain>
                <SectionTitleLineWithButton
                    icon={mdiChartTimelineVariant}
                    title="New Product"
                    main
                >
                    <BreadcrumbsBar items={[
                        { label: 'Dashboard', href: '/dashboard' },
                        { label: 'Products', href: '/products/products-list' },
                        { label: 'New Product', href: '/products/products-new/' }
                    ]} />
                </SectionTitleLineWithButton>

                <CardBox className="mb-6">
                    <ProductForm
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        isLoading={loading}
                    />
                </CardBox>
            </SectionMain>
        </>
    );
};

ProductsNewPage.getLayout = function getLayout(page: ReactElement) {
    return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default ProductsNewPage;
