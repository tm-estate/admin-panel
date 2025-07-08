import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/stores/hooks'
import dataFormatter from '@/helpers/dataFormatter'
import BaseTable from '@/components/UI/BaseTable'
import { getNotAssignedConversationsAPI } from '@/stores/thunks/chats'
import { ITableProps } from '@/interfaces/ITable'
import { toast } from 'react-toastify'

const ITEMS_PER_PAGE = 10

const TableChats: React.FC<ITableProps> = () => {
  const dispatch = useAppDispatch()
  const [currentPage, setCurrentPage] = useState(0)

  // Get data from Redux store
  const {
    notAssignedConversations,
    loading,
    notAssignedConversationsCount,
    notify: chatsNotify,
  } = useAppSelector((state) => state.chats)

  const totalPages = Math.max(1, Math.ceil(notAssignedConversationsCount / ITEMS_PER_PAGE))

  // Column configuration
  const columns = [
    { field: 'departmentId', label: 'Department', sortable: true, formatter: 'user' },
    { field: 'userId', label: 'User', sortable: true, formatter: 'user' },
    { field: 'adminId', label: 'Assigned Moderator', sortable: true, formatter: 'admin' },
    { field: 'status', label: 'Status', sortable: true },
    { field: 'lastMessageAt', label: 'Last Message At', sortable: true, formatter: 'date' },
  ]

  const showNotification = (type, message) => {
    toast(message, {
      type,
      position: 'bottom-center',
      autoClose: 3000,
    })
  }

  // Load data with query parameters
  const loadConversations = ({ page, limit, sort, field }) => {
    if (page !== currentPage) setCurrentPage(page)

    const queryString = `?page=${page}&limit=${limit}&sort=${sort}&field=${field}`

    dispatch(
      getNotAssignedConversationsAPI({
        query: queryString,
        data: null,
      })
    )
  }

  useEffect(() => {
    if (chatsNotify?.showNotification) {
      showNotification(chatsNotify.typeNotification, chatsNotify.textNotification)
    }
  }, [chatsNotify?.showNotification])

  useEffect(() => {
    const handleInitialLoad = async () => {
      await loadConversations({ page: 1, limit: 10, sort: 'desc', field: '' })
    }

    handleInitialLoad()
  }, [])

  // Function to safely convert any field to string
  const toSafeString = (value) => {
    if (value === null || value === undefined) return ''
    if (typeof value === 'string') return value
    if (typeof value === 'number' || typeof value === 'boolean') return String(value)
    return ''
  }

  return (
    <>
      <BaseTable
        items={notAssignedConversations}
        loading={loading}
        count={notAssignedConversationsCount}
        columns={columns}
        entityPath="chats"
        onDelete={undefined}
        onLoad={loadConversations}
        notifyState={chatsNotify}
        showViewBtn={false}
        showDeleteBtn={false}
        formatters={{
          date: (value) => {
            if (!value) return ''
            return dataFormatter.dateTimeFormatterFull(value)
          },
          admin: (value) => {
            if (!value) return 'Not assigned yet!'
            if (typeof value === 'string') return value
            return value.name || value._id || ''
          },
          user: (value) => {
            if (!value) return ''
            if (typeof value === 'string') return value
            return value.name || ''
          },
          // Fallback formatter for any other fields
          default: (value) => {
            if (value === null || value === undefined) return ''
            if (typeof value === 'object') {
              if (Array.isArray(value)) {
                return value.map(toSafeString).filter(Boolean).join(', ')
              }
              return JSON.stringify(value)
            }
            return String(value)
          },
        }}
      />
    </>
  )
}

export default TableChats
