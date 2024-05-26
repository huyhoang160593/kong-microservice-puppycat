import { AlertNotification } from '@/components/common/AlertNotification'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <AlertNotification />
      <TanStackRouterDevtools />
    </>
  ),
})