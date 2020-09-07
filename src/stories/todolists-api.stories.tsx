import React, {useEffect, useState} from 'react'
import {TaskType, todolistAPI} from '../api/todolistAPI';

export default {
    title: 'API'
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistAPI.getTodolist()
            .then(data => setState(data))

    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistAPI.createTodolist('newTitleForStories')
            .then(data => {
                setState(data)
            })

    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = 'c4a0e1ec-e296-4ae7-a254-242f5cf5c77a';
        todolistAPI.deleteTodolist(todolistId)
            .then(data => setState(data))
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '7c1303b8-cdb8-4d48-9031-c5d78688fcf3';
        todolistAPI.updateTitleTodolist(todolistId, 'newTitleForStories').then(d => setState(d))
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const GetTodolisTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '7c1303b8-cdb8-4d48-9031-c5d78688fcf3';
        todolistAPI.getTasks(todolistId).then(d => {
            setState(d)
        })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const createTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '7c1303b8-cdb8-4d48-9031-c5d78688fcf3';
        todolistAPI.createTask(todolistId, 'storiesTitle').then(d => setState(d));
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const deleteTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '7c1303b8-cdb8-4d48-9031-c5d78688fcf3';
        const taskId = '01b27741-eef4-4280-a573-6dfd0406c4e8';
        todolistAPI.deleteTask(todolistId, taskId).then(d => setState(d))
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const updateTask = () => {
    const [state, setState] = useState<any>(null)
    return <div> {JSON.stringify(state)}</div>
}
