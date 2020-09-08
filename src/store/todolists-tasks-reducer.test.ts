import {TodolistDomainType, todolistsReducer} from './todolists-reducer';
import {tasksReducer, TasksStateType} from './tasks-reducer';
import { TodolistType } from '../api/todolistAPI';
import {addTodolistSuccess} from './todolists-reducer';

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {};
    const startTodolistsState: Array<TodolistDomainType> = [];
    const todolist: TodolistType = {id: '1',order: 0, title: 'newTitle', addedDate: ''}
    const action = addTodolistSuccess(todolist);

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.todolist.id);
    expect(idFromTodolists).toBe(action.todolist.id);
});
