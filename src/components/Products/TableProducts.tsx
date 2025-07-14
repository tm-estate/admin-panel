import { mdiEye, mdiTrashCan } from '@mdi/js';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import BaseButton from '@/components/Base/BaseButton';
import BaseButtons from '@/components/Base/BaseButtons';
import CardBoxModal from '@/components/Cardbox/CardBoxModal';
import { getProducts, deleteProduct } from '@/stores/thunks/products';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { useRouter } from 'next/router';
import dataFormatter from '@/helpers/dataFormatter';
import { Pagination } from '@/components/Pagination';
import Filters from '@/components/Filters';
import { ITableProps } from "@/interfaces/ITable";
import Image from "next/image";
import ImageItem from "@/components/UI/Image/ImageItem";

const ITEMS_PER_PAGE = 10;

const TableProducts: React.FC<ITableProps> = ({
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
    products,
    loading,
    count,
    notify: productsNotify,
  } = useAppSelector((state) => state.products);

  const totalPages = Math.max(1, Math.ceil(count / ITEMS_PER_PAGE));

  const showNotification = (type, message) => {
    toast(message, {
      type,
      position: 'bottom-center',
      autoClose: 3000
    });
  };

  const loadProducts = async (page = currentPage, data = filterData, isManualApply = false) => {
    if (!isManualApply && router.asPath.includes('?') && JSON.stringify(data) === '{}') {
      return;
    }

    if (page !== currentPage) setCurrentPage(page);
    if (data !== filterData) setFilterData(data);

    const queryString = `?page=${page + 1}&limit=${ITEMS_PER_PAGE}&sort=${sortDirection}&field=${sortField}`;
    dispatch(getProducts({ query: queryString, data }));
  };

  useEffect(() => {
    if (productsNotify?.showNotification) {
      showNotification(
          productsNotify.typeNotification,
          productsNotify.textNotification
      );
    }
  }, [productsNotify?.showNotification]);

  useEffect(() => {
    const handleInitialLoad = async () => {
      if (router.asPath.includes('?')) {

        const filterObject = {};

        await loadProducts(0, filterObject);
      } else {
        await loadProducts();
      }
    };

    handleInitialLoad();
  }, [sortDirection, sortField]);

  // TODO move Modal handlers in external function
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
      await dispatch(deleteProduct(selectedItemId));
      await loadProducts(0);
      closeModals();
    }
  };

  const handleRowClick = (id) => {
    router.push(`/products/${id}`);
  };
  //TODO move handle sort in external function
  const handleSort = (e) => {
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

    loadProducts(0, object, isManualFilterApply);
    router.replace({ query }, undefined, { shallow: true });
  };

  return (
      <>
        <Filters
            filters={filters}
            filterItems={filterItems}
            setFilterItems={setFilterItems}
            onApplyFilters={handleApplyFilters}
            className="mb-6"
        />

        {/* Delete Confirmation Modal */}
        <CardBoxModal
            title="Delete Product"
            buttonColor="danger"
            buttonLabel={loading ? 'Deleting...' : 'Delete'}
            isActive={isDeleteModalActive}
            onConfirm={confirmDelete}
            onCancel={closeModals}
        >
          <p>Are you sure you want to delete this product? This action cannot be undone.</p>
        </CardBoxModal>

        {/* Products Table */}
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-100 dark:bg-slate-700">
            <tr onClick={handleSort}>
              <th className="p-4" data-field="images">Images</th>
              <th className="sortable p-4" data-field="name">Name</th>
              <th className="sortable p-4" data-field="description">Description</th>
              <th className="sortable p-4" data-field="address">Address</th>
              <th className="sortable p-4" data-field="price">Price</th>
              <th className="sortable p-4" data-field="dealType">Deal Type</th>
              <th className="p-4" data-field="propertyType">Property Type</th>
              <th className="p-4" data-field="region">Region</th>
              <th className="sortable p-4" data-field="city">City</th>
              <th className="p-4" data-field="cityArea">City Area</th>
              <th className="sortable p-4" data-field="creator">Creator</th>
              <th className="sortable p-4" data-field="createdAt">Create Date</th>
              <th className="sortable p-4" data-field="updatedAt">Update Date</th>
              <th className="p-4">Actions</th>
            </tr>
            </thead>
            <tbody>
            {products && products.length > 0 ? (
                products.map((item) => (
                    <tr
                        key={item._id}
                        onClick={() => handleRowClick(item._id)}
                        className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 cursor-pointer"
                    >
                      <td className="p-4">
                        {item.images && item.images.length > 0 && (
                            <div className="w-16 h-16 rounded overflow-hidden">
                              <ImageItem
                                  src={item.images[0]}
                                  width={64}
                                  height={64}
                                  alt="Product"
                                  className="w-full h-full object-cover"
                              />
                            </div>
                        )}
                      </td>

                      <td className="p-4 font-medium">{item.name}</td>
                      <td className="p-4">
                        {item.description && item.description.length > 10
                            ? `${item.description.substring(0, 10)}...`
                            : item.description}
                      </td>
                      <td className="p-4">{item.address}</td>
                      <td className="p-4">{item.price}</td>
                      <td className="p-4">{dataFormatter.deal_typesOneListFormatter(item.dealType)}</td>
                      <td className="p-4">{dataFormatter.property_typesOneListFormatter(item.propertyType)}</td>
                      <td className="p-4">{dataFormatter.citiesOneListFormatter(item.region)}</td>
                      <td className="p-4">{dataFormatter.citiesOneListFormatter(item.city)}</td>
                      <td className="p-4">{dataFormatter.citiesOneListFormatter(item.cityArea)}</td>
                      <td className="p-4">{item.creator?.name}</td>
                      <td className="p-4">{dataFormatter.dateFormatter(item.createdAt)}</td>
                      <td className="p-4">{dataFormatter.dateFormatter(item.updatedAt)}</td>

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
                  <td colSpan={14} className="p-4 text-center">
                    {loading ? 'Loading...' : 'No products found'}
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
                Showing {products.length === 0 ? '0' : currentPage * ITEMS_PER_PAGE + 1} to{' '}
                {Math.min((currentPage + 1) * ITEMS_PER_PAGE, count)} of {count} entries
              </p>
            </div>
            <Pagination
                currentPage={currentPage}
                numPages={totalPages}
                setCurrentPage={(page) => loadProducts(page)}
            />
          </div>
        </div>

        <ToastContainer />
      </>
  );
};

export default TableProducts;
