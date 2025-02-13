import { mdiChartTimelineVariant } from '@mdi/js';
import Head from 'next/head';
import { uniqueId } from 'lodash';
import React, { ReactElement } from 'react';
import CardBox from '../../components/CardBox';
import LayoutAuthenticated from '../../layouts/Authenticated';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import { getPageTitle } from '../../config';
import TableProduct_parameters from '../../components/Product_parameters/TableProduct_parameters';
import BaseButton from '../../components/BaseButton';
import axios from 'axios';

const Product_parametersTablesPage = () => {
  const [filterItems, setFilterItems] = React.useState([]);

  const [filters] = React.useState([
    { label: 'Title En', title: 'titleEn' },
    { label: 'Title Ru', title: 'titleRu' },
    { label: 'Title Tm', title: 'titleTm' },
    { label: 'Key', title: 'key' },
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

  const getProduct_parametersCSV = async () => {
    const response = await axios({
      url: '/product_parameters?filetype=csv',
      method: 'GET',
      responseType: 'blob',
    });
    const type = response.headers['content-type'];
    const blob = new Blob([response.data], { type: type });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'product_parametersCSV.csv';
    link.click();
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Product_parameters')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title='Product_parameters Table'
          main
        >
          Breadcrumbs
        </SectionTitleLineWithButton>
        <CardBox className='mb-6'>
          <BaseButton
            className={'mr-3'}
            href={'/product_parameters/product_parameters-new'}
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
            onClick={getProduct_parametersCSV}
          />
        </CardBox>
        <CardBox className='mb-6' hasTable>
          <TableProduct_parameters
            filterItems={filterItems}
            setFilterItems={setFilterItems}
            filters={filters}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

Product_parametersTablesPage.getLayout = function getLayout(
  page: ReactElement,
) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default Product_parametersTablesPage;
