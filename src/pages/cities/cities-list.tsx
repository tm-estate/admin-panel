import { mdiChartTimelineVariant, mdiPlus, mdiDownload } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement } from 'react'
import CardBox from '@/components/Cardbox/CardBox'
import LayoutAuthenticated from '@/layouts/Authenticated'
import SectionMain from '@/components/Section/SectionMain'
import SectionTitleLineWithButton from '@/components/Section/SectionTitleLineWithButton'
import { getPageTitle } from '@/config'
import BaseButton from '@/components/Base/BaseButton'
import axios from 'axios'
import TableCities from '@/components/Cities/TableCities'
import BreadcrumbsBar from "@/components/BreadcrumbsBar";

const CitiesPage = () => {
  const getCitiesCSV = async () => {
    const response = await axios({
      url: '/cities?filetype=csv',
      method: 'GET',
      responseType: 'blob',
    })
    const type = response.headers['content-type']
    const blob = new Blob([response.data], { type: type })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = 'citiesCSV.csv'
    link.click()
  }

  return (
      <>
        <Head>
          <title>{getPageTitle('Cities')}</title>
        </Head>
        <SectionMain>
          <SectionTitleLineWithButton
              icon={mdiChartTimelineVariant}
              title='Cities Management'
              main
          >
            <BreadcrumbsBar items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Cities', href: '/cities/cities-list' },
            ]} />
          </SectionTitleLineWithButton>

          {/* Action Buttons */}
          <CardBox className='mb-6 flex flex-wrap gap-4'>
            <BaseButton
                className='mr-2'
                href='/cities/cities-new'
                color='success'
                label='Add New City'
                icon={mdiPlus}
            />
            <BaseButton
                color='warning'
                label='Export CSV'
                icon={mdiDownload}
                onClick={getCitiesCSV}
            />
          </CardBox>

          {/* Cities Table */}
          <CardBox className='mb-6' hasTable>
            <TableCities />
          </CardBox>
        </SectionMain>
      </>
  )
}

CitiesPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default CitiesPage
