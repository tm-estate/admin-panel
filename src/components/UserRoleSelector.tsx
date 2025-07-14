import React from 'react';
import { useAppDispatch } from '@/stores/hooks';
import { changeUserRole } from '@/stores/thunks/auth';
import { Role } from '@/constants/roles';
import { useAuth } from '@/hooks/useAuth';
import { Permission } from '@/constants/permissions';

interface UserRoleSelectorProps {
    userId: string;
    currentRole: Role;
    disabled?: boolean;
}

const UserRoleSelector: React.FC<UserRoleSelectorProps> = ({
                                                               userId,
                                                               currentRole,
                                                               disabled = false
                                                           }) => {
    const dispatch = useAppDispatch();
    const { hasPermission, hasRole } = useAuth();

    // Only SUPERADMIN can change roles to SUPERADMIN
    const canChangeTo = {
        [Role.SUPERADMIN]: hasRole(Role.SUPERADMIN),
        [Role.ADMIN]: true,
        [Role.MODERATOR]: true,
    };

    const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = e.target.value as Role;

        // Prevent changing to SUPERADMIN if not a SUPERADMIN
        if (newRole === Role.SUPERADMIN && !hasRole(Role.SUPERADMIN)) {
            return;
        }

        try {
            await dispatch(changeUserRole({ userId, role: newRole })).unwrap();
        } catch (error) {
            console.error('Failed to update role:', error);
            // You might want to show an error notification here
        }
    };

    // If user doesn't have permission to edit users, disable the select
    const isDisabled = disabled || !hasPermission(Permission.EDIT_USER);

    return (
        <select
            value={currentRole}
            onChange={handleRoleChange}
            disabled={isDisabled}
            className="form-select block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        >
            {Object.values(Role).map((role) => (
                canChangeTo[role] && (
                    <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                )
            ))}
        </select>
    );
};

export default UserRoleSelector;
