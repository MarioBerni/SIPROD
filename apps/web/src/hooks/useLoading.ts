import { create } from 'zustand';

interface LoadingState {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  withLoading: <T>(promise: Promise<T>) => Promise<T>;
}

const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  withLoading: async <T>(promise: Promise<T>): Promise<T> => {
    set({ isLoading: true });
    try {
      const result = await promise;
      return result;
    } finally {
      set({ isLoading: false });
    }
  },
}));

// Hook personalizado que expone solo los métodos necesarios
export const useLoading = () => {
  const isLoading = useLoadingStore((state) => state.isLoading);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const withLoading = useLoadingStore((state) => state.withLoading);

  return {
    isLoading,
    setLoading,
    withLoading,
  };
};
