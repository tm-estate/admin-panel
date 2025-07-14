import React from 'react';
import Head from 'next/head';
import {getPageTitle} from '@/config';
import Link from 'next/link';
import {useAuth} from "@/hooks/useAuth";
import {Permission} from "@/constants/permissions";
import {logout} from "@/stores/thunks/auth";
import {useAppDispatch} from "@/stores/hooks";

const Unauthorized = () => {
    const { hasPermission } = useAuth();
    const dispatch = useAppDispatch()

    return (
        <>
            <Head>
                <title>{getPageTitle('Access Denied')}</title>
            </Head>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-800">
                <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md text-center dark:bg-slate-900">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>

                    <div className="mb-6">
                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                            You don't have permission to access this page.
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                            Please contact your administrator if you believe this is a mistake.
                        </p>
                    </div>

                    {
                        !hasPermission(Permission.VIEW_DASHBOARD)
                        ? <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block" onClick={() => dispatch(logout())}>
                            Back to Login
                        </Link>
                        : <Link href="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block">
                            Back to Dashboard
                        </Link>
                    }


                </div>
            </div>
        </>
    );
};

export default Unauthorized;
