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
          message: 'Đăng nhập thành công! Chuyển hướng về màn hình chính ',
          type: 'success',
        })
      );
    },
    onError() {
      document.dispatchEvent(
        generateCustomEvent('displayalert', {
          message: 'Sai tài khoản hoặc mật khẩu, vui lòng kiểm tra lại',
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
    <form onSubmit={handleLoginSubmit} className="flex flex-col justify-center h-full">
      <fieldset className="flex flex-col gap-4">
        <legend className="text-xl font-bold mb-10 uppercase">
          Đăng nhập vào giao diện Dashboard
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
            placeholder="Mật khẩu"
          />
        </label>
      </fieldset>
      <fieldset className="flex mt-6">
        <button className="btn flex-grow">Đăng nhập</button>
      </fieldset>
    </form>
  );
}
