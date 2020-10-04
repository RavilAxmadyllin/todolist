import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {RequestStatusType, setAppStatus} from '../../app/app-reducer'
import {handleServerNetworkError} from '../../utils/error-utils'
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'

// thunks
export const fetchTodolistsTC = createAsyncThunk('todolist/fetchTodolists', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await todolistsAPI.getTodolists()
        thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
        return ({todolists: res.data})

    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(null)
    }
})
export const removeTodolistTC = createAsyncThunk('todolist/removeTodolistTC',
    async (todolistId: string, thunkAPI) => {
        thunkAPI.dispatch(setAppStatus({status: 'loading'}))
        thunkAPI.dispatch(changeTodolistEntityStatus({id: todolistId, status: 'loading'}))
        const res = await todolistsAPI.deleteTodolist(todolistId)
        thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
        return {id: todolistId}

    })
export const addTodolistTC = createAsyncThunk('todolist/addTodolist', async (title: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    const res = await todolistsAPI.createTodolist(title)
    thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
    return {todolist: res.data.data.item}
})
export const changeTodolistTitleTC = createAsyncThunk('todolist/changeTodolistTitle',
    async (param: { id: string, title: string }, thunkAPI) => {
        await todolistsAPI.updateTodolist(param.id, param.title)
        return param
    })
// reducer and action creator
const slice = createSlice({
    name: 'todolist',
    initialState: [] as Array<TodolistDomainType>,
    reducers: {
        changeTodolistFilter(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatus(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.status
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            action.payload.todolists.map(t => ({...t, filter: 'all', entityStatus: 'idle'}))
        })
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            const index = state.findIndex(t => t.id === action.payload.id)
            if (index > 0) {
                state.splice(index, 1)
            }
        })
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        })
        builder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].title = action.payload.title
        })
    }
})
export const {changeTodolistEntityStatus, changeTodolistFilter,} = slice.actions
export const todolistsReducer = slice.reducer


// types
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

