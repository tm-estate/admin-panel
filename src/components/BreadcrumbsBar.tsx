import React from 'react';
import Link from 'next/link';
import { mdiChevronRight } from '@mdi/js';
import Icon from '@mdi/react/Icon';

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbsBarProps {
    items: BreadcrumbItem[];
    className?: string;
}

const BreadcrumbsBar: React.FC<BreadcrumbsBarProps> = ({ items, className = '' }) => {
    if (!items || items.length === 0) return null;

    return (
        <nav className={`flex text-sm text-gray-500 dark:text-gray-400 ${className}`} aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                {items.map((item, index) => (
                    <li key={`${item.label}-${index}`} className="inline-flex items-center">
                        {index > 0 && (
                            <Icon
                                path={mdiChevronRight}
                                size={0.8}
                                className="mx-1 text-gray-400 dark:text-gray-500"
                            />
                        )}

                        {index === items.length - 1 ? (
                            <span className="text-gray-700 dark:text-gray-300 font-medium">
                {item.label}
              </span>
                        ) : (
                            <Link
                                href={item.href}
                                className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                            >
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default BreadcrumbsBar;
