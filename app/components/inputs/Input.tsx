"use client"

import clsx from "clsx";
import {
    FieldErrors,
    FieldValues,
    UseFormRegister,
} from "react-hook-form";

interface InputProps {
    label: string,
    id: string,
    type?: string,
    required?: boolean | string,
    register: UseFormRegister<FieldValues>,
    errors: FieldErrors,
    disabled?: boolean,
}

export default function Input({ label, id, type, required, register, errors, disabled }: InputProps) {
    return (
        <div>
            <label htmlFor={id}
                   className="block text-sm font-medium leading-6 text-gray-900">
                {label}
            </label>
            <div className="mt-2">
                <input type={type} id={id} autoComplete={id} disabled={disabled}
                       className={clsx(`form-input block w-full rounded-md border-0 py-1 
                       text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                        placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6`,
                           errors[id]?.message ? "focus:ring-error" : "focus:ring-sky-600",
                           disabled && "opacity-50 cursor-default",
                           )}
                       {...register(id, { required })}/>
                {errors[id] !== undefined && <p className="text-error">{errors[id]?.message?.toString()}</p>}
            </div>
        </div>
    )
}