import {todolistAPI, TodolistType} from '../api/todolistAPI';
import {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {AppRootStateType} from './store';
import {AppActionType, changeAppStatus, setErrorApp} from './app-reducer';

const initialState: Array<TodolistDomainType> = []
export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType) => {
    switch (action.type) {
        case 'TODOLIST-REDUCER/REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id);
        case 'TODOLIST-REDUCER/SET-TODOLIST':
            return [...action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: false})), ...state]
        case 'TODOLIST-REDUCER/ADD-TODOLIST': {
            return [{...action.todolist, filter: 'all', entityStatus: false}, ...state]
        }
        case 'TODOLIST-REDUCER/CHANGE-TODOLIST-FILTER':
        case 'TODOLIST-REDUCER/CHANGE-STATUS':
        case 'TODOLIST-REDUCER/CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ?
                {...tl, ...action.payload} : tl);
        default:
            return state;
    }
}
// action creator
export const removeTodolist = (id: string) =>
    ({type: 'TODOLIST-REDUCER/REMOVE-TODOLIST', id} as const);
export const addTodolistSuccess = (todolist: TodolistType) =>
    ({type: 'TODOLIST-REDUCER/ADD-TODOLIST', todolist} as const);
export const changeTodolistTitle = (id: string, title: string) =>
    ({type: 'TODOLIST-REDUCER/CHANGE-TODOLIST-TITLE', id, payload: {title}} as const);
export const changeTodolistFilter = (id: string, filter: FilterValuesType) =>
    ({type: 'TODOLIST-REDUCER/CHANGE-TODOLIST-FILTER', id, payload: {filter}} as const);
export const setTodolistSuccess = (todolists: Array<TodolistType>) =>
    ({type: 'TODOLIST-REDUCER/SET-TODOLIST', todolists} as const);
export const setTodolistStatus = (id: string, entityStatus: boolean) =>
    ({type: 'TODOLIST-REDUCER/CHANGE-STATUS', id, payload:{entityStatus}} as const);


// Thunk
export const setTodolists = () => async (dispatch: ThunkTodolistDispatchType) => {
    dispatch(changeAppStatus('loading'));
    try {
        const data = await todolistAPI.getTodolist();
        dispatch(setTodolistSuccess(data));
        dispatch(changeAppStatus('idle'));
    } catch (e) {
        dispatch(changeAppStatus('idle'))
        dispatch(setErrorApp(e.response.data.message));
    }
}
export const addTodolistThunk = (title: string) => async (dispatch: ThunkTodolistDispatchType) => {
    dispatch(changeAppStatus('loading'))
    try {
        const data = await todolistAPI.createTodolist(title);
        dispatch(changeAppStatus('idle'));
        if (data.resultCode === 0) {
            dispatch(addTodolistSuccess(data.data.item));
        }

    } catch (e) {
        dispatch(setErrorApp(e.response.data.message));
    }
}
export const deleteTodolist = (id: string) => async (dispatch: ThunkTodolistDispatchType) => {
    dispatch(changeAppStatus('loading'));
    dispatch(setTodolistStatus(id, true));
    try {
        const data = await todolistAPI.deleteTodolist(id)
        dispatch(changeAppStatus('idle'));
        dispatch(setTodolistStatus(id, false));
        if (data.resultCode === 0) {
            dispatch(removeTodolist(id));
        }

    } catch (e) {
        dispatch(setErrorApp(e.response.data.message));
    }
}
export const changeTodolist = (id: string, title: string) => async (dispatch: ThunkTodolistDispatchType) => {
    dispatch(changeAppStatus('loading'));
    dispatch(setTodolistStatus(id, true))
    try {
        const data = await todolistAPI.updateTitleTodolist(id, title);
        dispatch(changeAppStatus('idle'));
        dispatch(setTodolistStatus(id, false))
        if(data.resultCode === 0) {
            dispatch(changeTodolistTitle(id, title));
        }
    } catch (e) {
        dispatch(changeAppStatus('idle'));
        dispatch(setErrorApp(e.response.data.message));
    }
}
// type
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & { filter: FilterValuesType } & {entityStatus: false};

export type RemoveTodolistType = ReturnType<typeof removeTodolist>;
export type AddTodolistType = ReturnType<typeof addTodolistSuccess>;
export type SetTodolistsType = ReturnType<typeof setTodolistSuccess>;
export type TodolistStatusType = ReturnType<typeof setTodolistStatus>;
type ActionsType = RemoveTodolistType
    | AppActionType
    | AddTodolistType
    | SetTodolistsType
    | TodolistStatusType
    | ReturnType<typeof changeTodolistTitle>
    | ReturnType<typeof changeTodolistFilter>
    | ReturnType<typeof setTodolistSuccess>


type ThunkTodolistType = ThunkAction<void, AppRootStateType, unknown, ActionsType>;
type ThunkTodolistDispatchType = ThunkDispatch<AppRootStateType, unknown, ActionsType>;
