import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from "lucide-react";
import api from '../lib/axios'
import { useAuth } from "../context/AuthContext";
import strings from "../constants/strings";
import apis from "../constants/apis";

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [serverError, setServerError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setIsLoading(true)
        setServerError('')
        try {
            const response = await api.post(apis.register, data);
            login(response.data, response.data.token);
            navigate('/dashboard')
        } catch (error) {
            setServerError(error.response?.data?.message || 'Registration failed')
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="text-blue-600" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{strings.createAcc}</h2>
          <p className="text-gray-500 mt-2">{strings.joinSplittr}</p>
        </div>

        {serverError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{strings.fullName}</label>
            <input
              {...register("name", { required: "Name is required" })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="John Doe"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{strings.email}</label>
            <input
              {...register("email", { 
                required: strings.emailReq,
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{strings.password}</label>
            <input
              {...register("password", { 
                required: strings.passwordReq,
                minLength: { value: 6, message: "Must be at least 6 characters" }
              })}
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? strings.creatingAcc : strings.signUp}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {`${strings.alreadyAcc} `}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            {strings.signIn}
          </Link>
        </p>
      </div>
    </div>
    )
}

export default Register