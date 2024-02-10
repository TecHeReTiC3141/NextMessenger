"use client"

import React, {ComponentProps} from "react";
import clsx from "clsx";
import { Control, useFormState } from "react-hook-form";


type SubmitBtnProps = {
    children: React.ReactNode,
    className?: string,
    control: Control,
} & ComponentProps<"button">

export default function SubmitBtn({children, className, control}: SubmitBtnProps) {
    const {isSubmitting} = useFormState({ control });

    return (
        <button id="submit-btn" className={clsx(["btn btn-primary", className])} disabled={isSubmitting}>{children}{
            isSubmitting && <span className="loading loading-spinner text-info"></span>
        }</button>
    )
}