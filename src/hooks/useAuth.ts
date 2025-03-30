import { useCallback, useMemo } from 'react';
import { useAppSelector } from '@/stores/hooks';
import { Permission } from '@/constants/permissions';
import { Role } from '@/constants/roles';
import { rolePermissions } from '@/constants/roles';

export function useAuth() {
    const { user } = useAppSelector((state) => state.auth);

    // Memoize user permissions to avoid recalculations
    const userPermissions = useMemo(() => {
        if (!user) return [];

        // If user has explicit permissions, use those
        if (user.permissions) return user.permissions;

        // Otherwise use role-based permissions
        return rolePermissions[user.role as Role] || [];
    }, [user]);

    // Check if the user has a specific permission
    const hasPermission = useCallback(
        (permission: Permission): boolean => {
            if (!user) return false;
            return userPermissions.includes(permission);
        },
        [user, userPermissions]
    );

    // Check if the user has a specific role
    const hasRole = useCallback(
        (role: Role): boolean => {
            return user?.role === role;
        },
        [user]
    );

    // Check if the user has any of the specified permissions
    const hasAnyPermission = useCallback(
        (permissions: Permission[]): boolean => {
            return permissions.some((permission) => hasPermission(permission));
        },
        [hasPermission]
    );

    // Check if the user has all of the specified permissions
    const hasAllPermissions = useCallback(
        (permissions: Permission[]): boolean => {
            return permissions.every((permission) => hasPermission(permission));
        },
        [hasPermission]
    );

    return {
        user,
        userPermissions,
        hasPermission,
        hasRole,
        hasAnyPermission,
        hasAllPermissions,
    };
}
