import React from 'react'
import {useDispatch} from 'react-redux'
import {getUser_details} from '../../../../../../../Inbox/inbox/apps/web/src/lib/redux/featureSlice/userInfoSlice'
export default function useProfile():boolean{
    const disPatch=useDispatch()
    const user=disPatch(getUser_details() as any)
  return  user
}
