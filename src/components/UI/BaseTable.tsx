import React, { useState } from 'react';
import { mdiEye, mdiPencil, mdiTrashCan } from '@mdi/js';
import { ToastContainer, toast } from 'react-toastify';
import BaseButton from '@/components/BaseButton';
import BaseButtons from '@/components/BaseButtons';
import CardBoxModal from '@/components/CardBoxModal';
import { Pagination } from '@/components/Pagination';
import { INotify } from '@/interfaces';
import { useRouter } from 'next/router';
import dataFormatter from '@/helpers/dataFormatter';

interface TableColumn {
    field: string;
    label: string;
    sortable?: boolean;
    formatter?: string;
}

interface BaseTableProps {
    items: any[];
    loading: boolean;
    count: number;
    columns: TableColumn[];
    entityPath: string;
    onDelete: (id: string) => any;
    onLoad: (params: { page: number; limit: number; sort: string; field: string; }) => void;
    notifyState: INotify;
    formatters?: Record<string, (value: any) => string | React.ReactNode>;
}

const BaseTable: React.FC<BaseTableProps> = ({
                                                 items = [],
                                                 loading = false,
                                                 count = 0,
                                                 columns = [],
                                                 entityPath,
                                                 onDelete,
                                                 onLoad,
                                                 notifyState,
                                                 formatters = {},
                                             }) => {
    const router = useRouter();
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [isDeleteModalActive, setIsDeleteModalActive] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [sortDirection, setSortDirection] = useState('desc');
    const [sortField, setSortField] = useState('');

    const totalPages = Math.max(1, Math.ceil(count / itemsPerPage));
    const startItemIndex = currentPage * itemsPerPage;
    const endItemIndex = Math.min(startItemIndex + itemsPerPage, count);

    React.useEffect(() => {
        if (notifyState?.showNotification) {
            toast(notifyState.textNotification, {
                type: notifyState.typeNotification,
                position: 'bottom-center'
            });
        }
    }, [notifyState?.showNotification]);

    const handleSort = (e) => {
        const headerElement = e.target;
        if (headerElement?.classList?.contains('sortable')) {
            const field = headerElement.getAttribute('data-field');

            const newDirection = field === sortField && sortDirection === 'desc' ? 'asc' : 'desc';

            setSortField(field);
            setSortDirection(newDirection);

            onLoad({
                page: currentPage + 1,
                limit: itemsPerPage,
                sort: newDirection,
                field: field
            });

            const headers = document.querySelectorAll('th.sortable');
            headers.forEach(el => el.classList.remove('asc', 'desc'));
            headerElement.classList.add(newDirection);
        }
    };

    const formatCellValue = (item, column) => {
        const value = item[column.field];

        if (column.formatter && formatters[column.formatter]) {
            return formatters[column.formatter](value);
        }
        if (column.formatter === 'date') {
            return dataFormatter.dateFormatter(value);
        }

        if (column.formatter === 'boolean') {
            return dataFormatter.booleanFormatter(value);
        }

        if (column.formatter === 'currency') {
            return dataFormatter.currencyFormatter(value);
        }

        if (column.field.includes('date') || column.field === 'createdAt' || column.field === 'updatedAt') {
            return dataFormatter.dateFormatter(value);
        }

        return value;
    };

    const handleRowClick = (id) => {
        router.push(`/${entityPath}/${id}`);
    };

    const handleEditClick = (e, id) => {
        e.stopPropagation();
        router.push(`/${entityPath}/${id}`);
    };

    const handleDeleteClick = (e, id) => {
        e.stopPropagation();
        setSelectedItemId(id);
        setIsDeleteModalActive(true);
    };

    const handleViewClick = (e, id) => {
        e.stopPropagation();
        router.push(`/${entityPath}/view/${id}`);
    };

    // Confirm item deletion
    const confirmDelete = async () => {
        if (!selectedItemId) return;

        setIsDeleting(true);

        try {
            await onDelete(selectedItemId);
            // Refresh data after deletion
            onLoad({
                page: 1,
                limit: itemsPerPage,
                sort: sortDirection,
                field: sortField
            });
            setIsDeleteModalActive(false);
            setSelectedItemId(null);
        } catch (error) {
            console.error('Error deleting item:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
        onLoad({
            page: page + 1, // Convert from 0-indexed to 1-indexed
            limit: itemsPerPage,
            sort: sortDirection,
            field: sortField
        });
    };

    return (
        <>
            {/* Delete confirmation modal */}
            <CardBoxModal
                title="Delete Item"
                buttonColor="danger"
                buttonLabel={isDeleting ? 'Deleting...' : 'Delete'}
                isActive={isDeleteModalActive}
                onConfirm={confirmDelete}
                onCancel={() => setIsDeleteModalActive(false)}
            >
                <p>Are you sure you want to delete this item? This action cannot be undone.</p>
            </CardBoxModal>

            {/* Main Table */}
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                    <tr onClick={handleSort}>
                        {columns.map((column) => (
                            <th
                                key={column.field}
                                className={`p-4 ${column.sortable ? 'sortable cursor-pointer' : ''} ${sortField === column.field ? sortDirection : ''}`}
                                data-field={column.field}
                            >
                                {column.label}
                            </th>
                        ))}
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={columns.length + 1} className="p-4 text-center">
                                Loading data...
                            </td>
                        </tr>
                    ) : items.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + 1} className="p-4 text-center">
                                No items found
                            </td>
                        </tr>
                    ) : (
                        items.map((item) => (
                            <tr
                                key={item._id}
                                onClick={() => handleRowClick(item._id)}
                                className="bg-white border-b hover:bg-gray-50 cursor-pointer"
                            >
                                {columns.map((column) => (
                                    <td key={`${item._id}-${column.field}`} className="p-4">
                                        {formatCellValue(item, column)}
                                    </td>
                                ))}
                                <td className="p-4 text-right">
                                    <BaseButtons type="justify-end" noWrap>
                                        <BaseButton
                                            color="info"
                                            icon={mdiEye}
                                            onClick={(e) => handleViewClick(e, item._id)}
                                            small
                                        />
                                        <BaseButton
                                            color="success"
                                            icon={mdiPencil}
                                            onClick={(e) => handleEditClick(e, item._id)}
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
                    )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {!loading && items.length > 0 && (
                <div className="p-3 lg:px-6 border-t border-gray-100">
                    <div className="flex flex-col md:flex-row items-center justify-between py-3 md:py-0">
                        <div className="flex items-center mb-3 md:mb-0">
                            <p className="text-gray-500">
                                Showing {count === 0 ? 0 : startItemIndex + 1} to {endItemIndex} of {count} entries
                            </p>
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            numPages={totalPages}
                            setCurrentPage={handlePageChange}
                        />
                    </div>
                </div>
            )}

            <ToastContainer />
        </>
    );
};

export default BaseTable;
