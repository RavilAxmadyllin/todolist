import {
    addTodolistSuccess,
    changeTodolistFilter,
    changeTodolistTitle,
    removeTodolist,
    todolistsReducer,
    TodolistDomainType, FilterValuesType, setTodolistSuccess
} from './todolists-reducer';
import {v1} from 'uuid';


let todolistId1: string;
let todolistId2: string;
let startState: Array<TodolistDomainType> = [];

beforeEach(() => {
    todolistId1 = v1();
    todolistId2 = v1();
    startState = [
        {id: todolistId1, title: "What to learn", filter: "all", addedDate : '', order: 0},
        {id: todolistId2, title: "What to buy", filter: "all", addedDate : '', order: 0}
    ]
})

test('correct todolist should be removed', () => {
    const endState = todolistsReducer(startState, removeTodolist(todolistId1))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {
   const newTodolist = {id: todolistId2, title: "second", addedDate : '', order: 0}

    const endState = todolistsReducer([], addTodolistSuccess(newTodolist))

    expect(endState[0].title).toBe('second');
    expect(endState[0].filter).toBe("all");
});

test('correct todolist should change its name', () => {
    let newTodolistTitle = "New Todolist";

    const action = changeTodolistTitle(todolistId2, newTodolistTitle);

    const endState = todolistsReducer(startState, action);

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {
    let newFilter: FilterValuesType = "completed";

    const action = changeTodolistFilter(todolistId2, newFilter);

    const endState = todolistsReducer(startState, action);

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});
test('todolists should be added', () => {
    const newArrayTodolist = [
        {id: todolistId2, title: "first", addedDate : '', order: 0},
        {id: todolistId2, title: "second", addedDate : '', order: 0}
    ]
    const action = setTodolistSuccess(newArrayTodolist);
    const endState = todolistsReducer([], action);

    expect(endState[0].filter).toBe("all");
    expect(endState.length).toBe(2)
});

