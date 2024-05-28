import { apiInstance } from '@/config/ky';
import { useMutation } from '@tanstack/react-query';

interface useDeleteCategoryParams {
  onSuccess?: (data: DeleteCategoryResponse) => void;
  onError?: (error: unknown) => void;
}
export const useDeleteCategory = ({
  onSuccess,
  onError,
}: useDeleteCategoryParams) => {
  return useMutation({
    mutationKey: ['delete-category'],
    mutationFn: async (data: DeleteCategoryVariable) => {
      try {
        const apiResult = await apiInstance
          .delete(`productServices/category/${data.id}`, {})
          .json<DeleteCategoryResponse>();
        onSuccess?.(apiResult);
        return apiResult;
      } catch (error) {
        onError?.(error);
      }
    },
  });
};

interface DeleteCategoryVariable {
  id: string;
}

export interface DeleteCategoryResponse {}
