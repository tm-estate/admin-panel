import { mdiChartTimelineVariant } from '@mdi/js'
import Head from 'next/head'
import { uniqueId } from 'lodash'
import React, { ReactElement, useState } from 'react'
import CardBox from '../../components/CardBox'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'
import TableDeal_types from '../../components/Deal_types/TableDeal_types'
import BaseButton from '../../components/BaseButton'
import axios from 'axios'

const Deal_typesTablesPage = () => {
  const [filterItems, setFilterItems] = useState([])

  const [filters] = useState([
    { label: 'Title Ru', title: 'titleRu' },
    { label: 'Title En', title: 'titleEn' },
    { label: 'Title Tm', title: 'titleTm' },
  ])

  const addFilter = () => {
    const newItem = {
      id: uniqueId(),
      fields: {
        filterValue: '',
        filterValueFrom: '',
        filterValueTo: '',
        selectedField: '',
      },
    }
    newItem.fields.selectedField = filters[0].title
    setFilterItems([...filterItems, newItem])
  }

  const getDeal_typesCSV = async () => {
    const response = await axios({
      url: '/dealTypes?filetype=csv',
      method: 'GET',
      responseType: 'blob',
    })
    const type = response.headers['content-type']
    const blob = new Blob([response.data], { type: type })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = 'deal_typesCSV.csv'
    link.click()
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Deal_types')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="Deal Types" main>
          Breadcrumbs
        </SectionTitleLineWithButton>
        <CardBox className="mb-6">
          <BaseButton
            className={'mr-3'}
            href={'/deal_types/deal_types-new'}
            color="info"
            label="New Item"
          />
          <BaseButton className={'mr-3'} color="info" label="Add Filter" onClick={addFilter} />
          <BaseButton color="info" label="Download CSV" onClick={getDeal_typesCSV} />
        </CardBox>
        <CardBox className="mb-6" hasTable>
          <TableDeal_types
            filterItems={filterItems}
            setFilterItems={setFilterItems}
            filters={filters}
          />
        </CardBox>
      </SectionMain>
    </>
  )
}

Deal_typesTablesPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default Deal_typesTablesPage
