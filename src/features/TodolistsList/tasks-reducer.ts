import {addTodolist, removeTodolist, setTodolists} from './todolists-reducer'
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI} from '../../api/todolists-api'
import {setAppStatus} from '../../app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {AppRootStateType} from '../../app/store'

// state
const initialState:TasksStateType  = {}
// thunk
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    const data = await todolistsAPI.getTasks(todolistId)
    thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
    return ({tasks: data.items, todolistId})
})
export const removedTask = createAsyncThunk('tasks/removeTask', async (param: { taskId: string, todolistId: string }, thunkAPI) => {
    await todolistsAPI.deleteTask(param.todolistId, param.taskId)
    return ({taskId: param.taskId, todolistId: param.todolistId})
})
export const addTask = createAsyncThunk('tasks/addTask', async (param: { title: string, todolistId: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await todolistsAPI.createTask(param.todolistId, param.title)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
            return {task: res.data.data.item}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue(null)
        }

    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(null)
    }
})
export const updateTask = createAsyncThunk('tasks/updateTask',
    async (param: { taskId: string, model: UpdateDomainTaskModelType, todolistId: string }, thunkAPI) => {
        const state = thunkAPI.getState() as AppRootStateType
        const task = state.tasks[param.todolistId].find(t => t.id === param.taskId)
        if (!task) {
            return thunkAPI.rejectWithValue('task not found in the state')
        }
        const apiModel = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...param.model
        }
        try {
            const res = await todolistsAPI.updateTask(param.todolistId, param.taskId, apiModel)
            if (res.data.resultCode === 0) return param
            else {
                handleServerAppError(res.data, thunkAPI.dispatch)
                return thunkAPI.rejectWithValue(null)
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(null)
        }
    }
)
// reducer and action creator
const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addTodolist, (state, action) => {
            state[action.payload.todolist.id] = []
        })
        builder.addCase(removeTodolist, (state, action) => {
            delete state[action.payload.id]
        })
        builder.addCase(setTodolists, (state, action) => {
            action.payload.todolists.forEach(tl => state[tl.id] = [])
        })
        builder.addCase(fetchTasks.fulfilled, (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks
        })
        builder.addCase(removedTask.fulfilled, (state, action) => {
            const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId)
            state[action.payload.todolistId].splice(index, 1)
        })
        builder.addCase(addTask.fulfilled, (state, action) => {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        })
        builder.addCase(updateTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                tasks[index] = {...tasks[index], ...action.payload.model}
        })
    }
})

export const tasksReducer = slice.reducer

// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<TaskType>
}


