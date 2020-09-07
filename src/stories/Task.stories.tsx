import React from 'react'
import {action} from '@storybook/addon-actions'
import {Task} from '../todolist/Task'

export default {
    title: 'Task Stories',
    component: Task
}

const removeCallback = action('Remove Button inside Task clicked');
const changeStatusCallback = action('Status changed inside Task');
const changeTitleCallback = action('Title changed inside Task');

export const TaskBaseExample = (props: any) => {
    const tasks = [
        {
            id: '2', status: 0, title: 'JS', description: '', startDate: '',
            priority: 1, order: 0, deadline: '', addedDate: '',
            completed: false, todoListId: '1'
        },
        {
            id: '1', status: 0, title: 'TS', description: '', startDate: '',
            priority: 1, order: 0, deadline: '', addedDate: '',
            completed: false, todoListId: '2'
        }
    ]
    return (
        <div>
            <Task
                task={tasks[0]}
                removeTask={removeCallback}
                changeTaskTitle={changeTitleCallback}
                changeTaskStatus={changeStatusCallback}
            />
            <Task
                task={tasks[1]}
                removeTask={removeCallback}
                changeTaskTitle={changeTitleCallback}
                changeTaskStatus={changeStatusCallback}
            />
        </div>)
}
