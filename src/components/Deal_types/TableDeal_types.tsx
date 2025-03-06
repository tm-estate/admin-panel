import { mdiEye, mdiTrashCan } from '@mdi/js'
import React, { useEffect, useState, useMemo } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import BaseButton from '../BaseButton'
import BaseButtons from '../BaseButtons'
import CardBoxModal from '../CardBoxModal'
import CardBox from '../CardBox'
import ImageField from '../ImageField'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'
import dataFormatter from '../../helpers/dataFormatter'
import { Field, Form, Formik } from 'formik'
import { Pagination } from '../Pagination'
import { saveFile } from '../../helpers/fileSaver'
import { deleteDealType, getDealTypes } from "../../stores/thunks/deal-types";

const perPage = 5

const TableSampleDeal_types = ({ filterItems, setFilterItems, filters }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const notify = (type, msg) => toast(msg, { type, position: 'bottom-center' })

  const pagesList = []
  const [id, setId] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [filterRequest, setFilterRequest] = React.useState('')
  const [sort, setSort] = useState('desc')
  const [field, setField] = useState('')
  const {
    deal_types,
    loading,
    count,
    notify: deal_typesNotify,
  } = useAppSelector((state) => state.deal_types)

  const numPages = Math.floor(count / perPage) === 0 ? 1 : Math.ceil(count / perPage)
  for (let i = 0; i < numPages; i++) {
    pagesList.push(i)
  }

  const loadData = async (page = currentPage, request = filterRequest) => {
    if (page !== currentPage) setCurrentPage(page)
    if (request !== filterRequest) setFilterRequest(request)

    const query = `?page=${++page}&limit=${perPage}${request}&sort=${sort}&field=${field}`
    dispatch(getDealTypes(query))
  }

  useEffect(() => {
    if (deal_typesNotify.showNotification) {
      notify(deal_typesNotify.typeNotification, deal_typesNotify.textNotification)
    }
  }, [deal_typesNotify.showNotification])

  useEffect(() => {
    loadData()
  }, [dispatch, sort, field])

  const [isModalInfoActive, setIsModalInfoActive] = useState(false)
  const [isModalTrashActive, setIsModalTrashActive] = useState(false)

  const handleModalAction = () => {
    setIsModalInfoActive(false)
    setIsModalTrashActive(false)
  }

  const handleDeleteModalAction = (e, id) => {
    e.stopPropagation()
    setId(id)
    setIsModalTrashActive(true)
  }
  const handleDeleteAction = async () => {
    if (id) {
      await dispatch(deleteDealType(id))
      await loadData(0)
      setIsModalTrashActive(false)
    }
  }

  const generateFilterRequests = useMemo(() => {
    let request = '&'
    filterItems.forEach((item) => {
      filters.find(
        (filter) => filter.title === item.fields.selectedField && (filter.number || filter.date)
      )
        ? (request += `${item.fields.selectedField}Range=${item.fields.filterValueFrom}&${item.fields.selectedField}Range=${item.fields.filterValueTo}&`)
        : (request += `${item.fields.selectedField}=${item.fields.filterValue}&`)
    })
    return request
  }, [filterItems, filters])

  const deleteFilter = (value) => {
    const newItems = filterItems.filter((item) => item.id !== value)
    if (newItems.length) {
      setFilterItems(newItems)
    } else {
      loadData(0, '')
      setFilterItems(newItems)
    }
  }

  const handleSubmit = () => {
    loadData(0, generateFilterRequests)
  }

  const handleChange = (id) => (e) => {
    const value = e.target.value
    const name = e.target.name

    setFilterItems(
      filterItems.map((item) =>
        item.id === id ? { id, fields: { ...item.fields, [name]: value } } : item
      )
    )
  }

  const handleReset = () => {
    setFilterItems([])
    loadData(0, '')
  }

  const onPageChange = (page: number) => {
    loadData(page)
    setCurrentPage(page)
  }

  const handleSort = (e) => {
    if (e?.target?.innerHTML) {
      const val = e.target.innerHTML
      const key = filters.find((el) => el.label === val)?.title
      const direction = e.target.classList.contains('asc') ? 'desc' : 'asc'

      if (!key) {
        return
      }

      const headers = document.querySelectorAll('th.sortable')
      headers.forEach((el) => el.classList.remove('asc', 'desc'))

      e.target.classList.remove('asc', 'desc')
      e.target.classList.add(direction)

      setField(key)
      setSort((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    }
  }

  const controlClasses =
    'w-full py-2 px-2 my-2 border-gray-700 rounded dark:placeholder-gray-400 ' +
    'focus:ring focus:ring-blue-600 focus:border-blue-600 focus:outline-none bg-white ' +
    'dark:bg-slate-800 border'

  return (
    <>
      { filterItems && Array.isArray(filterItems) && filterItems.length ? (
        <CardBox>
          <Formik
            initialValues={{
              checkboxes: ['lorem'],
              switches: ['lorem'],
              radio: 'lorem',
            }}
            onSubmit={() => null}
          >
            <Form>
              <>
                { filterItems &&
                  filterItems.map((filterItem) => {
                    return (
                      <div key={filterItem.id} className="flex mb-4">
                        <div className="flex flex-col w-full mr-3">
                          <div className="text-gray-500 font-bold">Filter</div>
                          <Field
                            className={controlClasses}
                            name="selectedField"
                            id="selectedField"
                            component="select"
                            value={filterItem?.fields?.selectedField}
                            onChange={handleChange(filterItem.id)}
                          >
                            {filters.map((selectOption) => (
                              <option key={selectOption.title} value={`${selectOption.title}`}>
                                {selectOption.label}
                              </option>
                            ))}
                          </Field>
                        </div>
                        {filters.find(
                          (filter) => filter.title === filterItem?.fields?.selectedField
                        )?.number ? (
                          <div className="flex flex-row w-full mr-3">
                            <div className="flex flex-col w-full mr-3">
                              <div className="text-gray-500 font-bold">From</div>
                              <Field
                                className={controlClasses}
                                name="filterValueFrom"
                                placeholder="From"
                                id="filterValueFrom"
                                onChange={handleChange(filterItem.id)}
                              />
                            </div>
                            <div className="flex flex-col w-full">
                              <div className="text-gray-500 font-bold">To</div>
                              <Field
                                className={controlClasses}
                                name="filterValueTo"
                                placeholder="to"
                                id="filterValueTo"
                                onChange={handleChange(filterItem.id)}
                              />
                            </div>
                          </div>
                        ) : filters.find(
                            (filter) => filter.title === filterItem?.fields?.selectedField
                          )?.date ? (
                          <div className="flex flex-row w-full mr-3">
                            <div className="flex flex-col w-full mr-3">
                              <div className="text-gray-500 font-bold">From</div>
                              <Field
                                className={controlClasses}
                                name="filterValueFrom"
                                placeholder="From"
                                id="filterValueFrom"
                                type="datetime-local"
                                onChange={handleChange(filterItem.id)}
                              />
                            </div>
                            <div className="flex flex-col w-full">
                              <div className="text-gray-500 font-bold">To</div>
                              <Field
                                className={controlClasses}
                                name="filterValueTo"
                                placeholder="to"
                                id="filterValueTo"
                                type="datetime-local"
                                onChange={handleChange(filterItem.id)}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col w-full mr-3">
                            <div className="text-gray-500 font-bold">Contains</div>
                            <Field
                              className={controlClasses}
                              name="filterValue"
                              placeholder="Contained"
                              id="filterValue"
                              onChange={handleChange(filterItem.id)}
                            />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <div className="text-gray-500 font-bold">Action</div>
                          <BaseButton
                            className="my-2"
                            type="reset"
                            color="danger"
                            label="Delete"
                            onClick={() => {
                              deleteFilter(filterItem.id)
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                <div className="flex">
                  <BaseButton
                    className="my-2 mr-3"
                    color="success"
                    label="Apply"
                    onClick={handleSubmit}
                  />
                  <BaseButton className="my-2" color="info" label="Cancel" onClick={handleReset} />
                </div>
              </>
            </Form>
          </Formik>
        </CardBox>
      ) : null}
      <CardBoxModal
        title="Please confirm"
        buttonColor="danger"
        buttonLabel={loading ? 'Deleting...' : 'Confirm'}
        isActive={isModalTrashActive}
        onConfirm={handleDeleteAction}
        onCancel={handleModalAction}
      >
        <p>Are you sure you want to delete this item?</p>
      </CardBoxModal>

      <div className="relative overflow-x-auto">
        <table>
          <thead>
            <tr onClick={(e) => handleSort(e)}>
              <th className="sortable">Title Ru</th>

              <th className="sortable">Title En</th>

              <th className="sortable">Title Tm</th>

              <th>Actions</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {deal_types &&
              Array.isArray(deal_types) &&
              deal_types.map((item: any) => (
                <tr key={item._id} onClick={() => router.push(`/deal_types/${item._id}`)}>
                  <td data-label="titleRu">{item.titleRu}</td>

                  <td data-label="titleEn">{item.titleEn}</td>

                  <td data-label="titleTm">{item.titleTm}</td>

                  <td className="before:hidden lg:w-1 whitespace-nowrap">
                    <BaseButtons type="justify-start lg:justify-end" noWrap>
                      <BaseButton
                        color="info"
                        icon={mdiEye}
                        onClick={() => setIsModalInfoActive(true)}
                        small
                      />
                      <BaseButton
                        color="danger"
                        icon={mdiTrashCan}
                        onClick={(e) => handleDeleteModalAction(e, item._id)}
                        small
                      />
                    </BaseButtons>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 md:py-0">
          <div className="flex items-center mr-4">
            <p className={'text-[#8491A0]'}>
              Displaying {deal_types.length === 0 ? '0' : currentPage * perPage + 1} to{' '}
              {deal_types.length < perPage
                ? deal_types?.length + perPage * currentPage
                : perPage * (currentPage + 1) > count
                ? perPage * (currentPage + 1) - count + currentPage * perPage
                : perPage * (currentPage + 1)}{' '}
              of {count}
            </p>
          </div>
          <Pagination currentPage={currentPage} numPages={numPages} setCurrentPage={onPageChange} />
        </div>
      </div>
      <ToastContainer />
    </>
  )
}

export default TableSampleDeal_types
