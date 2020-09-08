import React, {useCallback, useEffect} from 'react'
import {AddItemForm} from '../components/AddItemForm'
import {EditableSpan} from '../components/EditableSpan'
import {Button, IconButton} from '@material-ui/core'
import {Delete} from '@material-ui/icons'
import {Task} from './Task'
import {FilterValuesType, TodolistDomainType} from '../store/todolists-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {createTask, deleteTask, setTasks, TasksStateType, updateTask} from '../store/tasks-reducer';
import {AppRootStateType} from '../store/store';


type PropsType = {
    todolist: TodolistDomainType
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
}

export const Todolist = React.memo(({todolist, ...props}: PropsType) => {
    console.log('Todolist called')
    let allTasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(setTasks(todolist.id))
    }, [dispatch, todolist.id])

    const removeTask = useCallback((id: string) => {
        dispatch(deleteTask(todolist.id, id))
    }, [dispatch, todolist.id]);

    const addTask = useCallback((title: string) => {
        dispatch(createTask(todolist.id, title))
    }, [dispatch, todolist.id]);
    const changeStatus = useCallback((id: string, status: number) => {
        dispatch(updateTask(todolist.id, id, {status}))
    }, [dispatch, todolist.id]);
    const changeTaskTitle = useCallback((id, newTitle: string) => {
        dispatch(updateTask(todolist.id, id, {title: newTitle}))
    }, [dispatch, todolist.id]);

    const removeTodolist = useCallback(() => {
        props.removeTodolist(todolist.id)
    }, [props, todolist.id])
    const changeTodolistTitle = useCallback((title: string) => {
        props.changeTodolistTitle(todolist.id, title)
    }, [props, todolist.id])

    const onAllClickHandler = useCallback(() => props.changeFilter('all', todolist.id), [todolist.id, props])
    const onActiveClickHandler = useCallback(() => props.changeFilter('active', todolist.id), [todolist.id, props])
    const onCompletedClickHandler = useCallback(() => props.changeFilter('completed', todolist.id), [todolist.id, props])

    let tasks = allTasks[todolist.id] ? allTasks[todolist.id] : []

    if (todolist.filter === 'active') {
        tasks = tasks.filter(t => t.status === 0)
    }
    if (todolist.filter === 'completed') {
        tasks = tasks.filter(t => t.status === 2)
    }

    return <div>
        <h3><EditableSpan value={todolist.title} onChange={changeTodolistTitle} />
            <IconButton onClick={removeTodolist} disabled={todolist.entityStatus}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask} disabled={todolist.entityStatus}/>
        <div>
            {
                tasks.map(t => <Task key={t.id} task={t}
                                     removeTask={removeTask}
                                     changeTaskTitle={changeTaskTitle}
                                     changeTaskStatus={changeStatus}/>)
            }
        </div>
        <div style={{paddingTop: '15px'}}>
            <Button variant={todolist.filter === 'all' ? 'outlined' : 'text'}
                    onClick={onAllClickHandler}
                    color={'default'}
            >All
            </Button>
            <Button variant={todolist.filter === 'active' ? 'outlined' : 'text'}
                    onClick={onActiveClickHandler}
                    color={'primary'}>Active
            </Button>
            <Button variant={todolist.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={onCompletedClickHandler}
                    color={'secondary'}>Completed
            </Button>
        </div>
    </div>
})


