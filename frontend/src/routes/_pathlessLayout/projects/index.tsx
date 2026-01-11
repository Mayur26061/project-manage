import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import axios from 'axios'
export const Route = createFileRoute('/_pathlessLayout/projects/')({
  component: ProjectsComponent,
})
interface Project {
    id: number;
    created_at: Date;
    updated_at: Date;
    active: boolean;
    name: string;
    description: string | null;
    owner_id: number;
}

function ProjectsComponent() {
  const [projects, setProjects] = useState<Project[]>([])
  useEffect(() => {
    axios.get('/api/project/projects')
      .then(response => setProjects(response.data))
  }, [])
  return (
    <>
    <div className="h-screen flex flex-wrap bg-white border-gray-300 border gap-1 p-3 content-start">
      {projects.map(project => (
          <Link key={project.id} to={`/projects/$projectId/tasks`}
          params={{
            projectId: String(project.id)
          }}>
        <div className="p-4 m-2 border rounded shadow w-96 h-48">
          <h2 className="text-xl font-bold mb-2">{project.name}</h2>
          <p className="text-gray-600 text-ellipsis line-clamp-4">{project.description} ds afas as afsf asfasfasfas Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente nihil repellendus delectus necessitatibus amet facilis aspernatur labore rem in? Natus voluptate mollitia dolorem illo reprehenderit iste, veritatis suscipit culpa aliquid! Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam ullam deleniti dolores omnis animi voluptas eius debitis inventore sint quos! Omnis libero velit tempora obcaecati in. Assumenda dolores soluta magnam.</p>
          <div>{project.owner_id}</div>
          </div>
          </Link>
          ))
    }    
    <Outlet />
    </div>
    </>
  )
}
