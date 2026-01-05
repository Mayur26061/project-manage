import { Outlet, createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import axios from 'axios'
export const Route = createFileRoute('/_pathlessLayout/projects/')({
  component: ProjectsComponent,
})

function ProjectsComponent() {
  useEffect(() => {
    axios.get('/api/project/projects')
  }, [])
  return (
    <>
    <div className="h-screen flex flex-col items-center justify-center bg-white border-gray-300 border">
    <Outlet />
    </div>
    </>
  )
}
