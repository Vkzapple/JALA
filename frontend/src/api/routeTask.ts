

export interface TaskProps {
    order: number
    text: string
    status: string
}

import tasksData from "../data/tasks.json"

export const getTasks = () => {
    const tasks:TaskProps[] = tasksData as TaskProps[]
    return tasks
}
export const getTask = (order:number) => {
    const tasks:TaskProps[] = tasksData as TaskProps[]
    return tasks[order - 1]
}
export const editTask = (order:number, status:string) => {
    const tasks:TaskProps[] = tasksData as TaskProps[]
    const task = tasks[order - 1]
    task.status = status
    return task
}