import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../../components/ui/formElement/Button"
import Input from "../../components/ui/formElement/Input"
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { storeCookie } from "../../lib/auth";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

type Inputs ={
  email:string,
  password:string
}
interface ApiResponse {
  message?: string;
  error?: string;
  token?: string;
}
export default function Login (){
  const navigate = useNavigate()
  const {auth } = useAuth()
  const {register ,handleSubmit,formState:{errors}}= useForm<Inputs>()
  const [isLoading, setIsLoading] = useState(false)
  const onSubmit:SubmitHandler<Inputs> =async (data:Inputs) =>{
      setIsLoading(true)
      const {email ,password} = data;
      const API = import.meta.env.VITE_API_URL as string ;
    try{
        const response = await fetch(`${API}/users/login`,{
          method:"POST",
          headers:{
            "Content-type":"application/json"
          },
          body:JSON.stringify({email,password})
        })
        const data = await response.json() as ApiResponse;
        if(!response.ok){
            toast.error("something wrrong ",{
              duration:2000
            })
            setIsLoading(false)
            return
        }
        if(data.token){
          storeCookie("token",data.token)
          toast.success("login success",{
            duration:2000
          })
        }
        window.location.href = '/'
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    if(auth.isAuthenticated){
     navigate('/')
    }
  },[auth])
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <p className="text-center text-4xl font-black text-gray-900 ">AZ.</p>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
        </h2>
    </div>
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
                id='email'
                name='email'
                label='Email'
                placeholder='email@email.com'
                errors={errors}
                register={register}
                validation={
                    {
                        required: true,
                        pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/
                    }
                }
            />
            <Input
                id='password'
                name='password'
                label='Password'
                type='password'
                placeholder='********'
                errors={errors} register={register} validation={
                    {
                        required: true,
                        minLength: 8
                    }
                }
            />
            <Button type="submit" isLoading={isLoading}>Login</Button>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <a href="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                Register for free
            </a>
        </p>
    </div>
</div>
  )
}

