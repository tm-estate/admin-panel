import React from 'react';
import { MenuAsideItem } from '@/interfaces';
import AsideMenuItem from './AsideMenuItem';
import { useAuth } from '@/hooks/useAuth';
import { Permission } from '@/constants/permissions';

type Props = {
  menu: MenuAsideItem[];
  isDropdownList?: boolean;
  className?: string;
};

export default function AsideMenuList({
                                        menu,
                                        isDropdownList = false,
                                        className = '',
                                      }: Props) {
  const { hasPermission } = useAuth();

  // Filter menu items based on permissions
  const filteredMenu = menu.filter(item => {
    if (item.permission) {
      return hasPermission(item.permission as Permission);
    }

    if (item.menu) {
      // Check if there are any accessible items in the submenu
      return item.menu.some(
          child => !child.permission || hasPermission(child.permission as Permission)
      );
    }

    return true;
  });

  return (
      <ul className={className}>
        {filteredMenu.map((item, index) => (
            <AsideMenuItem
                key={index}
                item={item}
                isDropdownList={isDropdownList}
            />
        ))}
      </ul>
  );
}
