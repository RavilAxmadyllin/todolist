import {authAPI} from '../api/todolists-api'
import {setIsLoggedIn} from '../features/Login/auth-reducer'
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
// initial state
const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false
}
// create thunk
export const initializeApp = createAsyncThunk('app/initializeApp', async (param, {dispatch, rejectWithValue}) => {
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedIn())
        }
    } catch (err) {
        return rejectWithValue(null)
    }
})
// reducer and action creator
const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppError(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
        setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        }
    },
    extraReducers: builder => {
        builder.addCase(initializeApp.fulfilled, (state) => {
            state.isInitialized = true
        })
    }
})
export const {setAppError, setAppStatus} = slice.actions
export const appReducer = slice.reducer
// type
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}



