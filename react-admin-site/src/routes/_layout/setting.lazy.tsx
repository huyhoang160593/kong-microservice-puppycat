import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_layout/setting')({
  component: () => <div>Hello /_layout/setting!</div>
})