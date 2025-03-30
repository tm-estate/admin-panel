import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Permission } from '@/constants/permissions';
import { useAuth } from '@/hooks/useAuth';

interface WithAuthOptions {
    permissions?: Permission[];
    requireAll?: boolean;
    redirectTo?: string;
}

export function withAuth<P extends object, L extends (page: React.ReactElement) => React.ReactNode>(
    Component: React.ComponentType<P> & { getLayout?: L },
    options: WithAuthOptions = {}
) {
    const { permissions = [], requireAll = false } = options;

    const AuthComponent: React.FC<P> = (props) => {
        const router = useRouter();
        const { user, hasAnyPermission, hasAllPermissions } = useAuth();
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            if (typeof window === 'undefined') return;
            if (user) {
                if (permissions.length > 0) {
                    const hasRequiredPermissions = requireAll
                        ? hasAllPermissions(permissions)
                        : hasAnyPermission(permissions);

                    if (!hasRequiredPermissions) {
                        router.push('/unauthorized');
                        return;
                    }
                }
                setLoading(false);
            }
        }, [user, router.pathname]);

        if (loading) {
            return (
                <div className="flex h-screen items-center justify-center">
                    <div className="text-2xl">Loading...</div>
                </div>
            );
        }

        return <Component {...props} />;
    };

    const WithAuthComponent = AuthComponent as typeof AuthComponent & { getLayout?: L };

    if (Component.getLayout) {
        WithAuthComponent.getLayout = Component.getLayout;
    }

    return WithAuthComponent;
}
