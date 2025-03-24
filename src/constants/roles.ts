// src/constants/roles.ts
// Define roles and their permissions

import { Permission } from './permissions';

export enum Role {
    SUPERADMIN = 'superadmin',
    ADMIN = 'admin',
    MODERATOR = 'moderator',
}

// Map roles to their permissions
export const rolePermissions: Record<Role, Permission[]> = {
    [Role.SUPERADMIN]: Object.values(Permission),

    [Role.ADMIN]: [
        // Dashboard
        Permission.VIEW_DASHBOARD,

        // Agency Types
        Permission.VIEW_AGENCY_TYPES,
        Permission.CREATE_AGENCY_TYPE,
        Permission.EDIT_AGENCY_TYPE,
        Permission.DELETE_AGENCY_TYPE,

        // Users
        Permission.VIEW_USERS,
        Permission.CREATE_USER,
        Permission.EDIT_USER,
        Permission.DELETE_USER,
        // Note: No CHANGE_PASSWORD for admin

        // Products
        Permission.VIEW_PRODUCTS,
        Permission.CREATE_PRODUCT,
        Permission.EDIT_PRODUCT,
        Permission.DELETE_PRODUCT,

        // Settings
        Permission.VIEW_SETTINGS,
        Permission.EDIT_SETTINGS,

        // Deal Types
        Permission.VIEW_DEAL_TYPES,
        Permission.CREATE_DEAL_TYPE,
        Permission.EDIT_DEAL_TYPE,
        Permission.DELETE_DEAL_TYPE,

        // Property Types
        Permission.VIEW_PROPERTY_TYPES,
        Permission.CREATE_PROPERTY_TYPE,
        Permission.EDIT_PROPERTY_TYPE,
        Permission.DELETE_PROPERTY_TYPE,

        // Regions
        Permission.VIEW_REGIONS,
        Permission.CREATE_REGION,
        Permission.EDIT_REGION,
        Permission.DELETE_REGION,

        // Cities
        Permission.VIEW_CITIES,
        Permission.CREATE_CITY,
        Permission.EDIT_CITY,
        Permission.DELETE_CITY,

        // City Areas
        Permission.VIEW_CITY_AREAS,
        Permission.CREATE_CITY_AREA,
        Permission.EDIT_CITY_AREA,
        Permission.DELETE_CITY_AREA,
    ],

    [Role.MODERATOR]: [
        // Dashboard
        Permission.VIEW_DASHBOARD,

        // Products only
        Permission.VIEW_PRODUCTS,
        Permission.EDIT_PRODUCT,
        Permission.DELETE_PRODUCT,

        Permission.VIEW_USERS,
        Permission.EDIT_USER,

        // Read-only access to reference data
        Permission.VIEW_DEAL_TYPES,
        Permission.VIEW_PRODUCTS_PARAMS,
        // Permission.VIEW_PRODUCTS_PARAM_ITEMS, // uncomment when made fixes
        Permission.VIEW_PROPERTY_TYPES,
        Permission.VIEW_REGIONS,
        Permission.VIEW_CITIES,
        Permission.VIEW_CITY_AREAS,
    ],
};

// Helper functions for role handling
export function getPermissionsForRole(role: Role): Permission[] {
    return rolePermissions[role] || [];
}

export function roleHasPermission(role: Role, permission: Permission): boolean {
    return rolePermissions[role]?.includes(permission) || false;
}
