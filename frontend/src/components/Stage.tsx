import React from 'react'
import TaskBox from './TaskBox';

type Props = {
  stage: {
    name: string;
    id: number;
    sequence: number;
    tasks: {
      name: string;
      project_id: number;
      description: string | null;
      stage_id: number | null;
      id: number;
      sequence: number;
      priority: number;
      created_at: Date;
      updated_at: Date;
      active: boolean;
      deadline: Date | null;
      status: "APPROVED" | "IN_PROGRESS" | "CHANGE_REQUESTED" | "DONE";
    }[];
  }
}

export const Stage = ({stage}: Props) => {
  return (
    <div className="p-4 w-56 h-full shrink-0 flex flex-col gap-4 select-none">
        <div className='border border-gray-300 rounded-lg p-2 shadow-sm bg-white'>
        {stage.name}
        </div>
        {stage.tasks.map(task => (
          <TaskBox key={task.id} task={task} />
        ))}
    </div>
  )
}