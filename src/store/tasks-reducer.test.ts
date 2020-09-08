import {
    addTaskAC,
    changeTaskStatusAC,
    removeTaskAC,
    setTasks,
    setTasksSuccess,
    tasksReducer, TasksStateType,
    updateTask
} from './tasks-reducer';
import {addTodolistSuccess, removeTodolist} from './todolists-reducer';
import {TaskType} from '../api/todolistAPI';


let startState: TasksStateType = {};
let newTask: TaskType
beforeEach(() => {
    newTask =  { id: '5', title: 'juce', status: 0, todoListId: 'todolistId1', completed: false, addedDate: '',
        deadline: '', order: 0, priority: 0, startDate: '',description: ''}
    startState = {
        ['todolistId1']: [
            { id: '1', title: 'CSS', status: 0, todoListId: 'todolistId1', completed: false, addedDate: '',
                deadline: '', order: 0, priority: 0, startDate: '',description: ''},
            { id: '2', title: 'JS', status: 0, todoListId: 'todolistId1', completed: false, addedDate: '',
                deadline: '', order: 0, priority: 0, startDate: '',description: ''},
        ],
        ['todolistId2']: [
            { id: '3', title: 'ANT', status: 0, todoListId: 'todolistId1', completed: false, addedDate: '',
                deadline: '', order: 0, priority: 0, startDate: '',description: ''},
            { id: '4', title: 'REACT', status: 0, todoListId: 'todolistId1', completed: false, addedDate: '',
                deadline: '', order: 0, priority: 0, startDate: '',description: ''},
        ]
    };
});

test('correct task should be deleted from correct array', () => {
    const action = removeTaskAC('todolistId2', '3',);

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(2);
    expect(endState['todolistId2'].length).toBe(1);
    expect(endState['todolistId2'].every(t => t.id != '3')).toBeTruthy();
});
test('correct task should be added to correct array', () => {
    const action = addTaskAC('todolistId2', newTask);
    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(2);
    expect(endState['todolistId2'].length).toBe(3);
    expect(endState['todolistId2'][0].id).toBeDefined();
    expect(endState['todolistId2'][0].title).toBe('juce');
});

test('status of specified task should be changed', () => {
    const task = startState['todolistId2'][0].title = 'jucy'
    const action = updateTask('3','todolistId2', task);

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'][0].title).toBe('jucy');
});

test('new array should be added when new todolist is added', () => {
    const action = addTodolistSuccess('new todolist');

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != 'todolistId1' && k != 'todolistId2');
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});
test('propertry with todolistId should be deleted', () => {
    const action = removeTodolist('todolistId2');

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState['todolistId2']).not.toBeDefined();
});
test('tasks should be added for todolist', () => {
    const action = setTasksSuccess('todolistId1', startState['todolistId1']);

    const endState = tasksReducer({
        'todolistId2': [],
        'todolistId1': []
    }, action)

    expect(endState['todolistId1'].length).toBe(2)
    expect(endState['todolistId2'].length).toBe(0)
})
