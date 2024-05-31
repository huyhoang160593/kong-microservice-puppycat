import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_layout/')({
  component: Dashboard,
});

function Dashboard() {
  return (
    <article className="card w-[97%] h-full bg-neutral text-neutral-content">
      <section className="card-body">
        <div className="flex justify-between">
          <h1 className="card-title">Trang chủ</h1>
        </div>
        <div className="divider" />
      </section>
    </article>
  );
}
