"use client"
import { useState, useEffect } from "react";
import { signInWithOauth, handleLogin, handleLogout, getCurrentUser, handleSignUp  } from "./utils/authUtil"
import { useRouter } from "next/navigation";

import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/client";

export default function AuthPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [user, setUser] = useState<User | null | undefined>(null);

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const runAsync = async () => {
            const checkUser = async() => {
                const response = await getCurrentUser();
                if(response.error){
                    setError(response.error);
                } else{
                    setUser(response.user);
                }
            }
            checkUser();
        };
        runAsync().finally(() => setIsLoading(false));
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            let result
            if (isLoggedIn) {
                result = await handleLogin(email, password);
            } else {
                result = await handleSignUp(email, password);
            }
            if (result.success) {
                setUser(result.user);
                router.push("/dashboard");
            }
        } catch {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleOAuthSignIn = async (provider: 'google') => {
        setIsLoading(true)
        const result = await signInWithOauth(provider)
        if(!result.success) {
            setError(result.error || 'OAuth sign-in failed');
        }
        setIsLoading(false);
    }

    const handleSignOut = async () => {
        setIsLoading(true);
        const result = await handleLogout();
        if (result.success) {
            setUser(null);
            router.push("/");
        } else {
            setError(result.error || "Logout failed");
        }
        setIsLoading(false);
    }

    if (user) {
        setTimeout(() => {
            router.push("/dashboard");
        }, 2000);
        return (
            <div className="min-h-screen flex items-center justify-center bg-amber-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md border-4 border-black bg-white w-full space-y-8">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome</h2>
                        <p className="mt-2 text-sm text-gray-600">You are logged in.</p>
                        <button
                            onClick={handleSignOut}
                            className="mt-4 mb-2 w-full flex border-black border-4 justify-center py-2 px-4 shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer" >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-amber-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center border-4 border-black rounded-sm bg-white p-6">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">{isLoggedIn ? "Sign In" : "Sign Up"}</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {isLoggedIn ? "Don't have an account?" : "Already have an account?"}{" "}
                        <button
                            onClick={() => setIsLoggedIn(!isLoggedIn)}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            {isLoggedIn ? "Sign Up" : "Sign In"}
                        </button>
                    </p>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div className="rounded-md  -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none relative block w-full px-3 py-2 border-2 mb-2 border-black placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none relative block w-full px-3 py-2 border-2 mb-2 border-black placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4  rounded-md  text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none border-3 border-black hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                disabled={isLoading}
                            >
                                {isLoading ? "Loading..." : isLoggedIn ? "Sign In" : "Sign Up"}
                            </button>
                        </div>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className=" bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={() => handleOAuthSignIn('google')}
                                className="w-full flex justify-center py-2 px-4 border-3 border-black hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                disabled={isLoading}
                            >
                                {isLoading ? "Loading..." : "Google"}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm">
                            {error}
                        </div>
                    )}
                </form>
                </div>
            </div>
        </div>
    )
}