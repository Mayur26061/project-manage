import { createFileRoute, Outlet } from '@tanstack/react-router'
import DashboardWrapper from '../components/DashBoardWrapper'

export const Route = createFileRoute('/_pathlessLayout')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <DashboardWrapper>
      <Outlet />
    </DashboardWrapper>
  </div>
}
