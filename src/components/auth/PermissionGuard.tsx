import React, { ReactNode, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Permission } from '@/constants/permissions';
import { Role } from '@/constants/roles';

interface PermissionGuardProps {
    permission?: Permission;
    permissions?: Permission[];
    requireAll?: boolean;
    role?: Role;
    fallback?: ReactNode;
    children: ReactNode;
    className?: string;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
                                                                    permission,
                                                                    permissions = [],
                                                                    requireAll = false,
                                                                    role,
                                                                    fallback = null,
                                                                    children,
                                                                    className,
                                                                }) => {
    const { hasPermission, hasRole, hasAnyPermission, hasAllPermissions } = useAuth();

    const isAuthorized = useMemo(() => {
        if (role && !hasRole(role)) return false;
        if (permission && !hasPermission(permission)) return false;

        if (permissions.length > 0) {
            return requireAll
                ? hasAllPermissions(permissions)
                : hasAnyPermission(permissions);
        }

        return true;
    }, [
        role,
        permission,
        permissions,
        requireAll,
        hasRole,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions
    ]);

    if (isAuthorized) {
        return className ? <div className={className}>{children}</div> : <>{children}</>;
    }

    return fallback ? <>{fallback}</> : null;
};
