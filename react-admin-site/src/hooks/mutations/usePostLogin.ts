import { apiInstance } from '@/config/ky';
import { useMutation } from '@tanstack/react-query';

interface usePostLoginParams {
  onSuccess?: (data: PostLoginResponse) => void;
  onError?: (error: unknown) => void;
}
export const usePostLogin = ({ onSuccess, onError }: usePostLoginParams) => {
  return useMutation({
    mutationKey: ['post-login'],
    mutationFn: async (data: PostLoginBody) => {
      try {
        const apiResult = await apiInstance
          .post('userServices/login', {
            json: data,
          })
          .json<PostLoginResponse>();
        onSuccess?.(apiResult);
        return apiResult;
      } catch (error) {
        onError?.(error);
      }
    },
  });
};

interface PostLoginBody {
  email: string;
  password: string;
}

export interface PostLoginResponse {
  token: string;
  email: string;
  name: string;
  id: string;
}
