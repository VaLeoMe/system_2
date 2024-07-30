import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import { User } from '../types'

interface UserState {
  user: User | undefined
}

const initialState: UserState = {
  user: undefined
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = undefined
    },
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    }
  }
})

export const { logout, login } = userSlice.actions

export const selectUser = (state: RootState) => state.user.user

export default userSlice.reducer
