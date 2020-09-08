import React, {useEffect} from 'react'
import './App.css';
import {AppBar, Button, Container, IconButton, LinearProgress, Toolbar} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {useDispatch, useSelector} from 'react-redux';
import {TodolistsList} from './todolist/TodolistsList';
import {AppRootStateType} from './store/store';
import {ErrorSnackbar} from './components/ErrorSnackBar';
import {Route} from 'react-router-dom';
import {Login} from './login/Login';
import {isAuth, logOut} from './store/login-reducer';
import {initialAppState} from './store/app-reducer';


function AppWithRedux() {
    const init = useSelector((state:AppRootStateType) => state.app.initialApp)
    const status = useSelector((state:AppRootStateType) => state.app.status)
    const dispatch = useDispatch()
    useEffect( () => {
        dispatch(initialAppState())
    },[dispatch])
    const logoutHandler = () => {
        dispatch(logOut())
    }
    if(!init){
        return <div>wait</div>
    }
    return (
        <div className="App">
            <ErrorSnackbar />
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    {isAuth && <Button color="inherit" onClick={logoutHandler}>log out</Button>}
                </Toolbar>
            </AppBar>
            <div style={{height: '40px'}}>
                {status === 'loading' && <LinearProgress color="secondary" />}
            </div>
            <Container fixed>
                <Route exact path ={'/'} render={() => <TodolistsList/>}/>
                <Route  path ={'/login'} render={() => <Login/>}/>
            </Container>
        </div>
    );
}

export default AppWithRedux;

