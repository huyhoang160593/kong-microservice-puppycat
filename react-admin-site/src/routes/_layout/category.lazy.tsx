import { useDeleteCategory } from '@/hooks/mutations/useDeleteCategory';
import { usePostCategory } from '@/hooks/mutations/usePostCategory';
import { usePostImage } from '@/hooks/mutations/usePostImage';
import { usePutCategory } from '@/hooks/mutations/usePutCategory';
import { type Category, useGetCategory } from '@/hooks/queries/useGetCategory';
import { generateCustomEvent } from '@/misc/utils';
import { createLazyFileRoute } from '@tanstack/react-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { z } from 'zod';

export const Route = createLazyFileRoute('/_layout/category')({
  component: Category,
});

const CategorySchema = z.object({
  name: z.string(),
  imageFile: z.custom<File>((data): data is File => data instanceof File),
});
function Category() {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [dialogMode, setDialogMode] = useState<'new' | 'edit'>('new');

  const { data: categories, refetch } = useGetCategory({});

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

  const { mutate: postCategory } = usePostCategory({
    onSuccess() {
      document.dispatchEvent(
        generateCustomEvent('displayalert', {
          message: 'Tạo danh mục thành công',
          type: 'success',
        })
      );
      if (!dialogRef.current) return;
      dialogRef.current.close();
      setImageFile(null);
      refetch();
    },
    onError() {
      document.dispatchEvent(
        generateCustomEvent('displayalert', {
          message: 'Có vấn đề xảy ra khi tạo danh mục',
          type: 'error',
        })
      );
    },
  });

  const { mutate: putCategory } = usePutCategory({
    onSuccess() {
      document.dispatchEvent(
        generateCustomEvent('displayalert', {
          message: 'Cập nhật danh mục thành công',
          type: 'success',
        })
      );
      if (!dialogRef.current) return;
      if (!fileInputRef.current) return;
      dialogRef.current.close();
      setImageFile(null);
      setSelectedCategory(null);
      refetch();
    },
    onError() {
      document.dispatchEvent(
        generateCustomEvent('displayalert', {
          message: 'Có vấn đề xảy ra khi cập nhật danh mục',
          type: 'error',
        })
      );
    },
  });

  const { mutate: deleteCategory } = useDeleteCategory({
    onSuccess() {
      document.dispatchEvent(
        generateCustomEvent('displayalert', {
          message: 'Xóa danh mục thành công',
          type: 'success',
        })
      );
      refetch();
    },
    onError() {
      document.dispatchEvent(
        generateCustomEvent('displayalert', {
          message: 'Có vấn đề xảy ra khi xóa danh mục',
          type: 'error',
        })
      );
    },
  });

  const imageUrl = useMemo(() => {
    if (!imageFile) {
      if (!selectedCategory) return '';
      return selectedCategory.imageURL;
    }
    return URL.createObjectURL(imageFile);
  }, [imageFile, selectedCategory]);

  const dialogTitle = useMemo(() => {
    if (dialogMode === 'new') return 'Thêm danh mục';
    if (dialogMode === 'edit') return 'Cập nhật danh mục';
  }, [dialogMode]);
  const dialogConfirmButtonText = useMemo(() => {
    if (dialogMode === 'new') return 'Tạo';
    if (dialogMode === 'edit') return 'Cập nhật';
  }, [dialogMode]);

  const onEditModalOpen = useCallback((newSelectedCategory: Category) => {
    setSelectedCategory(newSelectedCategory);
    setDialogMode('edit');
    if (!dialogRef.current) return;
    dialogRef.current.showModal();
    if (!formRef.current) return;
    (formRef.current.name as unknown as HTMLInputElement).value = newSelectedCategory.name
  }, []);

  const onNewModalOpen = useCallback(() => {
    setDialogMode('new');
    setSelectedCategory(null);
    if (!dialogRef.current) return;
    if (!formRef.current) return;
    formRef.current.reset();
    dialogRef.current.showModal();
  }, []);

  const onSubmitForm = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const formObject = Object.fromEntries(formData.entries());
      event.currentTarget.reset();
      const safeParseResult = CategorySchema.safeParse(formObject);
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
      if (dialogMode === 'new') {
        const apiResult = await postImageAsync({
          image: imageFileFromForm,
          key: import.meta.env.VITE_IMGBB_API_KEY,
        });
        if (!apiResult?.data.url) return;
        postCategory({
          name,
          imageURL: apiResult?.data.url,
        });
      }
      if (dialogMode === 'edit') {
        if (!selectedCategory) return;
        if (!imageFileFromForm.name) {
          putCategory({
            id: selectedCategory.id,
            name,
            imageURL: selectedCategory.imageURL,
          });
          return;
        }
        const apiResult = await postImageAsync({
          image: imageFileFromForm,
          key: import.meta.env.VITE_IMGBB_API_KEY,
        });
        if (!apiResult?.data.url) return;
        putCategory({
          id: selectedCategory.id,
          name,
          imageURL: apiResult?.data.url,
        });
      }
    },
    [dialogMode, postCategory, postImageAsync, putCategory, selectedCategory]
  );
  return (
    <article className="card w-[97%] h-full bg-neutral text-neutral-content">
      <section className="card-body">
        <div className="flex justify-between">
          <h1 className="card-title">Danh sách danh mục</h1>
          <button className="btn btn-primary" onClick={onNewModalOpen}>
            Thêm danh mục
          </button>
        </div>
        <div className="divider" />
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên danh mục</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories?.map((category) => (
                <tr key={category.id}>
                  <th>
                    <div className="avatar">
                      <picture className="mask mask-squircle w-12 h-12">
                        <source srcSet={category.imageURL} />
                        <img
                          src="/Image_not_available.png"
                          alt="Category Avatar"
                        />
                      </picture>
                    </div>
                  </th>
                  <td>{category.name}</td>
                  <td>
                    <section className="flex gap-4 justify-end">
                      {/* <button className="btn btn-info btn-xs">chi tiết</button> */}
                      <button
                        onClick={() => onEditModalOpen(category)}
                        className="btn btn-secondary btn-xs"
                      >
                        sửa
                      </button>
                      <button
                        onClick={() => deleteCategory({ id: category.id })}
                        className="btn btn-error btn-xs"
                      >
                        xóa
                      </button>
                    </section>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* foot */}
            <tfoot>
              <tr>
                <th>Ảnh</th>
                <th>Tên Danh Mục</th>
                <th></th>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
      <dialog ref={dialogRef} className="modal">
        <article className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-6">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">{dialogTitle}</h3>
          <section className="divider"></section>
          <form ref={formRef} onSubmit={onSubmitForm}>
            <fieldset className="flex flex-col gap-4">
              <label className="input input-bordered flex items-center gap-2">
                <span className="font-bold">Tên danh mục</span>
                <input
                  name="name"
                  type="text"
                  className="grow"
                  placeholder="Tên mong muốn"
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
                {dialogConfirmButtonText}
              </button>
            </fieldset>
          </form>
        </article>
      </dialog>
    </article>
  );
}
