import { apiInstance } from '@/config/ky';
import { useMutation } from '@tanstack/react-query';

interface useDeleteProductParams {
  onSuccess?: (data: DeleteProductResponse) => void;
  onError?: (error: unknown) => void;
}
export const useDeleteProduct = ({
  onSuccess,
  onError,
}: useDeleteProductParams) => {
  return useMutation({
    mutationKey: ['delete-product'],
    mutationFn: async (data: DeleteProductVariable) => {
      try {
        const apiResult = await apiInstance
          .delete(`productServices/${data.id}`, {})
          .json<DeleteProductResponse>();
        onSuccess?.(apiResult);
        return apiResult;
      } catch (error) {
        onError?.(error);
      }
    },
  });
};

interface DeleteProductVariable {
  id: string;
}

export interface DeleteProductResponse {}
