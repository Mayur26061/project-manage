import { Outlet, createFileRoute, useParams } from '@tanstack/react-router'
import axios from 'axios'
import { useEffect, useState } from 'react'
export const Route = createFileRoute('/_pathlessLayout/tasks/$taskId')({
  component: TaskComponent,
})
function TaskComponent() {
   const params = useParams({ from: '/_pathlessLayout/tasks/$taskId' })
   const [data, setData] = useState(null)
  useEffect(() => {
    axios.get(`/api/task/${params.taskId}`).then((response) => {
      setData(response.data)
    })
  }, [])
    return <div>
        {JSON.stringify(data)}

      <Outlet />
    </div>
}