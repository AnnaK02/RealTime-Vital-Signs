import { useAuthStore } from "@/store/auth";

export const validateAuth = async (to, from, next) => {
  const authStore = useAuthStore();

  const token = localStorage.getItem('token');
  authStore.setToken(token);

  if (!token) {
    return next(
      to.path === '/login'
        ? undefined
        : '/login'
    );
  }

  if (to?.redirectedFrom)
    return next();

  await authStore.fetchUser({
    callback: {
      onSuccess: () => next(
        to.path === '/login'
          ? '/'
          : undefined
      ),
      onError: () => next('/login'),
    },
  });
}
