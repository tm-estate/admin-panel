import { IFilterConfig } from "@/interfaces";

export const usersFilters: IFilterConfig[] = [
    {
        label: 'Name',
        key: 'name',
        selectType: 'search'
    },
    {
        label: 'Phone',
        key: 'phone',
        selectType: 'search'
    },
    {
        label: 'Email',
        key: 'email',
        selectType: 'search'
    },
    {
        label: 'Role',
        key: 'role',
        selectType: 'multi',
        options: [
            { key: 'admin', label: 'Admin' },
            { key: 'user', label: 'User' }
        ]
    },
    {
        label: 'Is Agent',
        key: 'isAgent',
        selectType: 'boolean'
    },
    {
        label: 'Is Confirmed',
        key: 'isPhoneNumberConfirmed',
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
