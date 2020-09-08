import {AppActionType, changeAppStatus, setErrorApp} from './app-reducer'
import {authAPI, LoginType} from '../api/todolistAPI'
import {Dispatch} from 'redux';
import {ThunkDispatch} from 'redux-thunk';
import {AppRootStateType} from './store';

const initialState = {
    isAuth: false
}

export const loginReducer = (state = initialState, action: LoginActionType) => {
    switch (action.type) {
        case 'LOGIN-REDUCER/ISAUTH':
            return {...state, isAuth: action.isAuth}
        default:
            return state
    }
}
//action
export const isAuth = (isAuth: boolean) => ({type: 'LOGIN-REDUCER/ISAUTH', isAuth} as const)
//thunk
export const loginThunk = (data: LoginType) => async (dispatch:DispatchLoginType) => {
    dispatch(changeAppStatus('loading'))
    try {
        const result = await authAPI.login(data)
        dispatch(changeAppStatus('idle'))
        if(result.resultCode === 0){
            dispatch(isAuth(true))
            dispatch(authMe())
        }
    }
    catch (e) {
        dispatch(setErrorApp(e.response.message))
    }
}
export const logOut = () => async (dispatch:DispatchLoginType) => {
    dispatch(changeAppStatus('loading'))
    try {
        const result = await authAPI.logOut()
        dispatch(changeAppStatus('idle'))
        if(result.resultCode === 0){
            dispatch(isAuth(false))
        }
    }
    catch (e) {
        dispatch(setErrorApp(e.response.message))
    }
}

export const authMe = () => async (dispatch: Dispatch) => {
    dispatch(changeAppStatus('loading'))
    try {
        const result = await authAPI.authMe()
        if(result.resultCode === 0){
            dispatch(isAuth(true))
        }else {
            dispatch(isAuth(false))
        }
        dispatch(changeAppStatus('idle'))
    }
    catch (e) {
        dispatch(setErrorApp(e.response.message))
    }
}
//type
type LoginActionType = AppActionType
| AuthAction
export type AuthAction = ReturnType<typeof isAuth>
type DispatchLoginType = ThunkDispatch<AppRootStateType, unknown, LoginActionType>
