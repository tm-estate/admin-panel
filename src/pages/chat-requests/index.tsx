import { mdiChartTimelineVariant } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement, useState } from 'react'
import CardBox from '@/components/Cardbox/CardBox'
import LayoutAuthenticated from '@/layouts/Authenticated'
import SectionMain from '@/components/Section/SectionMain'
import SectionTitleLineWithButton from '@/components/Section/SectionTitleLineWithButton'
import { getPageTitle } from '@/config'
import BreadcrumbsBar from '@/components/BreadcrumbsBar'
import TableChats from '@/components/Chat/TableChats'
import { IFilterItem } from '@/interfaces'
import { chatFilters } from '@/constants/chatFilters'

const ChatListPage = () => {
  const [filterItems, setFilterItems] = useState<IFilterItem[]>([])
  const [filters] = useState(chatFilters)

  return (
    <>
      <Head>
        <title>{getPageTitle('Support Chat Requests List')}</title>
      </Head>

      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="Support Chat" main>
          <BreadcrumbsBar
            items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Chat Requests', href: '/chat-requests' },
            ]}
          />
        </SectionTitleLineWithButton>

        {/*/!* Chats Table *!/*/}
        <CardBox className="mb-6" hasTable>
          <TableChats filterItems={filterItems} setFilterItems={setFilterItems} filters={filters} />
        </CardBox>
      </SectionMain>
    </>
  )
}

ChatListPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default ChatListPage
