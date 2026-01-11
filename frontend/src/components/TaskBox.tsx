import React from 'react'

type Props = {
    id: number;
    sequence: number;
    priority: number;
    name: string;
    description: null;
    created_at: string;
    updated_at: string;
    active: boolean;
    stage_id: number;
    project_id: number;
    deadline: null;
    status: string;
}

const TaskBox = (props: Props) => {
  return (
    <div>{props.name}</div>
  )
}

export default TaskBox