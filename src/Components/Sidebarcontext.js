import React, {  createContext, useState } from 'react'
const SideContext = createContext();
const SidebarContext = ({children}) => {
    const [display,setDisplay] = useState(true);
    const [userDetails,setUserDetails] = useState(null);
    const [name,setName] = useState(null);
    const [bill,setBill] = useState(null);
    const [address,setAddress] = useState(null);
    const [allConsumerCode,setAllConsumerCode] = useState(null);
    const [user,setUser] = useState(null);
    const [postPaidBill,setPostPaidBill] = useState(null);
    const [emailForResetPassword,setEmailForResetPassword] = useState(null);
  return (
    <SideContext.Provider value={{emailForResetPassword,setEmailForResetPassword,postPaidBill,setPostPaidBill,user,setUser,display,setDisplay,userDetails,allConsumerCode,setAllConsumerCode, setUserDetails,name,setName,bill,setBill,address,setAddress}}>
        {children}
    </SideContext.Provider>
  )
}
export  {SidebarContext,SideContext};