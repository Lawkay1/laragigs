/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { useState } from "react";
import axiosClient from "../axios.js";
import { Link } from "react-router-dom";
import { userStateContext } from "../contexts/ContextProvider.jsx";
export default function Signup() {
    const {setCurrentUser, setUserToken } = userStateContext();
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState({__html:''});
    const onSubmit = (ev) => {
        ev.preventDefault(); 
        setError({__html:''});

        axiosClient.post('/signup', {
            name:fullname,
            email,
            password,
            password_confirmation:confirmPassword

    }).then(({data}) => {
      setCurrentUser(data.user)
      setUserToken(data.token)
      console.log(data)
    }).catch((error) => {
      if (error.response) {
        const finalErrors = Object.values(error.response.data.errors).reduce((accum, next)=> [...next, ...accum], [])
        console.log('IAM HERE')
        console.log(finalErrors)
        
        setError({__html: finalErrors.join('<br>')});
        
      }
      console.error(error)  
      
    }
    
  )
  }
    return (
      <>
          
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Signup for Free
            </h2>

            <p href="#" className="mt-2 text-center text-sm leading-6 text-gray-600">
                Or{"  "}
                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Login with your account
                </Link>
              </p>

              {error.__html && (
          <div
              className="bg-red-500 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              dangerouslySetInnerHTML={{ __html: error.__html }}
          />
      )}
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={onSubmit} action="#" method="POST" className="space-y-6">
            <div>
                <label htmlFor="fullname" className="block text-sm font-medium leading-6 text-gray-900">
                  {fullname}
                  Full Name
                </label>
                <div className="mt-2">
                  <input
                    id="fullname"
                    name="fullname"
                    type="text"
                    required
                    value = {fullname}
                    onChange = {ev=> setFullname(ev.target.value)}
                    placeholder="Full Name"
                    className="block w-full  border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value = {email}
                    placeholder="Email Address"
                    onChange = {ev=> setEmail(ev.target.value)}
                    autoComplete="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                  {/* <div className="text-sm">
                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                      Forgot password?
                    </a>
                  </div> */}
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value = {password}
                    placeholder="Password"
                    onChange = {ev=> setPassword(ev.target.value)}
                    autoComplete="current-password"
                    className="block w-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password-confirmation" className="block text-sm font-medium leading-6 text-gray-900">
                    Password Confirmation
                  </label>
                  {/* <div className="text-sm">
                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                      Forgot password?
                    </a>
                  </div> */}
                </div>
                <div className="mt-2">
                  <input
                    id="password-confirmation"
                    name="password_confirmation"
                    type="password"
                    value = {confirmPassword}
                    onChange = {ev=> setConfirmPassword(ev.target.value)}
                    required
                    placeholder = "Confirm Password"
                    autoComplete="current-password"
                    className="block w-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign up
                </button>
              </div>
            </form>
  
            {/* <p className="mt-10 text-center text-sm text-gray-500">
              Not a member?{' '}
              <a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                Start a 14 day free trial
              </a>
            </p> */}
          </div>
      </>
    )
  

}
