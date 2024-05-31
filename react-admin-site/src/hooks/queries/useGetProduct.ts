import { apiInstance } from '@/config/ky';
import { useQuery } from '@tanstack/react-query';

interface useGetProductParams {
  onSuccess?: (data: Product[]) => void;
  onError?: (error: unknown) => void;
}

export const useGetProduct = ({
  onSuccess,
  onError,
}: useGetProductParams) => {
  return useQuery({
    queryKey: ['get-product'],
    queryFn: async () => {
      try {
        const apiResult = await apiInstance
          .get('productServices/')
          .json<Product[]>();
        onSuccess?.(apiResult);
        return apiResult;
      } catch (error) {
        onError?.(error);
      }
    },
  });
};
export interface Product {
  id:          string;
  name:        string;
  prices:      number;
  description: string;
  imageURL:    string;
  categoryId:  string;
  createdAt:   string;
  updatedAt:   string;
  category:    ProductCategory;
}

export interface ProductCategory {
  id:       string;
  name:     string;
  imageURL: string;
}
