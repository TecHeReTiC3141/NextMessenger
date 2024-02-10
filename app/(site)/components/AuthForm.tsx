"use client"

import { startTransition, useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "@/app/components/inputs/Input";
import SubmitBtn from "@/app/components/SubmitBtn";
import { GoogleSignInButton, GithubSignInButton } from "@/app/components/AuthButtons";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormSchema, RegisterFormSchema } from "@/app/lib/schema";
import { registerUser } from "@/app/(site)/actions";
import toast from "react-hot-toast";
import {signIn} from "next-auth/react";

type Variant = "LOGIN" | "REGISTER";

export default function AuthForm() {

    const [ variant, setVariant ] = useState<Variant>("LOGIN");

    // function toogleVariant() {
    //     setVariant(prev => prev === "REGISTER" ? "LOGIN" : "REGISTER");
    // }
    const toggleVariant = useCallback(() => {
        if (variant === "LOGIN") {
            setVariant("REGISTER");
        } else {
            setVariant("LOGIN");
        }
    }, [ variant ]);

    const {
        register,
        handleSubmit,
        formState: { errors, isLoading },
        control,
        reset,

    } = useForm<FieldValues>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
        resolver: zodResolver(variant === "LOGIN" ? LoginFormSchema : RegisterFormSchema),
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        if (variant === "REGISTER") {
            const isReg = await registerUser(data as FormData);
            if (isReg) {
                toast.success("You've successfully created your account! Now you can login")
                reset();
                toggleVariant();
            } else {
                toast.error("Something went wrong");
            }
        } else if (variant === "LOGIN") {
            const signInResponse = await signIn("credentials", {
                ...data,
                redirect: false,
            });
            if (!signInResponse || signInResponse.error) {
                toast.error("Could not log you in. Please, check you credentials");
                return;
            }
            toast.success("Successfully logged in!");
        }
    }

    function socialAction(action: string) {

    }

    console.log(errors);

    return (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {variant === "REGISTER" && (
                        <Input label="Name" id="name" type="text" register={register} errors={errors}/>
                    )}
                    <Input label="Email" id="email" type="email" register={register} errors={errors}/>
                    <Input label="Password" id="password" type="password" register={register} errors={errors}/>
                    <SubmitBtn className="btn-block" control={control}>{variant === "LOGIN" ? "Log in" : "Register"}</SubmitBtn>
                </form>
                <div className="divider text-sm">Or continue with</div>
                <div className="flex gap-3">
                    <GoogleSignInButton/>
                    <GithubSignInButton/>
                </div>
                <div className="flex gap-2 justify-center mt-4">

                    <p>{variant === "LOGIN" ? "New to messenger?" : "Already have an account?"}</p>
                    <button className="underline cursor-pointer" onClick={toggleVariant}>
                        {variant === "LOGIN" ? "Register" : "Login"}
                    </button>
                </div>
            </div>
        </div>
    )
}