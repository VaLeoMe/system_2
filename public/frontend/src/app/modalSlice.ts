import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from './store'

interface modalState {
  modalOpen: boolean
}

const initialState: modalState = {
  modalOpen: false
}

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    toggleModal: (state) => {
      state.modalOpen = !state.modalOpen
    },
    openModal: (state) => {
      state.modalOpen = true
    },
    closeModal: (state) => {
      state.modalOpen = false
    }
  }
})

export const { toggleModal, openModal, closeModal } = modalSlice.actions

export const selectModal = (state: RootState) => state.modal.modalOpen

export default modalSlice.reducer
