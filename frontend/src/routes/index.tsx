import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
    loader: () => {
        return redirect({
            to: '/projects',
        })
    },
  component: RootComponent,
})
function RootComponent() {

  return (
    <>
    <div>
        <Outlet />
    </div>
    </>
  )
}

