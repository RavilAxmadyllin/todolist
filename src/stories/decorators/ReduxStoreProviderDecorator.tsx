import React from 'react'
import {Provider} from 'react-redux'
import {combineReducers, createStore} from 'redux'
import {tasksReducer} from '../../store/tasks-reducer'
import {todolistsReducer} from '../../store/todolists-reducer'
import {v1} from 'uuid'
import {AppRootStateType} from '../../store/store'

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

const initialGlobalState = {
    // todolists: [
    //     {id: "todolistId1", title: "What to learn", filter: "all", addedDate: 'string',order: 0},
    //     {id: "todolistId2", title: "What to buy", filter: "all", addedDate: 'string',order: 0}
    // ] ,
    // tasks: {
    //     ["todolistId1"]: [
    //         {id: v1(), title: "HTML&CSS", isDone: true},
    //         {id: v1(), title: "JS", isDone: true}
    //     ],
    //     ["todolistId2"]: [
    //         {id: v1(), title: "Milk", isDone: true},
    //         {id: v1(), title: "React Book", isDone: true}
    //     ]
    // }
};

export const storyBookStore = createStore(rootReducer, initialGlobalState as AppRootStateType);

 const ReduxStoreProviderDecorator = (storyFn: any) => (
    <Provider
        store={storyBookStore}>{storyFn()}
    </Provider>)
