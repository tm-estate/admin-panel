import React, { useState } from 'react';
import {
    mdiCheckCircle,
    mdiCloseCircle,
    mdiHistory,
    mdiAccount,
    mdiMapMarker,
    mdiCurrencyUsd,
    mdiCalendar,
    mdiHandshake,
    mdiAccountCancel
} from '@mdi/js';
import BaseButton from '@/components/Base/BaseButton';
import BaseButtons from '@/components/Base/BaseButtons';
import CardBoxModal from '@/components/Cardbox/CardBoxModal';
import dataFormatter from '@/helpers/dataFormatter';
import { IProduct } from '@/interfaces';
import ImageSlider from '@/components/UI/Image/ImageSlider';
import Icon from "@mdi/react";
import {useAppDispatch} from "@/stores/hooks";
import {approve, reject, rejectAndBlock} from "@/stores/thunks/products";

interface ProductModerationCardProps {
    product: IProduct;
}

const ProductModerationCard: React.FC<ProductModerationCardProps> = ({
                                                                         product,
                                                                     }) => {
    const [isApproveModalActive, setIsApproveModalActive] = useState(false);
    const [isRejectModalActive, setIsRejectModalActive] = useState(false);
    const [isRejectAndBlockModalActive, setIsRejectAndBlockModalActive] = useState(false);
    // const [isHistoryModalActive, setIsHistoryModalActive] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [blockRejectionReason, setBlockRejectionReason] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();

    const handleApprove = async () => {
        await dispatch(approve(product._id))
        setIsApproveModalActive(false);
    };

    const handleReject = async () => {
        await dispatch((reject({ id: product._id, reason: rejectionReason })));
        setIsRejectModalActive(false)
    };

    const handleRejectAndBlock = async () => {
        await dispatch((rejectAndBlock({ id: product._id, reason: blockRejectionReason })));
        setIsRejectAndBlockModalActive(false)
    };

    const getStatusBadge = (status: string) => {
        const statusClasses = {
            'onmoderation': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            'approved': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            'rejected': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status] || statusClasses['onmoderation']}`}>
                {status?.charAt(0).toUpperCase() + status?.slice(1) || 'On Moderation'}
            </span>
        );
    };

    return (
        <>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-slate-700 h-[600px] flex flex-col">
                <div className="relative h-48 flex-shrink-0">
                    <ImageSlider images={product.images} productName={product.name} />
                    <div className="absolute top-2 right-2">
                        {getStatusBadge(product.status)}
                    </div>
                </div>

                <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {product.name}
                    </h3>

                    <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Icon path={mdiMapMarker} size={0.7} className="mr-1" />
                            <span>{product.address}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Icon path={mdiCurrencyUsd} size={0.7} className="mr-1" />
                            <span className="font-medium">{product.price}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Icon path={mdiHandshake} size={0.7} className="mr-1" />
                            <span>
                                {dataFormatter.deal_typesOneListFormatter(product.dealType)}
                            </span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Icon path={mdiAccount} size={0.7} className="mr-1" />
                            <span>{product.creator?.name || 'Unknown'}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Icon path={mdiCalendar} size={0.7} className="mr-1" />
                            <span>{dataFormatter.dateFormatter(product.createdAt)}</span>
                        </div>
                    </div>

                    {/* Property Details */}
                    <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                        <div>
                            <span className="text-gray-500">Type:</span>
                            <span className="ml-1 text-gray-900 dark:text-white">
                                {dataFormatter.property_typesOneListFormatter(product.propertyType)}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-500">City:</span>
                            <span className="ml-1 text-gray-900 dark:text-white">
                                {dataFormatter.citiesOneListFormatter(product.city)}
                            </span>
                        </div>
                    </div>

                    {product.description && (
                        <div className="flex-grow mb-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-4">
                                {product.description}
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col gap-2 mt-auto">
                        <BaseButtons type="justify-between" noWrap>
                            <BaseButton
                                color="success"
                                icon={mdiCheckCircle}
                                label="Approve"
                                onClick={() => setIsApproveModalActive(true)}
                                disabled={loading}
                                small
                            />
                            <BaseButton
                                color="danger"
                                icon={mdiCloseCircle}
                                label="Reject"
                                onClick={() => setIsRejectModalActive(true)}
                                disabled={loading}
                                small
                            />
                        </BaseButtons>

                        <BaseButtons type="justify-between" noWrap>
                            <BaseButton
                                color="warning"
                                icon={mdiAccountCancel}
                                label="Reject & Block"
                                onClick={() => setIsRejectAndBlockModalActive(true)}
                                disabled={loading}
                                small
                            />
                            {/*<BaseButton*/}
                            {/*    color="info"*/}
                            {/*    icon={mdiHistory}*/}
                            {/*    label="View History"*/}
                            {/*    onClick={() => setIsHistoryModalActive(true)}*/}
                            {/*    outline*/}
                            {/*    small*/}
                            {/*/>*/}
                        </BaseButtons>
                    </div>
                </div>
            </div>

            <CardBoxModal
                title="Approve Product"
                buttonColor="success"
                buttonLabel={loading ? 'Approving...' : 'Approve'}
                isActive={isApproveModalActive}
                onConfirm={handleApprove}
                onCancel={() => setIsApproveModalActive(false)}
            >
                <p>Are you sure you want to approve this product? It will be visible to all users.</p>
            </CardBoxModal>

            <CardBoxModal
                title="Reject Product"
                buttonColor="danger"
                buttonLabel={loading ? 'Rejecting...' : 'Reject'}
                isActive={isRejectModalActive}
                isDisabled={rejectionReason.length === 0}
                onConfirm={handleReject}
                onCancel={() => {
                    setIsRejectModalActive(false);
                    setRejectionReason('');
                }}
            >
                <div>
                    <p className="mb-4">Please provide a reason for rejection:</p>
                    <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        rows={4}
                        placeholder="Enter rejection reason..."
                        required
                    />
                </div>
            </CardBoxModal>

            <CardBoxModal
                title="Reject Product & Block User"
                buttonColor="warning"
                buttonLabel={loading ? 'Processing...' : 'Reject & Block'}
                isActive={isRejectAndBlockModalActive}
                isDisabled={blockRejectionReason.length === 0}
                onConfirm={handleRejectAndBlock}
                onCancel={() => {
                    setIsRejectAndBlockModalActive(false);
                    setBlockRejectionReason('');
                }}
            >
                <div>
                    <p className="mb-4 text-red-600 font-medium">
                        Warning: This will reject the product and block the user from creating new products.
                    </p>
                    <p className="mb-4">Please provide a reason for rejection and blocking:</p>
                    <textarea
                        value={blockRejectionReason}
                        onChange={(e) => setBlockRejectionReason(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        rows={4}
                        placeholder="Enter reason for rejection and blocking..."
                        required
                    />
                </div>
            </CardBoxModal>

            {/* History Modal */}
            {/*<ProductHistoryModal*/}
            {/*    isActive={isHistoryModalActive}*/}
            {/*    onClose={() => setIsHistoryModalActive(false)}*/}
            {/*    productId={product._id}*/}
            {/*/>*/}
        </>
    );
};

export default ProductModerationCard;
