import { apiInstance } from "@/config/ky";
import { ONE_MONTH_EXPIRATION } from "@/constants/common";
import { useMutation } from "@tanstack/react-query";

interface usePostLoginParams {
  onSuccess?: (data: PostImageResponse) => void;
  onError?: (error: unknown) => void;
}
export const usePostImage = ({ onSuccess, onError }: usePostLoginParams) => {
  return useMutation({
    mutationKey: ['post-image'],
    mutationFn: async (data: PostImageBody) => {
      const formData = new FormData();
      formData.append('key', data.key)
      formData.append('image', data.image);
      formData.append('expiration', data.expiration?.toString() ?? ONE_MONTH_EXPIRATION.toString());
      try {
        const apiResult = await apiInstance
          .post('https://api.imgbb.com/1/upload', {
            prefixUrl: '',
            body: formData
          })
          .json<PostImageResponse>();
        onSuccess?.(apiResult);
        return apiResult;
      } catch (error) {
        onError?.(error);
      }
    },
  });
};

interface PostImageBody {
  key: string,
  image: File;
  expiration?: number;
}

export interface PostImageResponse {
  data:    Data;
  success: boolean;
  status:  number;
}

export interface Data {
  id:          string;
  title:       string;
  url_viewer:  string;
  url:         string;
  display_url: string;
  width:       string;
  height:      string;
  size:        string;
  time:        string;
  expiration:  string;
  image:       Image;
  thumb:       Image;
  medium:      Image;
  delete_url:  string;
}

export interface Image {
  filename:  string;
  name:      string;
  mime:      string;
  extension: string;
  url:       string;
}
