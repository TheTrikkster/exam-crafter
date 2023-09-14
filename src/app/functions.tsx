"use client"
import { useRef, createContext, useContext } from "react";

export function useFooterRef() {
    return useRef<HTMLDivElement | null>(null);
  }
 
export const ThemeContext = createContext<React.RefObject<HTMLDivElement> | {} >({current: ""})
 
export function ThemeProvider({ children }: any) {
    return <ThemeContext.Provider value={useFooterRef()}>{children}</ThemeContext.Provider>
  }

export function TheContext() {
    const refFromContext = useContext(ThemeContext);
    if ("current" in refFromContext) {
        return <div ref={refFromContext}></div>;
    } else {
        return <div></div>;
      }  
  }

export function ScrollToFooter(footerRef: React.RefObject<HTMLDivElement>) {
    if (footerRef.current) {
      footerRef.current.scrollIntoView({ behavior: 'smooth' });
    }  
  }
