"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { isAbortError } from "./show_questions/functions";

export type SelectedOptionsType = {
  [key: string]: string;
};

export type AppContextType = {
  selectedOptions: SelectedOptionsType;
  setSelectedOptions: (
    value:
      | SelectedOptionsType
      | ((prevState: SelectedOptionsType) => SelectedOptionsType),
  ) => void;
  generatedQuestions: string[];
  setGeneratedQuestions: (
    value: string[] | ((prevState: string[]) => string[]),
  ) => void;
  numberOfChange: number;
  setNumberOfChange: (value: number | ((prevState: number) => number)) => void;
  canChangeAllQuestions: boolean;
  setCanChangeAllQuestions: (
    value: boolean | ((prevState: boolean) => boolean),
  ) => void;
  disableChange: boolean;
  setDisableChange: (
    value: boolean | ((prevState: boolean) => boolean),
  ) => void;
  request: () => Promise<string[] | undefined>;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppWrapper({ children }: { children: ReactNode }) {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptionsType>({
    classe: "",
    filiere: "",
    matiere: "",
    chapitre: "",
    questions: "",
  });
  const [generatedQuestions, setGeneratedQuestions] = useState<string[]>([]);
  const [numberOfChange, setNumberOfChange] = useState<number>(5);
  const [canChangeAllQuestions, setCanChangeAllQuestions] =
    useState<boolean>(true);
  const [disableChange, setDisableChange] = useState<boolean>(false);

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("appState") || "{}");
    if (Object.keys(savedState).length > 0) {
      setGeneratedQuestions(savedState.generatedQuestions || []);
      setNumberOfChange(savedState.numberOfChange ?? 5);
      setCanChangeAllQuestions(savedState.canChangeAllQuestions ?? true);
      setDisableChange(savedState.disableChange ?? false);
      setSelectedOptions(
        savedState.selectedOptions || {
          classe: "",
          filiere: "",
          matiere: "",
          chapitre: "",
          questions: "",
        },
      );
    }
  }, []);

  useEffect(() => {
    const appState = {
      generatedQuestions,
      numberOfChange,
      canChangeAllQuestions,
      disableChange,
      selectedOptions,
    };
    localStorage.setItem("appState", JSON.stringify(appState));
  }, [
    generatedQuestions,
    numberOfChange,
    canChangeAllQuestions,
    disableChange,
    selectedOptions,
  ]);

  const request = useCallback(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);
    try {
      const response = await fetch("http://localhost:3001/create-exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedOptions),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error("La requête a échoué");

      const questions = await response.json();

      if (questions.error) throw new Error(questions.error);

      setGeneratedQuestions(questions);

      return questions;
    } catch (error: unknown) {
      if (isAbortError(error)) {
        console.error("La requête a été annulée à cause du délai d'expiration");
      } else if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Une erreur inconnue est survenue");
      }
    }
  }, [selectedOptions]);

  return (
    <AppContext.Provider
      value={{
        selectedOptions,
        setSelectedOptions,
        generatedQuestions,
        setGeneratedQuestions,
        numberOfChange,
        setNumberOfChange,
        canChangeAllQuestions,
        setCanChangeAllQuestions,
        disableChange,
        setDisableChange,
        request,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error("useAppContext must be used within an AppWrapper");
  }
  return context;
}
