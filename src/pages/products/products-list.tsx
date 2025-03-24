import { mdiChartTimelineVariant, mdiFilterVariant, mdiPlus, mdiDownload } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useState } from 'react';
import CardBox from '@/components/Cardbox/CardBox';
import LayoutAuthenticated from '@/layouts/Authenticated';
import SectionMain from '@/components/Section/SectionMain';
import SectionTitleLineWithButton from '@/components/Section/SectionTitleLineWithButton';
import { getPageTitle } from '@/config';
import BaseButton from '@/components/Base/BaseButton';
import axios from 'axios';
import TableProducts from "@/components/Products/TableProducts";
import { IFilterItem } from '@/interfaces';
import BreadcrumbsBar from "@/components/BreadcrumbsBar";
import { addFilter } from "@/components/Filters";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { Permission } from "@/constants/permissions";
import { withAuth } from "@/components/auth/withAuth";
import { NextPageWithLayout } from "@/types/next";
import { productFilters } from "@/constants/productFilters";

const ProductsTablesPage: NextPageWithLayout = () => {
    const [filterItems, setFilterItems] = useState<IFilterItem[]>([]);
    const [filters] = useState(productFilters);

    const handleAddFilter = () => {
        addFilter(filters, setFilterItems, filterItems);
    };

    const downloadProductsCSV = async () => {
        try {
            const response = await axios({
                url: '/products?filetype=csv',
                method: 'GET',
                responseType: 'blob',
            });

            const type = response.headers['content-type'];
            const blob = new Blob([response.data], { type: type });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'products_export.csv';
            link.click();

            window.URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Error downloading CSV:', error);
        }
    };

    return (
        <>
            <Head>
                <title>{getPageTitle('Products')}</title>
            </Head>
            <SectionMain>
                <SectionTitleLineWithButton
                    icon={mdiChartTimelineVariant}
                    title='Products Management'
                    main
                >
                    <BreadcrumbsBar items={[
                        { label: 'Dashboard', href: '/dashboard' },
                        { label: 'Products', href: '/products/products-list' },
                    ]} />
                </SectionTitleLineWithButton>

                {/* Action Buttons */}
                <CardBox className='mb-6 flex flex-wrap gap-4'>
                    <PermissionGuard permission={Permission.CREATE_PRODUCT}>
                        <BaseButton
                            className='mr-3'
                            href="/products/products-new"
                            icon={mdiPlus}
                            label="Add New"
                            color="success"
                        />
                    </PermissionGuard>
                    <BaseButton
                        className='mr-3'
                        color='info'
                        label='Add Filter'
                        icon={mdiFilterVariant}
                        onClick={handleAddFilter}
                    />
                    <BaseButton
                        color='warning'
                        label='Export CSV'
                        icon={mdiDownload}
                        onClick={downloadProductsCSV}
                    />
                </CardBox>

                {/* Products Table with Filters */}
                <CardBox className='mb-6' hasTable>
                    <TableProducts
                        filterItems={filterItems}
                        setFilterItems={setFilterItems}
                        filters={filters}
                    />
                </CardBox>
            </SectionMain>
        </>
    );
};

ProductsTablesPage.getLayout = function getLayout(page: ReactElement) {
    return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default withAuth(ProductsTablesPage, {
    permissions: [Permission.VIEW_PRODUCTS]
});
