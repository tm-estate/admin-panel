import React, { useEffect, useState } from 'react';
import { mdiMinus, mdiPlus } from '@mdi/js';
import BaseIcon from '@/components/Base/BaseIcon';
import Link from 'next/link';
import { getButtonColor } from '@/colors';
import AsideMenuList from './AsideMenuList';
import { MenuAsideItem } from '@/interfaces';
import { useAppSelector } from '@/stores/hooks';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { Permission } from '@/constants/permissions';

type Props = {
  item: MenuAsideItem;
  isDropdownList?: boolean;
};

const AsideMenuItem = ({ item, isDropdownList = false }: Props) => {
  const [isLinkActive, setIsLinkActive] = useState(false);
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const { hasPermission } = useAuth();

  if (item.permission && !hasPermission(item.permission as Permission)) {
    return null;
  }

  const asideMenuItemStyle = useAppSelector(
      (state) => state.style.asideMenuItemStyle,
  );
  const asideMenuDropdownStyle = useAppSelector(
      (state) => state.style.asideMenuDropdownStyle,
  );
  const asideMenuItemActiveStyle = useAppSelector(
      (state) => state.style.asideMenuItemActiveStyle,
  );

  const activeClassAddon =
      !item.color && isLinkActive ? asideMenuItemActiveStyle : '';

  const { asPath, isReady } = useRouter();

  useEffect(() => {
    if (item.href && isReady) {
      const linkPathName = new URL(item.href, location.href).pathname + '/';
      const activePathname = new URL(asPath, location.href).pathname;
      setIsLinkActive(linkPathName === activePathname);
    }
  }, [item.href, isReady, asPath]);

  // If this item has children, filter them by permission
  const menuChildren = item.menu ? item.menu.filter(child =>
      !child.permission || hasPermission(child.permission as Permission)
  ) : null;

  // If no accessible children, don't render this item
  if (item.menu && (!menuChildren || menuChildren.length === 0)) {
    return null;
  }

  // If only one accessible child, render as direct link
  if (item.menu && menuChildren && menuChildren.length === 1) {
    const child = menuChildren[0];
    return (
        <AsideMenuItem
            item={{
              ...child,
              icon: item.icon || child.icon,
              label: item.label
            }}
            isDropdownList={isDropdownList}
        />
    );
  }

  const asideMenuItemInnerContents = (
      <>
        {item.icon && (
            <BaseIcon
                path={item.icon}
                className={`flex-none ${activeClassAddon}`}
                w='w-16'
                size='18'
            />
        )}
        <span
            className={`grow text-ellipsis line-clamp-1 ${
                item.menu ? '' : 'pr-12'
            } ${activeClassAddon}`}
        >
        {item.label}
      </span>
        {item.menu && (
            <BaseIcon
                path={isDropdownActive ? mdiMinus : mdiPlus}
                className={`flex-none ${activeClassAddon}`}
                w='w-12'
            />
        )}
      </>
  );

  const componentClass = [
    'flex cursor-pointer',
    isDropdownList ? 'py-3 px-6 text-sm' : 'py-3',
    item.color
        ? getButtonColor(item.color, false, true)
        : `${asideMenuItemStyle} dark:text-slate-300 dark:hover:text-white`,
  ].join(' ');

  return (
      <li>
        {item.href && (
            <Link href={item.href} target={item.target} className={componentClass}>
              {asideMenuItemInnerContents}
            </Link>
        )}
        {!item.href && (
            <div
                className={componentClass}
                onClick={() => setIsDropdownActive(!isDropdownActive)}
            >
              {asideMenuItemInnerContents}
            </div>
        )}
        {item.menu && (
            <AsideMenuList
                menu={menuChildren}
                className={`${asideMenuDropdownStyle} ${
                    isDropdownActive ? 'block dark:bg-slate-800/50' : 'hidden'
                }`}
                isDropdownList
            />
        )}
      </li>
  );
};

export default AsideMenuItem;
