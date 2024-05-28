import { createLazyFileRoute } from '@tanstack/react-router';
import { useCallback, useRef } from 'react';

export const Route = createLazyFileRoute('/_layout/product')({
  component: Product,
});

function Product() {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const onOpenModal = useCallback(() => {
    if (!dialogRef.current) return;
    dialogRef.current.showModal();
  }, []);
  return (
    <article className="card w-[97%] h-full bg-neutral text-neutral-content">
      <section className="card-body">
        <div className="flex justify-between">
          <h1 className="card-title">Danh sách sản phẩm</h1>
          <button className="btn btn-primary" onClick={onOpenModal}>
            Thêm sản phẩm
          </button>
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
          <h3 className="font-bold text-lg">Thêm sản phẩm</h3>
          <section className="divider"></section>
          <form>
            <fieldset>
              <label className="input input-bordered flex items-center gap-2">
                Tên sản phẩm
                <input
                  type="text"
                  className="grow"
                  placeholder="Tên mong muốn"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <input
                  type="number"
                  step={500}
                  className="grow"
                  placeholder="Giá bán ra"
                />
                <span>VNĐ</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Miêu tả sản phẩm"
              ></textarea>
            </fieldset>
          </form>
        </article>
      </dialog>
    </article>
  );
}
