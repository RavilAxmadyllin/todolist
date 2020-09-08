import {tasksReducer} from './tasks-reducer';
import {todolistsReducer} from './todolists-reducer';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk from 'redux-thunk';
import {appReducer} from './app-reducer';
import {loginReducer} from './login-reducer';


const rootReducer = combineReducers({
    auth: loginReducer,
    app: appReducer,
    tasks: tasksReducer,
    todolists: todolistsReducer
})
export const store = createStore(rootReducer, applyMiddleware(thunk));

export type AppRootStateType = ReturnType<typeof rootReducer>

// @ts-ignore
window.store = store;
