import { USER_TOKEN } from '@/constants/localStorageKey';
import { usePostImage } from '@/hooks/mutations/usePostImage';
import { PostLoginResponse } from '@/hooks/mutations/usePostLogin';
import { usePutUser } from '@/hooks/mutations/usePutUser';
import { useGetUserById } from '@/hooks/queries/useGetUserById';
import { generateCustomEvent } from '@/misc/utils';
import { useLocalStorageValue } from '@react-hookz/web';
import { createLazyFileRoute } from '@tanstack/react-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { z } from 'zod';

export const Route = createLazyFileRoute('/_layout/profile')({
  component: ProfilePage,
});

const UserUpdateSchema = z.object({
  name: z.string(),
  imageFile: z.custom<File>((data): data is File => data instanceof File),
});
function ProfilePage() {
  const { value } = useLocalStorageValue<PostLoginResponse>(USER_TOKEN);
  const { data: userData, refetch } = useGetUserById({
    id: value?.id,
    enabled: !!value?.id,
  });

  const formRef = useRef<HTMLFormElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);

  const { mutate: putUser } = usePutUser({
    onSuccess: () => {
      refetch();
    },
    onError: () => {
      document.dispatchEvent(
        generateCustomEvent('displayalert', {
          message: 'Có vấn đề xảy ra khi cập nhật thông tin người dùng',
          type: 'error',
        })
      );
    },
  });

  const { mutateAsync: postImageAsync } = usePostImage({
    onSuccess() {},
    onError() {
      document.dispatchEvent(
        generateCustomEvent('displayalert', {
          message: 'Có vấn đề xảy ra khi upload file',
          type: 'error',
        })
      );
    },
  });

  const imageUrl = useMemo(() => {
    if (!imageFile) {
      if (!userData) return '';
      return userData.avatarUrl;
    }
    return URL.createObjectURL(imageFile);
  }, [imageFile, userData]);

  const onSubmitForm = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if(!userData) {
      document.dispatchEvent(
        generateCustomEvent('displayalert', {
          message: 'Không có dữ liệu user cần thiết để cập nhật',
          type: 'error',
        })
      );
        return
      }
      const formData = new FormData(event.currentTarget);
      const formObject = Object.fromEntries(formData.entries());
      event.currentTarget.reset();
      const safeParseResult = UserUpdateSchema.safeParse(formObject);
      if (!safeParseResult.success) {
        safeParseResult.error.issues.forEach((issue) => {
          document.dispatchEvent(
            generateCustomEvent('displayalert', {
              message: issue.message,
              type: 'error',
            })
          );
        });
        return;
      }
      const { name, imageFile: imageFileFromForm } = safeParseResult.data;
      if (!imageFileFromForm.name) {
        putUser({
          id: userData.id,
          name,
          avatarUrl: userData.avatarUrl,
        });
        return;
      }
      const apiResult = await postImageAsync({
        image: imageFileFromForm,
        key: import.meta.env.VITE_IMGBB_API_KEY,
      });
      if (!apiResult?.data.url) return;
      putUser({
        id: userData.id,
        name,
        avatarUrl: apiResult?.data.url,
      });
    },
    [postImageAsync, putUser, userData]
  );
  return (
    <article className="card w-[97%] h-full bg-neutral text-neutral-content">
      <section className="card-body">
        <div className="flex justify-between">
          <h1 className="card-title">Thay đổi thông tin cá nhân</h1>
        </div>
        <div className="divider" />

        <form ref={formRef} onSubmit={onSubmitForm}>
          <fieldset className="flex flex-col gap-4">
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-bold">Tên người dùng</span>
              <input
                name="name"
                type="text"
                className="grow"
                placeholder="Nhập tên vào đây"
              />
            </label>
            <label>
              <input
                ref={fileInputRef}
                name="imageFile"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  if (!event.target.files) return;
                  setImageFile(event.target.files[0]);
                }}
                className="file-input file-input-bordered file-input-accent w-full max-w-xs"
              />
            </label>
            <picture>
              <source srcSet={imageUrl}></source>
              <img
                onClick={() => {
                  setImageFile(null);
                  if (!fileInputRef.current) return;
                  fileInputRef.current.value = '';
                }}
                src="/Image_not_available.png"
                alt="preview-image"
                className="w-[320px] h-[180px] object-contain"
              />
            </picture>
          </fieldset>
          <fieldset className="card-actions justify-end">
            <button type="submit" className="btn btn-primary">
              Thay đổi
            </button>
          </fieldset>
        </form>
      </section>
    </article>
  );
}
