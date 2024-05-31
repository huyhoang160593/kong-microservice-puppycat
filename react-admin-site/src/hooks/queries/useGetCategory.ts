import { apiInstance } from '@/config/ky';
import { useQuery } from '@tanstack/react-query';

interface useGetCategoryParams {
  onSuccess?: (data: Category[]) => void;
  onError?: (error: unknown) => void;
}

export const useGetCategory = ({
  onSuccess,
  onError,
}: useGetCategoryParams) => {
  return useQuery({
    queryKey: ['get-category'],
    queryFn: async () => {
      try {
        const apiResult = await apiInstance
          .get('productServices/category')
          .json<Category[]>();
        onSuccess?.(apiResult);
        return apiResult;
      } catch (error) {
        onError?.(error);
      }
    },
  });
};

export interface Category {
  id: string;
  name: string;
  imageURL: string;
  product: CategoryProduct[];
}

export interface CategoryProduct {
  id: string;
  name: string;
  prices: number;
  description: string;
  imageURL: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}
