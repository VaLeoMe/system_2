import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import modalReducer from './modalSlice'
import lotHistoryReducer from './lotHistorySlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    modal: modalReducer,
    lotHistory: lotHistoryReducer
  }
})

export type RootState = ReturnType<typeof store.getState>

export default store
