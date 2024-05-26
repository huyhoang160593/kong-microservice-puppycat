import { cn } from '@/misc/utils';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/authentication/_layout')({
  component: AuthLayoutComponent,
});

function AuthLayoutComponent() {
  return (
    <main className={cn('flex items-center justify-center h-screen')}>
      <article className="card card-side bg-neutral shadow-xl">
        <figure>
          <img src="https://picsum.photos/200/280/" alt="random image" />
        </figure>
        <section className="card-body">
          <Outlet />
        </section>
      </article>
    </main>
  );
}
