import { apiInstance } from "@/config/ky";
import { useMutation } from "@tanstack/react-query";

interface usePutCategoryParams {
  onSuccess?: (data: PutCategoryResponse) => void;
  onError?: (error: unknown) => void;
}
export const usePutCategory = ({ onSuccess, onError }: usePutCategoryParams) => {
  return useMutation({
    mutationKey: ['put-category'],
    mutationFn: async ({ id, ...data }: PutCategoryVariables) => {
      try {
        const apiResult = await apiInstance
          .put(`productServices/category/${id}`, {
            json: data,
          })
          .json<PutCategoryResponse>();
        onSuccess?.(apiResult);
        return apiResult;
      } catch (error) {
        onError?.(error);
      }
    },
  });
};

interface PutCategoryVariables {
  id: string;
  name: string;
  imageURL: string;
}

export interface PutCategoryResponse {
  id:       string;
  name:     string;
  imageURL: string;
}
