'use client';
import { useRef, createContext, useContext } from 'react';

export function useFooterRef() {
  return useRef<HTMLDivElement | null>(null);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ThemeContext = createContext<any>({
  current: ''
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ThemeProvider({ children }: any) {
  return (
    <ThemeContext.Provider value={useFooterRef()}>
      {children}
    </ThemeContext.Provider>
  );
}

export function TheContext() {
  const refFromContext = useContext(ThemeContext);
  if ('current' in refFromContext) {
    return <div ref={refFromContext}></div>;
  }
  return null;
}

export function ScrollToFooter(footerRef: React.RefObject<HTMLDivElement>) {
  if (footerRef.current) {
    footerRef.current.scrollIntoView({ behavior: 'smooth' });
  }
}
