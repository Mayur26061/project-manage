import { Outlet, createFileRoute, useParams } from '@tanstack/react-router'
import axios from 'axios';
import { useEffect, useState } from 'react';
export const Route = createFileRoute('/_pathlessLayout/projects/$projectId/')({
  component: ProjectComponent,
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

function ProjectComponent() {
    const [project, setProject] = useState<Project | null>(null)
    const params = useParams({ from: '/_pathlessLayout/projects/$projectId/' })
  useEffect(() => {
    axios.get(`/api/project/${params.projectId}`)
      .then(response => setProject(response.data))
  }, [params.projectId])
    return <div>
        {project && JSON.stringify(project)}
      <Outlet />
    </div>
}