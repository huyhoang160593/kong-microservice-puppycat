import { PhEnvelopeSimpleDuotone } from '../components/svgs/PhEnvelopeSimpleDuotone';
import { PhPasswordDuotone } from '../components/svgs/PhPasswordDuotone';
import { cn } from '../misc/utils';

export default function LoginPage() {
  return (
    <main className={cn('flex items-center justify-center h-screen')}>
      <article className="card card-side bg-neutral shadow-xl">
        <figure>
          <img src="https://picsum.photos/200/280/" alt="random image" />
        </figure>
        <section className="card-body">
          <form>
            <fieldset className="flex flex-col gap-4">
              <legend className="text-xl font-bold mb-3">
                Login into dashboard
              </legend>
              <label className="input input-bordered flex items-center gap-2">
                <PhEnvelopeSimpleDuotone />
                <input
                  name="email"
                  type="text"
                  className="grow"
                  placeholder="Email"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <PhPasswordDuotone />
                <input
                  name="password"
                  type="password"
                  className="grow"
                  placeholder="Password"
                />
              </label>
            </fieldset>
            <fieldset className="flex mt-6">
              <button className="btn flex-grow">Login</button>
            </fieldset>
          </form>
        </section>
      </article>
    </main>
  );
}
