"use client"

import { FaGoogle, FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";


export function GoogleSignInButton() {
    const handleClick = async () => {
        const signInResponse = await signIn("google", {
            redirect: false,
        });
        if (!signInResponse || signInResponse.error) {
            toast.error("Error while trying to log in, please try again later");
            console.log("error", signInResponse?.error);
        } else {
            toast.success("Successfully logged in via google");
        }
    };


    return (
        <button
            onClick={handleClick}
            className="btn btn-outline flex-1"
        >
            <FaGoogle/>
            {/*<span className="ml-4">Continue with Google</span>*/}
        </button>
    );
}

export function GithubSignInButton() {
    const handleClick = async () => {
        const signInResponse = await signIn("github", {
            redirect: false,
        });
        if (!signInResponse || signInResponse.error) {
            toast.error("Error while trying to log in, please try again later");
            console.log("error", signInResponse?.error);
        } else {
            toast.success("Successfully logged in via github");
        }
    };



    return (
        <button
            onClick={handleClick}
            className="btn btn-outline flex-1"
        >
            <FaGithub/>
            {/*<span className="ml-4">Continue with Github</span>*/}
        </button>
    );
}