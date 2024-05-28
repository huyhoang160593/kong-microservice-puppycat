import { USER_TOKEN } from '@/constants/localStorageKey';
import { PostLoginResponse } from '@/hooks/mutations/usePostLogin';
import { useLocalStorageValue } from '@react-hookz/web';
import { createLazyFileRoute } from '@tanstack/react-router';
import { useCallback } from 'react';

export const Route = createLazyFileRoute('/_layout/logout')({
  component: Logout,
});

function Logout() {
  const { remove } = useLocalStorageValue<PostLoginResponse>(USER_TOKEN);
  const onLogoutHandle = useCallback(() => {
    remove();
  }, [remove])
  return (
    <article className="card w-96 bg-base-300 shadow-xl">
      <figure>
        <img src="https://picsum.photos/seed/picsum/390/220" alt="Shoes" />
      </figure>
      <section className="card-body">
        <h2 className="card-title">
          Đăng xuất
          <div className="badge badge-warning">CÂN NHẮC</div>
        </h2>
        <p>Một khi đã đăng xuất thì bạn sẽ phải đăng nhập lại từ đầu?</p>
      </section>
      <section className="card-actions justify-end p-6">
        <button onClick={onLogoutHandle} className="btn btn-error">Xác nhận</button>
      </section>
    </article>
  );
}
