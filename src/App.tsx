import { RouterProvider } from 'react-router-dom'
import { router } from '@/routes/router'
import { NotificationProvider } from '@/components/shared/NotificationProvider'

export function App() {
  return (
    <>
      <RouterProvider router={router} />
      <NotificationProvider />
    </>
  )
}
