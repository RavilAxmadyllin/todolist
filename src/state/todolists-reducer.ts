import {todolistAPI, TodolistType} from '../api/todolistAPI';
import {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {AppRootStateType} from './store';


const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType) => {
    switch (action.type) {
        case 'TODOLIST-REDUCER/REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id);
        case 'TODOLIST-REDUCER/SET-TODOLIST':
            return [...action.todolists.map(tl => ({...tl, filter: 'all'})), ...state]
        case 'TODOLIST-REDUCER/ADD-TODOLIST': {
            return [{...action.todolist, filter: 'all'}, ...state]
        }
        case 'TODOLIST-REDUCER/CHANGE-TODOLIST-FILTER':
        case 'TODOLIST-REDUCER/CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ?
                {...tl, ...action.payload} : tl);
        default:
            return state;
    }
}
// action creator
export const removeTodolist = (id: string) =>
    ({type: 'TODOLIST-REDUCER/REMOVE-TODOLIST', id} as const)
export const addTodolistSuccess = (todolist: TodolistType) =>
    ({type: 'TODOLIST-REDUCER/ADD-TODOLIST', todolist} as const)
export const changeTodolistTitle = (id: string, title: string) =>
    ({type: 'TODOLIST-REDUCER/CHANGE-TODOLIST-TITLE', id, payload: {title}} as const)
export const changeTodolistFilter = (id: string, filter: FilterValuesType) =>
    ({type: 'TODOLIST-REDUCER/CHANGE-TODOLIST-FILTER', id, payload: {filter}} as const)
export const setTodolistSuccess = (todolists: Array<TodolistType>) =>
    ({type: 'TODOLIST-REDUCER/SET-TODOLIST', todolists} as const)


// Thunk
export const setTodolists = () => async (dispatch: ThunkTodolistDispatchType) => {
    try {
        const data = await todolistAPI.getTodolist()
        dispatch(setTodolistSuccess(data))
    } catch (e) {
        console.log(e.response)
    }
}
export const addTodolistThunk = (title: string) => async (dispatch: ThunkTodolistDispatchType) => {
    try {
        const data = await todolistAPI.createTodolist(title)
        if (data.resultCode === 0) {
            dispatch(addTodolistSuccess(data.data.item))
        }

    } catch (e) {
        console.log(e.response)
    }
}
export const deleteTodolist = (id: string) => async (dispatch: ThunkTodolistDispatchType) => {
    try {
        const data = await todolistAPI.deleteTodolist(id)
        if (data.resultCode === 0) {
            dispatch(removeTodolist(id))
        }

    } catch (e) {
        console.log(e.response)
    }
}
export const changeTodolist = (id: string, title: string) => async (dispatch: ThunkTodolistDispatchType) => {
    try {
        const data = await todolistAPI.updateTitleTodolist(id, title)
        if(data.resultCode === 0) {
            dispatch(changeTodolistTitle(id, title))
        }
    } catch (e) {
        console.log(e.response)
    }
}
// type
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & { filter: FilterValuesType }

export type RemoveTodolistType = ReturnType<typeof removeTodolist>
export type AddTodolistType = ReturnType<typeof addTodolistSuccess>
type ActionsType = RemoveTodolistType
    | AddTodolistType
    | ReturnType<typeof changeTodolistTitle>
    | ReturnType<typeof changeTodolistFilter>
    | ReturnType<typeof setTodolistSuccess>


type ThunkTodolistType = ThunkAction<void, AppRootStateType, unknown, ActionsType>
type ThunkTodolistDispatchType = ThunkDispatch<AppRootStateType, unknown, ActionsType>
