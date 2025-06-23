import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const useIsAdminOrSuperAdmin = () => {
  const [isAdminOrSuperAdmin, setIsAdminOrSuperAdmin] = useState(false);

  // Get userType from Redux store
  const userType = useSelector((state) => state.userType);

  useEffect(() => {
    setIsAdminOrSuperAdmin(userType === 'Admin' || userType === 'SuperAdmin');
  }, [userType]);

  return isAdminOrSuperAdmin;
};

export default useIsAdminOrSuperAdmin;
