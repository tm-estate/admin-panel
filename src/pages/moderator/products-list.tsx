import { mdiCheckCircle, mdiCloseCircle, mdiHistory, mdiFilterVariant } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useState } from 'react';
import CardBox from '@/components/Cardbox/CardBox';
import LayoutAuthenticated from '@/layouts/Authenticated';
import SectionMain from '@/components/Section/SectionMain';
import SectionTitleLineWithButton from '@/components/Section/SectionTitleLineWithButton';
import { getPageTitle } from '@/config';
import { IFilterItem } from '@/interfaces';
import BreadcrumbsBar from "@/components/BreadcrumbsBar";
import { Permission } from "@/constants/permissions";
import { withAuth } from "@/components/auth/withAuth";
import { NextPageWithLayout } from "@/types/next";
import { productFilters } from "@/constants/productFilters";
import ProductModerationList from '@/components/Moderation/ProductModerationList';

const ProductModerationPage: NextPageWithLayout = () => {


    return (
        <>
            <Head>
                <title>{getPageTitle('Product Moderation')}</title>
            </Head>
            <SectionMain>
                <SectionTitleLineWithButton
                    icon={mdiHistory}
                    title='Product Moderation'
                    main
                >
                    <BreadcrumbsBar items={[
                        { label: 'Dashboard', href: '/dashboard' },
                        { label: 'Product Moderation', href: '/products/moderation' },
                    ]} />
                </SectionTitleLineWithButton>

                {/* Product Moderation List */}
                <ProductModerationList />
            </SectionMain>
        </>
    );
};

ProductModerationPage.getLayout = function getLayout(page: ReactElement) {
    return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default withAuth(ProductModerationPage, {
    permissions: [Permission.MODERATE_PRODUCTS]
});
