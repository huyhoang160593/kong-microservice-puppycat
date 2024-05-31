import { apiInstance } from "@/config/ky";
import { useMutation } from "@tanstack/react-query";

interface usePutParams {
  onSuccess?: (data: User) => void;
  onError?: (error: unknown) => void;
}
export const usePutUser = ({ onSuccess, onError }: usePutParams) => {
  return useMutation({
    mutationKey: ['put-user'],
    mutationFn: async ({ id, ...data }: PutUserVariables) => {
      try {
        const apiResult = await apiInstance
          .put(`userServices/${id}`, {
            json: data,
          })
          .json<User>();
        onSuccess?.(apiResult);
        return apiResult;
      } catch (error) {
        onError?.(error);
      }
    },
  });
};

interface PutUserVariables {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}