// Clerk composables are auto-imported by @clerk/nuxt

interface AuthState {
  user: {
    id: string;
    login: string;
    name: string;
    bio?: string;
    avatarUrl: string;
  } | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export const useAppAuth = () => {
  const { isSignedIn, isLoaded, user: clerkUser } = useUser();
  const { signOut } = useAuth();
  const clerk = useClerk();

  const authState = computed<AuthState>(() => ({
    user: clerkUser.value ? {
      id: clerkUser.value.id,
      login: clerkUser.value.username || clerkUser.value.id,
      name: clerkUser.value.fullName || clerkUser.value.username || 'User',
      bio: undefined,
      avatarUrl: clerkUser.value.imageUrl,
    } : null,
    isAuthenticated: isSignedIn.value ?? false,
    loading: !isLoaded.value,
  }));

  const initializeAuth = async () => {
    // Clerk handles initialization automatically
    // This function is kept for API compatibility
  };

  const login = () => {
    // Open Clerk's sign-in modal
    clerk.value?.openSignIn();
  };

  const logout = async () => {
    try {
      await signOut();
      await navigateTo('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return {
    authState: readonly(authState),
    initializeAuth,
    login,
    logout,
  };
};