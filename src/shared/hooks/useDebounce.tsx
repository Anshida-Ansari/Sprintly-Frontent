import { useEffect, useState } from "react";

export function useDebounce<T>(value:T,delay:500):T{
    const [debouncesValue,setDebouncedValue] = useState(value)

    useEffect(()=>{
        const handler = setTimeout(()=>setDebouncedValue(value),delay)
        return ()=>clearInterval(handler)
    },[value,delay])

    return debouncesValue
}