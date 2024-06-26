import { USER_TOKEN } from '@/constants/localStorageKey';
import { PostLoginResponse } from '@/hooks/mutations/usePostLogin';
import { useGetUserById } from '@/hooks/queries/useGetUserById';
import { useLocalStorageValue } from '@react-hookz/web';
import {
  Link,
  Outlet,
  createFileRoute,
  useNavigate,
} from '@tanstack/react-router';
import { useEffect } from 'react';
import { Fragment } from 'react/jsx-runtime';

export const Route = createFileRoute('/_layout')({
  component: MainLayoutComponent,
});

function MainLayoutComponent() {
  const { value } = useLocalStorageValue<PostLoginResponse>(USER_TOKEN);
  const navigate = useNavigate();
  const { data: userData } = useGetUserById({
    id: value?.id,
    enabled: !!value?.id,
  });
  useEffect(() => {
    if (!value) {
      navigate({ to: '/authentication/login' });
    }
  }, [navigate, value]);
  return (
    <Fragment>
      <header className="navbar bg-base-100">
        <section className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">
            Admin Dashboard
          </Link>
        </section>
        <section className="flex-none gap-2">
          <div>{userData?.name}</div>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <picture>
                  <source srcSet={userData?.avatarUrl} />
                  <img alt="User Avatar" src="/Image_not_available.png" />
                </picture>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Hồ sơ
                  <span className="badge">Thay đổi</span>
                </Link>
              </li>
              <li>
                <Link to="/logout">Đăng xuất</Link>
              </li>
            </ul>
          </div>
        </section>
      </header>
      <main className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <section className="drawer-content flex flex-col items-center justify-center">
          {/* Page content here */}
          <Outlet />
        </section>
        <section className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            {/* Sidebar content here */}
            <li>
              <Link to="/product">Sản phẩm</Link>
            </li>
            <li>
              <Link to="/category">Danh mục</Link>
            </li>
          </ul>
        </section>
      </main>
    </Fragment>
  );
}
