import { IFilterConfig } from "@/interfaces";

export const productFilters: IFilterConfig[] = [
    {
        label: 'Name',
        key: 'name',
        selectType: 'search'
    },
    {
        label: 'Deal Type',
        key: 'dealType',
        selectType: 'select',
        itemRef: 'dealTypes',
        showField: 'titleRu'
    },
    {
        label: 'Property Types',
        key: 'propertyType',
        selectType: 'multi',
        itemRef: 'propertyTypes',
        showField: 'titleRu'
    },
    {
        label: 'Regions',
        key: 'region',
        selectType: 'multi',
        itemRef: 'regions',
        showField: 'titleRu'
    },
    {
        label: 'Cities',
        key: 'city',
        selectType: 'multi',
        itemRef: 'cities',
        showField: 'titleRu'
    },
    {
        label: 'City Areas',
        key: 'cityArea',
        selectType: 'multi',
        itemRef: 'cityAreas',
        showField: 'titleRu'
    },
    {
        label: 'Creator',
        key: 'creator',
        selectType: 'search',
        itemRef: 'users',
        showField: 'name'
    },
    {
        label: 'Address',
        key: 'address',
        selectType: 'search'
    },
    {
        label: 'Prices',
        key: 'price',
        selectType: 'number'
    },
    {
        label: 'Status',
        key: 'status',
        selectType: 'multi',
        options: [
            {
                key: 'active',
                label: 'Active'
            },
            {
                key: 'inactive',
                label: 'Inactive'
            },
            {
                key: 'onModeration',
                label: 'On moderation'
            },
            {
                key: 'rejected',
                label: 'Rejected'
            },
            {
                key: 'waitingForPayment',
                label: 'Waiting for payment'
            }
        ]
    },
    {
        label: 'With Photo',
        key: 'withPhoto',
        selectType: 'boolean'
    },
    {
        label: 'Created At',
        key: 'createdAt',
        selectType: 'date'
    },
    {
        label: 'Updated At',
        key: 'updatedAt',
        selectType: 'date'
    }
]
