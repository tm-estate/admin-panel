import React, { ReactNode, useEffect, useState } from 'react';
import { useAppSelector } from '@/stores/hooks';
import UserAvatar from './UserAvatar';

type Props = {
  className?: string;
  children?: ReactNode;
};

export default function UserAvatarCurrentUser({ className = '', children,}: Props) {
  const { userName, userAvatar } = useAppSelector((state) => state.main);
  const { user, loading } = useAppSelector((state) => state.auth);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (!user) return;

    setAvatar(user.avatar);
  }, [user]);

  return (
    <UserAvatar
      username={userName}
      avatar={userAvatar}
      className={className}
      image={avatar}
    >
      {children}
    </UserAvatar>
  );
}
