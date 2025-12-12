// store/sidebarSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState}   from '../store'
type subSidebar = {
  value: string|null
}

const initialState: subSidebar = {
  value: null
}

export const subsidebarSlice = createSlice({
  name: 'subSideBar',
  initialState,
  reducers: {
    setsubSideBarValue(state, action: PayloadAction<string|null>) {
       
      state.value =action.payload
    }
  }
})

// Export the action
export const { setsubSideBarValue } = subsidebarSlice.actions
export const subSideBarState=(state:RootState)=>state.subSideBar.value
// Export the reducer
export default subsidebarSlice.reducer
