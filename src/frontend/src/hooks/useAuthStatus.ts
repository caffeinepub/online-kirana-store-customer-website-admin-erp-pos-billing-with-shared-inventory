import { useInternetIdentity } from './useInternetIdentity';
import { useGetCallerUserRole } from './useQueries';
import { UserRole } from '../backend';

/**
 * Helper hook that derives authentication and admin status
 * from Internet Identity and backend role queries.
 * Designed to support safe effect-based redirects without render-time navigation.
 */
export function useAuthStatus() {
  const { identity, loginStatus } = useInternetIdentity();
  const { data: role, isLoading: roleLoading } = useGetCallerUserRole();

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const isAdmin = isAuthenticated && role === UserRole.admin;
  const isLoading = loginStatus === 'initializing' || (isAuthenticated && roleLoading);

  return {
    isAuthenticated,
    isAdmin,
    isLoading,
    role,
  };
}
