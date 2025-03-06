import { mdiChartTimelineVariant } from '@mdi/js'
import Head from 'next/head'
import { uniqueId } from 'lodash'
import React, { ReactElement } from 'react'
import CardBox from '@/components/CardBox'
import LayoutAuthenticated from '@/layouts/Authenticated'
import SectionMain from '@/components/SectionMain'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton'
import { getPageTitle } from '@/config'
import BaseButton from '@/components/BaseButton'
import axios from 'axios'
import TableSampleAgency_types from "@/components/Agency_types/TableAgency_types";

const Agency_typesTablesPage = () => {
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

    const getAgency_typesCSV = async () => {
        const response = await axios({
            url: '/agencyType?filetype=csv',
            method: 'GET',
            responseType: 'blob',
        })
        const type = response.headers['content-type']
        const blob = new Blob([response.data], { type: type })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'agencyTypesCSV.csv'
        link.click()
    }

    return (
        <>
            <Head>
                <title>{getPageTitle('Agency_types')}</title>
            </Head>
            <SectionMain>
                <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="Agency Types" main>
                    Breadcrumbs
                </SectionTitleLineWithButton>
                <CardBox className="mb-6">
                    <BaseButton
                        className={'mr-3'}
                        href={'/agency_types/agency_types-new'}
                        color="info"
                        label="New Item"
                    />
                    <BaseButton className={'mr-3'} color="info" label="Add Filter" onClick={addFilter} />
                    <BaseButton color="info" label="Download CSV" onClick={getAgency_typesCSV} />
                </CardBox>
                <CardBox className="mb-6" hasTable>
                    <TableSampleAgency_types
                        filterItems={filterItems}
                        setFilterItems={setFilterItems}
                        filters={filters}
                    />
                </CardBox>
            </SectionMain>
        </>
    )
}

Agency_typesTablesPage.getLayout = function getLayout(page: ReactElement) {
    return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default Agency_typesTablesPage
