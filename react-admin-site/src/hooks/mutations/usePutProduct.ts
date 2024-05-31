import { apiInstance } from '@/config/ky';
import { useMutation } from '@tanstack/react-query';

interface usePutProductParams {
  onSuccess?: (data: PutProductResponse) => void;
  onError?: (error: unknown) => void;
}
export const usePutProduct = ({ onSuccess, onError }: usePutProductParams) => {
  return useMutation({
    mutationKey: ['put-product'],
    mutationFn: async ({ id, ...data }: PutProductVariables) => {
      try {
        const apiResult = await apiInstance
          .put(`productServices/${id}`, {
            json: data,
          })
          .json<PutProductResponse>();
        onSuccess?.(apiResult);
        return apiResult;
      } catch (error) {
        onError?.(error);
      }
    },
  });
};

export interface PutProductVariables {
  id: string;
  name: string;
  prices: number;
  imageURL: string;
  description: string;
  categoryId: string;
}

export interface PutProductResponse {
  id: string;
  name: string;
  prices: number;
  description: string;
  imageURL: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}
