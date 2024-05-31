import { apiInstance } from '@/config/ky';
import { useQuery } from '@tanstack/react-query';

interface useGetUserByIdParams {
  id?: string;
  enabled: boolean;
  onSuccess?: (data: User) => void;
  onError?: (error: unknown) => void;
}

export const useGetUserById = ({
  id,
  enabled,
  onSuccess,
  onError,
}: useGetUserByIdParams) => {
  return useQuery({
    queryKey: ['get-user', id],
    enabled,
    queryFn: async () => {
      try {
        const apiResult = await apiInstance
          .get(`userServices/${id}`)
          .json<User>();
        onSuccess?.(apiResult);
        return apiResult;
      } catch (error) {
        onError?.(error);
      }
    },
  });
};

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}
