import React from 'react'
import {useSelector,useDispatch} from 'react-redux'
import {setsubSideBarValue,subSideBarState} from '../../lib/redux/featuresSlice/subSideBarSlice'
export default function usesubSlideBar():{value:string|null,call_subSlideBar_Dispatch:(value:string|null) => Promise<void>}{
    const value=useSelector(subSideBarState) as string|null
    const disPatch=useDispatch()
    async function call_subSlideBar_Dispatch(value:string|null){
        disPatch(setsubSideBarValue(value))
    }
  return  {value,call_subSlideBar_Dispatch}
}
