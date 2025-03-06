import { mdiChartTimelineVariant } from '@mdi/js'
import Head from 'next/head'
import { uniqueId } from 'lodash'
import React, { ReactElement } from 'react'
import CardBox from '@/components/CardBox'
import LayoutAuthenticated from '@/layouts/Authenticated'
import SectionMain from '@/components/SectionMain'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton'
import { getPageTitle } from '@/config'
import TableProperty_types from '@/components/Property_types/TableProperty_types'
import BaseButton from '@/components/BaseButton'
import axios from 'axios'

const Property_typesTablesPage = () => {
  const [filterItems, setFilterItems] = React.useState([])

  const [filters] = React.useState([
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

  const getProperty_typesCSV = async () => {
    const response = await axios({
      url: '/property_types?filetype=csv',
      method: 'GET',
      responseType: 'blob',
    })
    const type = response.headers['content-type']
    const blob = new Blob([response.data], { type: type })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = 'property_typesCSV.csv'
    link.click()
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Property_types')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="Property Types" main>
          Breadcrumbs
        </SectionTitleLineWithButton>
        <CardBox className="mb-6">
          <BaseButton
            className={'mr-3'}
            href={'/property_types/property_types-new'}
            color="info"
            label="New Item"
          />
          <BaseButton className={'mr-3'} color="info" label="Add Filter" onClick={addFilter} />
          <BaseButton color="info" label="Download CSV" onClick={getProperty_typesCSV} />
        </CardBox>
        <CardBox className="mb-6" hasTable>
          <TableProperty_types
            filterItems={filterItems}
            setFilterItems={setFilterItems}
            filters={filters}
          />
        </CardBox>
      </SectionMain>
    </>
  )
}

Property_typesTablesPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default Property_typesTablesPage
