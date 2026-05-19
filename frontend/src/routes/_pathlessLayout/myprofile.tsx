import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/lib/useAuth'

export const Route = createFileRoute('/_pathlessLayout/myprofile')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user, logOut } = useAuth();

  return (
    <div style={{maxWidth: 720, margin: '24px auto', fontFamily: 'Inter, Arial'}}>
        {/* <div>Hello, {user?.user?.first_name || 'User'}!</div> */}
        <div className="rounded-full p-3 border-gray-300 bg-gray-200 text-gray-600 w-24 h-24 flex items-center justify-center text-4xl">
        {user?.user?.first_name?.[0].toUpperCase() || 'U'}
      </div>
    </div>
  )
}
