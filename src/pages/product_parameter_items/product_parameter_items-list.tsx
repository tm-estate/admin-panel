import { mdiChartTimelineVariant } from '@mdi/js';
import Head from 'next/head';
import { uniqueId } from 'lodash';
import React, { ReactElement } from 'react';
import CardBox from '@/components/CardBox';
import LayoutAuthenticated from '@/layouts/Authenticated';
import SectionMain from '@/components/SectionMain';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton';
import { getPageTitle } from '@/config';
import TableProduct_parameter_items from '@/components/Product_parameter_items/TableProduct_parameter_items';
import BaseButton from '@/components/BaseButton';
import axios from 'axios';

const Product_parameter_itemsTablesPage = () => {
  const [filterItems, setFilterItems] = React.useState([]);

  const [filters] = React.useState([
    { label: 'Title En', title: 'titleEn' },
    { label: 'Title Ru', title: 'titleRu' },
    { label: 'Title Tm', title: 'titleTm' },
  ]);

  const addFilter = () => {
    const newItem = {
      id: uniqueId(),
      fields: {
        filterValue: '',
        filterValueFrom: '',
        filterValueTo: '',
        selectedField: '',
      },
    };
    newItem.fields.selectedField = filters[0].title;
    setFilterItems([...filterItems, newItem]);
  };

  const getProduct_parameter_itemsCSV = async () => {
    const response = await axios({
      url: '/product_parameter_items?filetype=csv',
      method: 'GET',
      responseType: 'blob',
    });
    const type = response.headers['content-type'];
    const blob = new Blob([response.data], { type: type });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'product_parameter_itemsCSV.csv';
    link.click();
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Product_parameter_items')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title='Product_parameter_items Table'
          main
        >
          Breadcrumbs
        </SectionTitleLineWithButton>
        <CardBox className='mb-6'>
          <BaseButton
            className={'mr-3'}
            href={'/product_parameter_items/product_parameter_items-new'}
            color='info'
            label='New Item'
          />
          <BaseButton
            className={'mr-3'}
            color='info'
            label='Add Filter'
            onClick={addFilter}
          />
          <BaseButton
            color='info'
            label='Download CSV'
            onClick={getProduct_parameter_itemsCSV}
          />
        </CardBox>
        <CardBox className='mb-6' hasTable>
          <TableProduct_parameter_items
            filterItems={filterItems}
            setFilterItems={setFilterItems}
            filters={filters}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

Product_parameter_itemsTablesPage.getLayout = function getLayout(
  page: ReactElement,
) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default Product_parameter_itemsTablesPage;
