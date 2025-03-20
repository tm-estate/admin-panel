import { mdiChartTimelineVariant, mdiFilterVariant, mdiPlus, mdiDownload } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useState } from 'react';
import CardBox from '@/components/CardBox';
import LayoutAuthenticated from '@/layouts/Authenticated';
import SectionMain from '@/components/SectionMain';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton';
import { getPageTitle } from '@/config';
import BaseButton from '@/components/BaseButton';
import axios from 'axios';
import TableProducts from "@/components/Products/TableProducts";
import { IFilterConfig, IFilterItem } from '@/interfaces';
import BreadcrumbsBar from "@/components/BreadcrumbsBar";
import { addFilter } from "@/components/Filters";

const ProductsTablesPage = () => {
    const [filterItems, setFilterItems] = useState<IFilterItem[]>([]);
    const [filters] = useState<IFilterConfig[]>([
        { label: 'Name', key: 'name', selectType: 'search' },
        { label: 'Deal Type', key: 'dealType', selectType: 'select', itemRef: 'dealTypes', showField: 'titleRu' },
        { label: 'Property Types', key: 'propertyType', selectType: 'multi', itemRef: 'propertyTypes', showField: 'titleRu' },
        { label: 'Regions', key: 'region', selectType: 'multi', itemRef: 'regions', showField: 'titleRu' },
        { label: 'Cities', key: 'city', selectType: 'multi', itemRef: 'cities', showField: 'titleRu' },
        { label: 'City Areas', key: 'cityArea', selectType: 'multi', itemRef: 'cityAreas', showField: 'titleRu' },
        { label: 'Creator', key: 'creator', selectType: 'search', itemRef: 'users', showField: 'name'},
        { label: 'Address', key: 'address', selectType: 'search' },
        { label: 'Prices', key: 'price', selectType: 'number' },
        { label: 'Status', key: 'status', selectType: 'multi', options: [
                { key: 'active', label: 'Active' },
                { key: 'inactive', label: 'Inactive' },
                { key: 'onModeration', label: 'On moderation' },
                { key: 'rejected', label: 'Rejected' },
                { key: 'waitingForPayment', label: 'Waiting for payment' }
            ] },
        { label: 'With Photo', key: 'withPhoto', selectType: 'boolean' },
        { label: 'Created At', key: 'createdAt', selectType: 'date' },
        { label: 'Updated At', key: 'updatedAt', selectType: 'date' }
    ]);

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
                    <BaseButton
                        className={'mr-3'}
                        href='/products/products-new'
                        color='success'
                        label='Add New Product'
                        icon={mdiPlus}
                    />
                    <BaseButton
                        className={'mr-3'}
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

export default ProductsTablesPage;
