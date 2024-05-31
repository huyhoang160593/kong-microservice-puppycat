import { useDeleteProduct } from '@/hooks/mutations/useDeleteProduct';
import { usePostImage } from '@/hooks/mutations/usePostImage';
import { usePostProduct } from '@/hooks/mutations/usePostProduct';
import { usePutProduct } from '@/hooks/mutations/usePutProduct';
import { useGetCategory } from '@/hooks/queries/useGetCategory';
import { Product, useGetProduct } from '@/hooks/queries/useGetProduct';
import { cn, generateCustomEvent } from '@/misc/utils';
import { createLazyFileRoute } from '@tanstack/react-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { z } from 'zod';

export const Route = createLazyFileRoute('/_layout/product')({
  component: ProductPage,
});

const ProductSchema = z.object({
  name: z.string(),
  prices: z.coerce.number().int(),
  description: z.string(),
  categoryId: z.string().uuid(),
  imageFile: z.custom<File>((data): data is File => data instanceof File),
});
function ProductPage() {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [dialogMode, setDialogMode] = useState<'new' | 'edit' | 'detail'>(
    'new'
  );

  const { data: categories } = useGetCategory({});
  const { data: products, refetch } = useGetProduct({});

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

  const { mutate: postProduct } = usePostProduct({
    onSuccess() {
      document.dispatchEvent(
        generateCustomEvent('displayalert', {
          message: 'Tạo sản phẩm thành công',
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

  const { mutate: putProduct } = usePutProduct({
    onSuccess() {
      document.dispatchEvent(
        generateCustomEvent('displayalert', {
          message: 'Cập nhật sản phẩm thành công',
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
          message: 'Có vấn đề xảy ra khi cập nhật sản phẩm',
          type: 'error',
        })
      );
    },
  });

  const { mutate: deleteProduct } = useDeleteProduct({
    onSuccess() {
      document.dispatchEvent(
        generateCustomEvent('displayalert', {
          message: 'Xóa sản phẩm thành công',
          type: 'success',
        })
      );
      refetch();
    },
    onError() {
      document.dispatchEvent(
        generateCustomEvent('displayalert', {
          message: 'Có vấn đề xảy ra khi xóa sản phẩm',
          type: 'error',
        })
      );
    },
  });

  const categoriesOptions = useMemo(() => {
    if (!categories) return [];
    return categories.map((category) => ({
      label: category.name,
      value: category.id,
    }));
  }, [categories]);

  const imageUrl = useMemo(() => {
    if (!imageFile) {
      if (!selectedProduct) return '';
      return selectedProduct.imageURL;
    }
    return URL.createObjectURL(imageFile);
  }, [imageFile, selectedProduct]);

  const dialogTitle = useMemo(() => {
    if (dialogMode === 'new') return 'Thêm sản phẩm';
    if (dialogMode === 'edit') return 'Cập nhật sản phẩm';
    if (dialogMode === 'detail') return 'Chi tiết sản phẩm';
  }, [dialogMode]);
  const dialogConfirmButtonText = useMemo(() => {
    if (dialogMode === 'new') return 'Tạo';
    if (dialogMode === 'edit') return 'Cập nhật';
    if (dialogMode === 'detail') return 'Đóng';
  }, [dialogMode]);
  const formNames = useMemo(() => ProductSchema.keyof().Enum, []);

  const onNewModalOpen = useCallback(() => {
    setDialogMode('new');
    setSelectedProduct(null);
    if (!dialogRef.current) return;
    if (!formRef.current) return;
    formRef.current.reset();
    dialogRef.current.showModal();
  }, []);

  const setFormValues = useCallback(
    (selectedProduct: Product) => {
      if (!formRef.current) return;
      const { current: formElement } = formRef;
      (formElement[formNames.name] as unknown as HTMLInputElement).value =
        selectedProduct.name;
      (formElement[formNames.prices] as unknown as HTMLInputElement).value =
        selectedProduct.prices.toString();
      (
        formElement[formNames.description] as unknown as HTMLTextAreaElement
      ).value = selectedProduct.description;
      (
        formElement[formNames.categoryId] as unknown as HTMLSelectElement
      ).value = selectedProduct.categoryId;
    },
    [
      formNames.categoryId,
      formNames.description,
      formNames.name,
      formNames.prices,
    ]
  );

  const onDetailModalOpen = useCallback(
    (newSelectedProduct: Product) => {
      setSelectedProduct(newSelectedProduct);
      setDialogMode('detail');
      if (!dialogRef.current) return;
      dialogRef.current.showModal();
      setFormValues(newSelectedProduct);
    },
    [setFormValues]
  );

  const onEditModalOpen = useCallback(
    (newSelectedProduct: Product) => {
      setSelectedProduct(newSelectedProduct);
      setDialogMode('edit');
      if (!dialogRef.current) return;
      dialogRef.current.showModal();
      setFormValues(newSelectedProduct);
    },
    [setFormValues]
  );

  const onSubmitForm = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (dialogMode === 'detail') {
        if (!dialogRef.current) return;
        dialogRef.current.close();
        return;
      }
      const formData = new FormData(event.currentTarget);
      const formObject = Object.fromEntries(formData.entries());
      event.currentTarget.reset();
      const safeParseResult = ProductSchema.safeParse(formObject);
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
      const {
        name,
        prices,
        description,
        imageFile: imageFileFromForm,
        categoryId,
      } = safeParseResult.data;
      if (dialogMode === 'new') {
        const apiResult = await postImageAsync({
          image: imageFileFromForm,
          key: import.meta.env.VITE_IMGBB_API_KEY,
        });
        if (!apiResult?.data.url) return;
        postProduct({
          name,
          prices,
          description,
          categoryId,
          imageURL: apiResult?.data.url,
        });
      }
      if (dialogMode === 'edit') {
        if (!selectedProduct) return;
        if (!imageFileFromForm.name) {
          putProduct({
            id: selectedProduct.id,
            name,
            prices,
            description,
            categoryId,
            imageURL: selectedProduct.imageURL,
          });
          return;
        }
        const apiResult = await postImageAsync({
          image: imageFileFromForm,
          key: import.meta.env.VITE_IMGBB_API_KEY,
        });
        if (!apiResult?.data.url) return;
        putProduct({
          id: selectedProduct.id,
          name,
          prices,
          description,
          categoryId,
          imageURL: apiResult?.data.url,
        });
      }
    },
    [dialogMode, postImageAsync, postProduct, putProduct, selectedProduct]
  );

  return (
    <article className="card w-[97%] h-full bg-neutral text-neutral-content">
      <section className="card-body">
        <div className="flex justify-between">
          <h1 className="card-title">Danh sách sản phẩm</h1>
          <button className="btn btn-primary" onClick={onNewModalOpen}>
            Thêm sản phẩm
          </button>
        </div>
        <div className="divider" />
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Giá(VND)</th>
                <th>Danh mục</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product) => (
                <tr key={product.id}>
                  <th>
                    <div className="avatar">
                      <picture className="mask mask-hexagon-2 w-16 h-16">
                        <source srcSet={product.imageURL} />
                        <img
                          src="/Image_not_available.png"
                          alt="Category Avatar"
                        />
                      </picture>
                    </div>
                  </th>
                  <td>{product.name}</td>
                  <td>{product.prices}</td>
                  <td>{product.category.name}</td>
                  <td>
                    <section className="flex gap-4 justify-end">
                      <button
                        onClick={() => onDetailModalOpen(product)}
                        className="btn btn-info btn-xs"
                      >
                        chi tiết
                      </button>
                      <button
                        onClick={() => onEditModalOpen(product)}
                        className="btn btn-secondary btn-xs"
                      >
                        sửa
                      </button>
                      <button
                        onClick={() => deleteProduct({ id: product.id })}
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
          <form
            ref={formRef}
            className="overflow-auto max-h-[70vh]"
            onSubmit={onSubmitForm}
          >
            <fieldset className="flex flex-col gap-4">
              <label className="input input-bordered flex items-center gap-2">
                Tên sản phẩm
                <input
                  name={formNames.name}
                  disabled={dialogMode === 'detail'}
                  type="text"
                  className="grow"
                  placeholder="Tên mong muốn"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <input
                  name={formNames.prices}
                  disabled={dialogMode === 'detail'}
                  type="number"
                  step={500}
                  className="grow"
                  placeholder="Giá bán ra"
                />
                <span>VNĐ</span>
              </label>
              <textarea
                name={formNames.description}
                disabled={dialogMode === 'detail'}
                className="textarea textarea-bordered w-full"
                placeholder="Miêu tả sản phẩm"
              ></textarea>
              <select
                defaultValue=""
                name={formNames.categoryId}
                disabled={dialogMode === 'detail'}
                className="select select-bordered w-full max-w-xs"
              >
                <option disabled value="">
                  Category
                </option>
                {categoriesOptions.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              <label>
                <input
                  ref={fileInputRef}
                  name={formNames.imageFile}
                  type="file"
                  accept="image/*"
                  hidden={dialogMode === 'detail'}
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
              <button
                type="submit"
                className={cn('btn', {
                  'btn-primary': dialogMode === 'new',
                  'btn-secondary': dialogMode === 'edit',
                  'btn-error': dialogMode === 'detail'
                })}
              >
                {dialogConfirmButtonText}
              </button>
            </fieldset>
          </form>
        </article>
      </dialog>
    </article>
  );
}
