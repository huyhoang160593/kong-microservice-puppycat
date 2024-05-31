import { apiInstance } from "@/config/ky";
import { useMutation } from "@tanstack/react-query";

interface usePostProductParams {
  onSuccess?: (data: PostProductResponse) => void;
  onError?: (error: unknown) => void;
}
export const usePostProduct = ({ onSuccess, onError }: usePostProductParams) => {
  return useMutation({
    mutationKey: ['post-product'],
    mutationFn: async (data: PostProductBody) => {
      try {
        const apiResult = await apiInstance
          .post('productServices/', {
            json: data,
          })
          .json<PostProductResponse>();
        onSuccess?.(apiResult);
        return apiResult;
      } catch (error) {
        onError?.(error);
      }
    },
  });
};

export interface PostProductBody {
  name:        string;
  prices:      number;
  description: string;
  imageURL:    string;
  categoryId:  string;
}

export interface PostProductResponse {
  id:          string;
  name:        string;
  prices:      number;
  description: string;
  imageURL:    string;
  categoryId:  string;
  createdAt:   string;
  updatedAt:   string;
}
