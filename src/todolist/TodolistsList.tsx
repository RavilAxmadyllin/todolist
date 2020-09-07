import {Grid, Paper} from '@material-ui/core';
import {Todolist} from './Todolist';
import React, {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from '../state/store';
import {
    changeTodolist,
    changeTodolistFilter,
    deleteTodolist,
    FilterValuesType,
    setTodolists,
    TodolistDomainType
} from '../state/todolists-reducer';



export const TodolistsList = () => {
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setTodolists())
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

    return (
        <Grid container spacing={3}>
            {todolists.map(tl => {
                return <Grid item key={tl.id}>
                    <Paper style={{padding: '10px'}}>
                        <Todolist
                            todolist = {tl}
                            changeFilter={changeFilter}
                            removeTodolist={removeTodolist}
                            changeTodolistTitle={changeTodolistTitle}
                        />
                    </Paper>
                </Grid>
            })
            }
        </Grid>
    )
}
