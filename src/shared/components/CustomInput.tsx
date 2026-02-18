import React from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
    label?: string;
    icon?: React.ReactNode;
    error?: FieldError;
    register?: UseFormRegisterReturn;
    inputType?: "input" | "textarea" | "select";
    children?: React.ReactNode; 
    containerClassName?: string;
    labelClassName?: string;
    inputClassName?: string;
}

export default function CustomInput({
    label,
    icon,
    error,
    register,
    inputType = "input",
    children,
    containerClassName = "",
    labelClassName = "",
    inputClassName = "",
    ...props
}: CustomInputProps) {
    const baseInputClasses = error
        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
        : "";

    const mergedInputClassName = `${inputClassName} ${baseInputClasses}`.trim();

    return (
        <div className={containerClassName}>
            {label && (
                <label className={labelClassName}>
                    {icon && icon}
                    {label}
                </label>
            )}
            {inputType === "textarea" ? (
                <textarea
                    {...register}
                    {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                    className={mergedInputClassName}
                />
            ) : inputType === "select" ? (
                <select
                    {...register}
                    {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
                    className={mergedInputClassName}
                >
                    {children}
                </select>
            ) : (
                <input
                    {...register}
                    {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
                    className={mergedInputClassName}
                />
            )}
            {error && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                    {error.message}
                </p>
            )}
        </div>
    );
}
