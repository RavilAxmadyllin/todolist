import React, {useCallback} from 'react'
import './App.css';
import {AddItemForm} from './components/AddItemForm';
import {AppBar, Button, Container, Grid, IconButton, Toolbar, Typography} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {addTodolistThunk} from './state/todolists-reducer';
import {useDispatch} from 'react-redux';
import {TodolistsList} from './todolist/TodolistsList';


function AppWithRedux() {
    const dispatch = useDispatch()
    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistThunk(title));
    }, [dispatch]);

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: '20px'}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <TodolistsList/>
            </Container>
        </div>
    );
}

export default AppWithRedux;

