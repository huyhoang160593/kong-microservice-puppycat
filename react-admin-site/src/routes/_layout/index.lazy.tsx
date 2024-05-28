import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_layout/')({
  component: () => <div>Hello /_layout/!</div>
})