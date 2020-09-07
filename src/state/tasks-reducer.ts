import {TaskType, todolistAPI} from '../api/todolistAPI';
import {AddTodolistType, RemoveTodolistType} from './todolists-reducer';
import {Dispatch} from 'redux';
import {AppRootStateType} from './store';





const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType) => {
    switch (action.type) {
        case 'TASK-REDUCER/REMOVE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .filter(t => t.id !== action.taskId)
            }
        case 'TASK-REDUCER/ADD-TASK':
            return {
                ...state,
                [action.todolistId]: [action.task, ...state[action.todolistId]]
            }

        case 'TASK-REDUCER/CHANGE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.task} : t)
            }

        case 'TODOLIST-REDUCER/ADD-TODOLIST':
            return {
                ...state,
                [action.todolist.id]: []
            }

        case 'TODOLIST-REDUCER/REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        case 'TASK-REDUCER/SET-TASKS':
            return {
                ...state,
                [action.todolistId]: action.tasks
            }
        default:
            return state;
    }
}

// action creator
export const removeTaskAC = (todolistId: string, taskId: string) =>
    ({type: 'TASK-REDUCER/REMOVE-TASK', taskId: taskId, todolistId: todolistId} as const)
export const addTaskAC = (todolistId: string, task: TaskType) =>
    ({type: 'TASK-REDUCER/ADD-TASK', task, todolistId} as const)
export const changeTaskStatusAC = (taskId: string, task: TaskType, todolistId: string) =>
    ({type: 'TASK-REDUCER/CHANGE-TASK', task, todolistId, taskId} as const)
export const setTasksSuccess = (todolistId: string, tasks: Array<TaskType>) =>
    ({type: 'TASK-REDUCER/SET-TASKS', tasks, todolistId} as const)


// thunk
export const setTasks = (todolistId: string) => async (dispatch: Dispatch) => {
    try {
        const data = await todolistAPI.getTasks(todolistId)
        dispatch(setTasksSuccess(todolistId, data.items))
    } catch (e) {
        console.log(e.response)
    }
}
export const createTask = (todolistId: string, title: string) => async (dispatch: Dispatch) => {
    try {
        const data = await todolistAPI.createTask(todolistId, title)
        if (data.resultCode === 0) {
            dispatch(addTaskAC(todolistId, data.data.item))
        }
    } catch (e) {
        console.log(e.response)
    }
}
export const deleteTask = (todolistId: string, taskId: string) => async (dispatch: Dispatch) => {
    try {
        const data = await todolistAPI.deleteTask(todolistId, taskId)
        if (data.resultCode === 0) {
            dispatch(removeTaskAC(todolistId, taskId))
        }
    } catch (e) {
        console.log(e.response)
    }
}
export const updateTask = (todolistId: string, taskId: string, modal: TaskModalType) =>
    async (dispatch: Dispatch, getState: () => AppRootStateType) => {
        try {
            let task = getState().tasks[todolistId].find(t => t.id === taskId)
            if (!task) return
            task = {
                ...task,
                ...modal
            }
            const data = await todolistAPI.updateTask(todolistId, taskId, task)
            dispatch(changeTaskStatusAC(taskId, data.data.item, todolistId))
        } catch (e) {
            console.log(e.response)
        }
    }

//type

export type TasksStateType = {
    [key: string]: Array<TaskType>
}


export type TaskModalType = {
    description?: string
    title?: string
    completed?: boolean
    status?: number
    priority?: number
    deadline?: string
    order?: number
}

// all actions
type ActionsType = ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeTaskStatusAC>
    | ReturnType<typeof setTasksSuccess>
    | RemoveTodolistType
    | AddTodolistType
