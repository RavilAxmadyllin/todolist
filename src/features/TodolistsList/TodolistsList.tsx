import React, {useCallback, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {AppRootStateType} from '../../app/store'
import {
    addTodolistTC,
    changeTodolistFilter,
    changeTodolistTitleTC,
    fetchTodolistsTC,
    FilterValuesType,
    removeTodolistTC,
    TodolistDomainType
} from './todolists-reducer'
import {addTask, removedTask, TasksStateType, updateTask} from './tasks-reducer'
import {TaskStatuses} from '../../api/todolists-api'
import {Grid, Paper} from '@material-ui/core'
import {AddItemForm} from '../../components/AddItemForm/AddItemForm'
import {Todolist} from './Todolist/Todolist'
import {Redirect} from 'react-router-dom'

type PropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)

    const dispatch = useDispatch()

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        const thunk = fetchTodolistsTC()
        dispatch(thunk)
    }, [dispatch])

    const removeTaskHandler = useCallback(function (taskId: string, todolistId: string) {
        dispatch(removedTask({taskId, todolistId}))
    }, [dispatch])

    const addTaskHandler = useCallback(function (title: string, todolistId: string) {
        const thunk = addTask({title, todolistId})
        dispatch(thunk)
    }, [])

    const changeStatusHandler = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        const thunk = updateTask(id, {status}, todolistId)
        dispatch(thunk)
    }, [])

    const changeTaskTitleHandler = useCallback(function (id: string, newTitle: string, todolistId: string) {
        const thunk = updateTask(id, {title: newTitle}, todolistId)
        dispatch(thunk)
    }, [])

    const changeFilterHandler = useCallback(function (value: FilterValuesType, todolistId: string) {
        const action = changeTodolistFilter({filter: value, id: todolistId})
        dispatch(action)
    }, [dispatch])

    const removeTodolistHandler = useCallback(function (id: string) {
        const thunk = removeTodolistTC(id)
        dispatch(thunk)
    }, [])

    const changeTodolistTitleHandler = useCallback(function (id: string, title: string) {
        const thunk = changeTodolistTitleTC(id, title)
        dispatch(thunk)
    }, [])

    const addTodolistHandler = useCallback((title: string) => {
        const thunk = addTodolistTC(title)
        dispatch(thunk)
    }, [dispatch])

    if (!isLoggedIn) {
        return <Redirect to={"/login"} />
    }

    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolistHandler}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist
                                todolist={tl}
                                tasks={allTodolistTasks}
                                removeTask={removeTaskHandler}
                                changeFilter={changeFilterHandler}
                                addTask={addTaskHandler}
                                changeTaskStatus={changeStatusHandler}
                                removeTodolist={removeTodolistHandler}
                                changeTaskTitle={changeTaskTitleHandler}
                                changeTodolistTitle={changeTodolistTitleHandler}
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
