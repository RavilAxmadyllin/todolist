import {AuthAction, authMe, isAuth} from './login-reducer';
import {AppRootStateType} from './store';
import {ThunkAction} from 'redux-thunk';

export type RequestStatusType = 'idle' | 'loading'



const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    initialApp: false
}

export const appReducer = (state: InitialStateType = initialState, action: AppActionType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case 'APP/INITIAL-APP':
            return {...state, initialApp: action.initialApp}
        default:
            return state
    }
}
//action
export const changeAppStatus = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setErrorApp = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)
export const setInitialApp = (initialApp: boolean) => ({type: 'APP/INITIAL-APP', initialApp} as const)

//thunk
export const initialAppState = ():AppThunkType => async (dispatch) => {
    await dispatch(authMe())
    dispatch(setInitialApp(true))

}
//type
type AppThunkType = ThunkAction<void, AppRootStateType, unknown, AppActionType>

export type AppActionType = ReturnType<typeof changeAppStatus>
    | ReturnType<typeof setErrorApp>
    | ReturnType<typeof setInitialApp>

type InitialStateType = {
    status: RequestStatusType
    error: string | null
    initialApp: boolean
}
