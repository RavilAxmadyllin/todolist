import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': 'ef3df34b-f620-4141-98a4-941ac190a9df'
    }
})


export const todolistAPI = {
    async getTodolist() {
        const result = await instance.get<Array<TodolistType>>('todo-lists')
        return result.data
    },
    async createTodolist(title: string) {
        const result = await instance.post<DataType<{item: TodolistType}>>(`todo-lists/`, {title})
        return result.data
    },
    async deleteTodolist(id: string) {
        const result = await instance.delete<DataType<{}>>(`todo-lists/${id}`)
        return result.data
    },
    async updateTitleTodolist(id: string, title: string) {
        const result = await instance.put<DataType<{}>>(`todo-lists/${id}`, {title})
        return result.data
    },
    async getTasks(todolistId: string) {
        const result = await instance.get<GetTaskType>(`todo-lists/${todolistId}/tasks`)
        return result.data
    },
    async createTask(todolistId: string, title: string) {
        const result = await instance.post<DataType<{item: TaskType}>>(`todo-lists/${todolistId}/tasks`, {title})
        return result.data
    },
    async deleteTask(todolistId: string, taskId: string) {
        const result = await instance.delete<DataType<{}>>(`todo-lists/${todolistId}/tasks/${taskId}`)
        return result.data
    },
    async updateTask(todolistId: string, taskId: string, task:TaskType) {
        const result = await instance.put<DataType<{item: TaskType}>>(`todo-lists/${todolistId}/tasks/${taskId}`, task)
        return result.data
    }

}
export const authAPI = {
    async login(data: LoginType) {
        const result = await instance.post<DataType<{userId?:string}>>('/auth/login', data)
        return result.data
    },
    async logOut() {
        const result = await instance.delete<DataType<{}>>('/auth/login')
        return result.data
    },
    async authMe() {
        const result = await instance.get<DataType<{email:string}>>('/auth/me')
        return result.data
    }

}
// type
export type TodolistType = {
    id: string
    addedDate: string
    order: number
    title: string
}
type DataType<T> = {
    data: T
    messages: Array<string>
    resultCode: number
}
export type TaskType = {
    description: string
    title: string
    completed: boolean
    status: number
    priority: number
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}
type GetTaskType = {
    error: string | null
    items: Array<TaskType>
    totalCount: number
}

export type LoginType = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: string
}
