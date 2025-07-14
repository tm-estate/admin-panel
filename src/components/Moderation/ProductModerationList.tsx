import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { getProducts } from '@/stores/thunks/products';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { useRouter } from 'next/router';
import { Pagination } from '@/components/Pagination';
import Filters from '@/components/Filters';
import { ITableProps } from "@/interfaces/ITable";
import ProductModerationCard from '@/components/Moderation/ProductModerationCard';

const ITEMS_PER_PAGE = 12;

const ProductModerationList: React.FC = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState(0);

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

    const loadProducts = async (page = currentPage) => {
        if (page !== currentPage) setCurrentPage(page);

        const queryString = `?page=${page + 1}&limit=${ITEMS_PER_PAGE}`;
        dispatch(getProducts({ query: queryString, data: { status: 'onModeration'} }));
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
        const handleInitialLoad = async () => await loadProducts();

        handleInitialLoad();
    }, []);

    // const handleModerationAction = () => {
    //     // Reload products after moderation action
    //     loadProducts(0);
    // };

    return (
        <>

            {loading && (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
                {products && products.length > 0 ? (
                    products.map((product) => (
                        <ProductModerationCard
                            key={product._id}
                            product={product}
                        />
                    ))
                ) : (
                    !loading && (
                        <div className="col-span-full text-center py-8">
                            <p className="text-gray-500">No products found for moderation</p>
                        </div>
                    )
                )}
            </div>

            {/* Pagination */}
            <div className="flex flex-col md:flex-row items-center justify-between bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
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

            <ToastContainer />
        </>
    );
};

export default ProductModerationList;
