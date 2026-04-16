// src/hooks/useAuth.js

import { useUser } from "@clerk/clerk-react";

const useAuth = () => {
  const { user, isLoaded } = useUser();

  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

  // 🔄 Loading state
  if (!isLoaded) {
    return {
      loading: true,
      isAuthenticated: false,
      user: null,
    };
  }

  // 🔐 Admin email validation
  if (
    user &&
    user.primaryEmailAddress?.emailAddress === ADMIN_EMAIL
  ) {
    return {
      loading: false,
      isAuthenticated: true,
      user: {
        email: user.primaryEmailAddress.emailAddress,
        name:
          user.fullName ||
          user.firstName ||
          user.primaryEmailAddress.emailAddress,
        image: user.imageUrl,
      },
    };
  }

  // ❌ Not authorized
  return {
    loading: false,
    isAuthenticated: false,
    user: null,
  };
};

export default useAuth;