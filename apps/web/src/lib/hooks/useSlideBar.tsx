import React from 'react'
import {useSelector,useDispatch} from 'react-redux'
import {sideBarState,toggleSidebar} from '../../lib/redux/featuresSlice/slideBarSlice'
export default function useSlideBar():{value:Boolean,call_SlideBar_Dispatch:(isOpen:boolean) => Promise<void>}{
    const value=useSelector(sideBarState) as boolean
    const disPatch=useDispatch()
    async function call_SlideBar_Dispatch(isOpen:boolean){
        disPatch(toggleSidebar(isOpen))
    }
  return  {value,call_SlideBar_Dispatch}
}
