import { mdiEye, mdiTrashCan } from '@mdi/js';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import BaseButton from '@/components/Base/BaseButton';
import BaseButtons from '@/components/Base/BaseButtons';
import CardBoxModal from '@/components/Cardbox/CardBoxModal';
import { getUsers, deleteUser } from '@/stores/thunks/users';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { useRouter } from 'next/router';
import dataFormatter from '@/helpers/dataFormatter';
import { Pagination } from '@/components/Pagination';
import Filters from '@/components/Filters/Filters';
import { ITableProps } from "@/interfaces/ITable";

const ITEMS_PER_PAGE = 10;

const TableUsers: React.FC<ITableProps> = ({
                                            filterItems,
                                            setFilterItems,
                                            filters
                                          }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(0);
  const [filterData, setFilterData] = useState({});
  const [sortDirection, setSortDirection] = useState('desc');
  const [sortField, setSortField] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isDeleteModalActive, setIsDeleteModalActive] = useState(false);
  const [isViewModalActive, setIsViewModalActive] = useState(false);

  const {
    users,
    loading,
    count,
    notify: usersNotify,
  } = useAppSelector((state) => state.users);

  const totalPages = Math.max(1, Math.ceil(count / ITEMS_PER_PAGE));

  const safeFormatter = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return value.map(item => typeof item === 'object' ? (item.name || JSON.stringify(item)) : String(item)).join(', ');
      }
      return JSON.stringify(value);
    }
    return '';
  };

  const showNotification = (type, message) => {
    toast(message, {
      type,
      position: 'bottom-center',
      autoClose: 3000
    });
  };

  const loadUsers = async (page = currentPage, data = filterData, isManualApply = false) => {
    if (!isManualApply && router.asPath.includes('?') && JSON.stringify(data) === '{}') {
      return;
    }

    if (page !== currentPage) setCurrentPage(page);
    if (data !== filterData) setFilterData(data);

    const queryString = `?page=${page + 1}&limit=${ITEMS_PER_PAGE}&sort=${sortDirection}&field=${sortField}`;

    dispatch(getUsers({ query: queryString, data }));
  };

  useEffect(() => {
    if (usersNotify?.showNotification) {
      showNotification(
          usersNotify.typeNotification,
          usersNotify.textNotification
      );
    }
  }, [usersNotify?.showNotification]);

  useEffect(() => {
    const handleInitialLoad = async () => {
      if (router.asPath.includes('?')) {

        const filterObject = {};

        await loadUsers(0, filterObject);
      } else {
        await loadUsers();
      }
    };

    handleInitialLoad();
  }, [dispatch, sortDirection, sortField]);

  const closeModals = () => {
    setIsDeleteModalActive(false);
    setIsViewModalActive(false);
    setSelectedItemId(null);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setSelectedItemId(id);
    setIsDeleteModalActive(true);
  };

  const handleViewClick = (e, id) => {
    e.stopPropagation();
    setSelectedItemId(id);
    setIsViewModalActive(true);
  };

  const confirmDelete = async () => {
    if (selectedItemId) {
      await dispatch(deleteUser(selectedItemId));
      await loadUsers(0);
      closeModals();
    }
  };

  const handleRowClick = (id) => {
    router.push(`/users/${id}`);
  };

  const handleSort = (e) => {
    sortDirection  === 'asc' ? setSortDirection('desc') : setSortDirection('asc')
    const headerElement = e.target;
    if (headerElement?.classList?.contains('sortable')) {
      const columnName = headerElement.getAttribute('data-field');

      if (columnName === sortField) {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(columnName);
        setSortDirection('desc');
      }

      const headers = document.querySelectorAll('th.sortable');
      headers.forEach(el => el.classList.remove('asc', 'desc'));
      headerElement.classList.add(sortDirection === 'asc' ? 'desc' : 'asc');
    }
  };

  const handleApplyFilters = ({object, query}) => {
    const isManualFilterApply = true;

    loadUsers(0, object, isManualFilterApply);
    router.replace({ query }, undefined, { shallow: true });
  };

  return (
      <>
        {filters && filterItems && setFilterItems && (
            <Filters
                filters={filters}
                filterItems={filterItems}
                setFilterItems={setFilterItems}
                onApplyFilters={handleApplyFilters}
                className="mb-6"
            />
        )}

        {/* Delete Confirmation Modal */}
        <CardBoxModal
            title="Delete User"
            buttonColor="danger"
            buttonLabel={loading ? 'Deleting...' : 'Delete'}
            isActive={isDeleteModalActive}
            onConfirm={confirmDelete}
            onCancel={closeModals}
        >
          <p>Are you sure you want to delete this user? This action cannot be undone.</p>
        </CardBoxModal>

        {/* Users Table */}
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-100 dark:bg-slate-700">
            <tr onClick={handleSort}>
              <th className={`${sortDirection === 'asc' ? 'desc' : 'asc'} p-4`} data-field="name">Name</th>
              <th className="sortable p-4" data-field="phone">Phone Number</th>
              <th className="sortable p-4" data-field="email">E-Mail</th>
              <th className="p-4" data-field="role">Role</th>
              <th className="p-4" data-field="isAgent">Agent</th>
              <th className="p-4" data-field="isPhoneNumberConfirmed">Confirmed</th>
              <th className="sortable p-4" data-field="createdAt">Created Date</th>
              <th className="sortable p-4" data-field="updatedAt">Updated Date</th>
              <th className="p-4">Actions</th>
            </tr>
            </thead>
            <tbody>
            {users && users.length > 0 ? (
                users.map((item) => (
                    <tr
                        key={item._id}
                        onClick={() => handleRowClick(item._id)}
                        className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 cursor-pointer"
                    >
                      <td className="p-4 font-medium">{safeFormatter(dataFormatter.capitalize(item.name))}</td>
                      <td className="p-4">{safeFormatter(dataFormatter.phoneFormatter(item.phone))}</td>
                      <td className="p-4">{safeFormatter(item.email)}</td>
                      <td className="p-4">{safeFormatter(item.role)}</td>
                      <td className="p-4">{safeFormatter(dataFormatter.booleanFormatter(item.isAgent))}</td>
                      <td className="p-4">{safeFormatter(dataFormatter.booleanFormatter(item.isPhoneNumberConfirmed))}</td>
                      <td className="p-4">{safeFormatter(dataFormatter.dateFormatter(item.createdAt))}</td>
                      <td className="p-4">{safeFormatter(dataFormatter.dateFormatter(item.updatedAt))}</td>

                      {/* Action buttons */}
                      <td className="p-4 text-right">
                        <BaseButtons type="justify-end" noWrap>
                          <BaseButton
                              color="info"
                              icon={mdiEye}
                              onClick={(e) => handleViewClick(e, item._id)}
                              small
                          />
                          <BaseButton
                              color="danger"
                              icon={mdiTrashCan}
                              onClick={(e) => handleDeleteClick(e, item._id)}
                              small
                          />
                        </BaseButtons>
                      </td>
                    </tr>
                ))
            ) : (
                <tr>
                  <td colSpan={9} className="p-4 text-center">
                    {loading ? 'Loading...' : 'No users found'}
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-500">
                Showing {users.length === 0 ? '0' : currentPage * ITEMS_PER_PAGE + 1} to{' '}
                {Math.min((currentPage + 1) * ITEMS_PER_PAGE, count)} of {count} entries
              </p>
            </div>
            <Pagination
                currentPage={currentPage}
                numPages={totalPages}
                setCurrentPage={(page) => loadUsers(page)}
            />
          </div>
        </div>

        <ToastContainer />
      </>
  );
};

export default TableUsers;
