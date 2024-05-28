import { apiInstance } from "@/config/ky";
import { useMutation } from "@tanstack/react-query";

interface usePostCategoryParams {
  onSuccess?: (data: PostCategoryResponse) => void;
  onError?: (error: unknown) => void;
}
export const usePostCategory = ({ onSuccess, onError }: usePostCategoryParams) => {
  return useMutation({
    mutationKey: ['post-category'],
    mutationFn: async (data: PostCategoryBody) => {
      try {
        const apiResult = await apiInstance
          .post('productServices/category', {
            json: data,
          })
          .json<PostCategoryResponse>();
        onSuccess?.(apiResult);
        return apiResult;
      } catch (error) {
        onError?.(error);
      }
    },
  });
};

interface PostCategoryBody {
  name: string;
  imageURL: string;
}

export interface PostCategoryResponse {
  id:       string;
  name:     string;
  imageURL: string;
}
