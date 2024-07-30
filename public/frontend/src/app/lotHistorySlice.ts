import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LotHistory } from '../types'
import { RootState } from './store'

interface lotHistoryState {
  lotHistory: LotHistory | undefined
}

const initialState: lotHistoryState = {
  lotHistory: undefined
}

export const lotHistorySlice = createSlice({
  name: 'lotHistory',
  initialState,
  reducers: {
    setHistory: (state, action: PayloadAction<LotHistory>) => {
      state.lotHistory = action.payload
    },
    clearHistory: (state) => {
      state.lotHistory = undefined
    }
  }
})

export const { setHistory, clearHistory } = lotHistorySlice.actions

export const selectHistory = (state: RootState) => state.lotHistory.lotHistory

export default lotHistorySlice.reducer
