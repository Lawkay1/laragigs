import { Outlet } from "react-router-dom"
import { Navigate } from "react-router-dom"
import { userStateContext } from "../contexts/ContextProvider"
export default function GuestLayout(){

  const { currentUser, userToken} = userStateContext();
  if (userToken) {
    return <Navigate to="/" />
  }

    return (

        <div>
           <div className="flex bg-slate-100 min-h-full flex-1 flex-col justify-center px-10 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              alt="Your Company"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              className="mx-auto h-10 w-auto"
            />
          
          </div>
                <Outlet />
                </div>

        </div>
    )
}