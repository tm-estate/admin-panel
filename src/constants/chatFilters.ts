import { IFilterConfig } from '@/interfaces'
import { ChatStatus } from '@/interfaces/IChat'

export const chatFilters: IFilterConfig[] = [
  {
    label: 'Department',
    key: 'departments',
    selectType: 'multi',
    itemRef: 'departments',
    showField: 'name',
  },
  {
    label: 'User',
    key: 'user',
    selectType: 'search',
    itemRef: 'users',
    showField: 'name',
  },
  {
    label: 'Moderator',
    key: 'moderator',
    selectType: 'search',
    itemRef: 'users',
    showField: 'name',
  },
  {
    label: 'Status',
    key: 'status',
    selectType: 'select',
    options: [
      {
        key: ChatStatus.OPEN,
        label: 'Open',
      },
      {
        key: ChatStatus.CLOSED,
        label: 'Closed',
      },
    ],
  },
  {
    label: 'Last Message At',
    key: 'lastMessageAt',
    selectType: 'date',
  },
  {
    label: 'Created At',
    key: 'createdAt',
    selectType: 'date',
  },
  {
    label: 'Updated At',
    key: 'updatedAt',
    selectType: 'date',
  },
]
