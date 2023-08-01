'use client'

import { createContext, useContext, Dispatch, SetStateAction, useState } from "react"


type ContextType = {
    text: string,
    setText: Dispatch<SetStateAction<string>>
}


const GlobalContext = createContext<ContextType>({
    text: "",
    setText: (): string => ""
})

export const GlobalContextProvider = ({ children }:any) => {
    const [text, setText] = useState<string>("Hello world")

    return (
        <GlobalContext.Provider value={{ text, setText }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => useContext(GlobalContext)