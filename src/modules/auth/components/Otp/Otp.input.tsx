// components/OtpInput.tsx
import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";

interface OtpInputProps {
    length?: number; // Default 6
    onChange: (otp: string) => void;
    error?: boolean;
}

export interface OtpInputRef {
    clear: () => void;
    focus: () => void;
}

const OtpInput = forwardRef<OtpInputRef, OtpInputProps>(({ length = 6, onChange, error = false }, ref) => {
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    useImperativeHandle(ref, () => ({
        clear: () => {
            setOtp(new Array(length).fill(""));
            inputRefs.current[0]?.focus();
        },
        focus: () => {
            inputRefs.current[0]?.focus();
        },
    }));

    const handleChange = (index: number, value: string) => {
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        onChange(newOtp.join(""));

        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
        if (!pasted) return;

        const newOtp = [...otp];
        pasted.split("").forEach((char, i) => {
            if (i < length) newOtp[i] = char;
        });
        setOtp(newOtp);
        onChange(newOtp.join(""));

        const nextFocus = Math.min(pasted.length, length - 1);
        inputRefs.current[nextFocus]?.focus();
    };

    return (
        <div onPaste={handlePaste} className="flex justify-center gap-3">
            {otp.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => {
                        inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-12 h-14 text-center text-2xl font-semibold border-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${error
                            ? "border-red-400 bg-red-50"
                            : digit
                                ? "border-indigo-500 bg-indigo-50"
                                : "border-gray-300 hover:border-gray-400"
                        }`}
                />
            ))}
        </div>
    );
});

OtpInput.displayName = "OtpInput";

export default OtpInput;