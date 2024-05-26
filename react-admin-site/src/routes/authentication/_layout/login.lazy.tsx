import { PhEnvelopeSimpleDuotone } from '@/components/svgs/PhEnvelopeSimpleDuotone';
import { PhPasswordDuotone } from '@/components/svgs/PhPasswordDuotone';
import { USER_TOKEN } from '@/constants/localStorageKey';
import {
  PostLoginResponse,
  usePostLogin,
} from '@/hooks/mutations/usePostLogin';
import { generateCustomEvent } from '@/misc/utils';
import { useLocalStorageValue } from '@react-hookz/web';
import { createLazyFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

export const Route = createLazyFileRoute('/authentication/_layout/login')({
  component: Login,
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
function Login() {
  const { set } = useLocalStorageValue<PostLoginResponse>(USER_TOKEN);
  const { mutate: login } = usePostLogin({
    onSuccess(data) {
      set(data);
      document.dispatchEvent(
        generateCustomEvent('displayalert', {
          message: 'Login Successful! Redirecting to dashboard...',
          type: 'success',
        })
      );
    },
    onError() {
      document.dispatchEvent(
        generateCustomEvent('displayalert', {
          message: 'Email or password is incorrect. Please try again...',
          type: 'error',
        })
      );
    },
  });
  const handleLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formObject = Object.fromEntries(formData.entries());
    const safeParseResult = LoginSchema.safeParse(formObject);
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
    login(safeParseResult.data);
  };
  return (
    <form onSubmit={handleLoginSubmit}>
      <fieldset className="flex flex-col gap-4">
        <legend className="text-xl font-bold mb-3">Login into dashboard</legend>
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
  );
}
