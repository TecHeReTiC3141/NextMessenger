"use client"

import { FaGoogle, FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";


export function GoogleSignInButton() {
    const handleClick = async () => {
        await signIn("google", {
            callbackUrl: "/",
        });
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
        await signIn("github", {
            callbackUrl: "/",
        });
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