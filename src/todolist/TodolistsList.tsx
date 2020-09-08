import {Grid, Paper} from '@material-ui/core';
import {Todolist} from './Todolist';
import React, {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from '../store/store';
import {
    addTodolistThunk,
    changeTodolist,
    changeTodolistFilter,
    deleteTodolist,
    FilterValuesType,
    setTodolists,
    TodolistDomainType
} from '../store/todolists-reducer';
import {Redirect} from 'react-router-dom';
import {AddItemForm} from '../components/AddItemForm';


export const TodolistsList = () => {
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const isAuth = useSelector((state: AppRootStateType) => state.auth.isAuth)
    const dispatch = useDispatch();

    useEffect(() => {
        if (isAuth) {
            dispatch(setTodolists())
        }
    }, [dispatch])
    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        dispatch(changeTodolistFilter(todolistId, value));
    }, [dispatch]);

    const removeTodolist = useCallback(function (id: string) {
        dispatch(deleteTodolist(id))
    }, [dispatch]);

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        dispatch(changeTodolist(id, title))
    }, [dispatch]);
    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistThunk(title));
    }, [dispatch]);
    if (!isAuth) {
        return <Redirect to={'/login'}/>
    }
    return (
        <> <Grid container style={{padding: '25px'}}>
            <AddItemForm addItem={addTodolist}/>
            </Grid>
            <Grid container spacing={3}>
                {todolists.map(tl => {
                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist
                                todolist={tl}
                                changeFilter={changeFilter}
                                removeTodolist={removeTodolist}
                                changeTodolistTitle={changeTodolistTitle}
                            />
                        </Paper>
                    </Grid>
                })
                }
            </Grid>
        </>
    )
}
