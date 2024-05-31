import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_layout/')({
  component: Dashboard,
});

function Dashboard() {
  const navigation = useNavigate();
  return (
    <article className="card w-[97%] h-full bg-transparent text-neutral-content">
      <section className="card-body">
        <div
          className="hero min-h-screen"
          style={{
            backgroundImage: 'url(https://picsum.photos/seed/puppycat/600/900)',
          }}
        >
          <div className="hero-overlay bg-opacity-60"></div>
          <div className="hero-content text-center text-neutral-content">
            <div className="max-w-md">
              <h1 className="mb-5 text-5xl font-bold">Xin chào</h1>
              <p className="mb-5">
                Đây là một website dashboard nho nhỏ để quản lý Cửa hàng. Bắt
                đầu quản lý ngay
              </p>
              <button
                onClick={() => navigation({ to: '/product' })}
                className="btn btn-primary"
              >
                Bắt đầu
              </button>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
