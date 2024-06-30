"use client";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import Menu from "@/components/menu/Menu";
import Footer from "@/components/footer/Footer";
import CreateExamOptions from "@/components/create_exam_options/CreateExamOptions";
import { useAppContext } from "../context";
import { useRouter } from "next/navigation";

export type OptionsSettingType = {
  bound_to: string;
  classe: string;
};

export type ShowPartsType = {
  [key: string]: boolean;
};

export type ChangedOptionType = {
  champ: string;
  value: string;
};

export const DraftingFunctions = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showParts, setShowParts] = useState<ShowPartsType>({
    classe: true,
    filiere: true,
    matiere: true,
    chapitre: true,
    questions: true,
  });
  const [changedOption, setChangedOption] = useState<ChangedOptionType>({
    champ: "",
    value: "",
  });
  const [collectedOptions, setCollectedOptions] = useState<string[][]>([]);
  const [optionsSetting, setOptionsSetting] = useState<OptionsSettingType>({
    bound_to: "Classe",
    classe: "",
  });
  const {
    selectedOptions,
    setSelectedOptions,
    setGeneratedQuestions,
    setNumberOfChange,
    setCanChangeAllQuestions,
    request,
  } = useAppContext();

  const differentParts = [
    {
      field: "classe",
      title: "Classe",
    },
    {
      field: "filiere",
      title: "Filière",
    },
    {
      field: "matiere",
      title: "Matière",
    },
    {
      field: "chapitre",
      title: "Chapitre",
    },
    {
      field: "questions",
      title: "Le nombre de questions",
    },
  ];

  useEffect(() => {
    localStorage.setItem("appState", JSON.stringify({}));
    const options = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/options?bound_to=${optionsSetting.bound_to}${
            optionsSetting.classe.length > 0
              ? `&classe=${optionsSetting.classe}`
              : ""
          }`,
        );

        if (!response.ok) {
          alert("La correction a échoué");
          throw new Error("La requête a échoué");
        }

        const data = await response.json();

        if (data && Array.isArray(data)) {
          setCollectedOptions((prevState) => [
            ...prevState,
            data.map((option) => option.name),
          ]);
        } else {
          console.error("La réponse du serveur n'est pas un tableau");
        }
      } catch (error) {
        console.error(error);
      }
    };

    options();
  }, [optionsSetting]);

  const confirmOptionChange = useCallback(() => {
    if (changedOption) {
      const showPartsKeys = Object.keys(showParts);
      const selectedOptionsKeys = Object.keys(selectedOptions);

      const BackToIndex = showPartsKeys.indexOf(changedOption.champ);

      const newShowParts = showPartsKeys.reduce(
        (acc, key, idx) => ({
          ...acc,
          [key]: idx >= BackToIndex,
        }),
        {},
      );

      const newSelectedPieces = selectedOptionsKeys.reduce(
        (acc, key, idx) => ({
          ...acc,
          [key]:
            idx > BackToIndex
              ? ""
              : key === changedOption.champ
                ? changedOption.value
                : selectedOptions[key],
        }),
        {},
      );

      const spliceOptions = collectedOptions.slice(0, BackToIndex + 1);

      setCollectedOptions(spliceOptions);
      setShowParts(newShowParts);
      setSelectedOptions(newSelectedPieces);
      setShowModal(false);
      setChangedOption({
        champ: "",
        value: "",
      });
      setGeneratedQuestions([]);
      setNumberOfChange(5);
      setCanChangeAllQuestions(true);
    }
  }, [
    changedOption,
    collectedOptions,
    selectedOptions,
    setCanChangeAllQuestions,
    setCollectedOptions,
    setGeneratedQuestions,
    setNumberOfChange,
    setSelectedOptions,
    setShowModal,
    showParts,
  ]);

  const cancelOptionChange = useCallback(() => {
    setShowModal(false);
  }, []);

  const createQuestions = async () => {
    setLoading(true);
    try {
      const questions = await request();

      if (questions && questions.length > 0) {
        router.push("show_questions");
      } else {
        alert("Une erreur est survenue essayer à nouveau");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // const checkStatus: (id: string) => object | string = async (id) => {
  //   try {
  //     const response = await fetch("/api/check", {
  //       method: "POST",
  //       body: JSON.stringify({ id }),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (!response.ok) {
  //       console.error("Erreur lors de la vérification du statut");
  //       return;
  //     }

  //     const data = await response.json();

  //     if (data.status === "pending") {
  //       await new Promise((resolve) => setTimeout(resolve, 3000));
  //       return await checkStatus(id);
  //     } else if (data.status === "ready") {
  //       return data.data;
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  if (loading) {
    return (
      <div className="Drafting_loading">
        <SyncLoader color="#34495E" size={18} />
        <p className="Drafting_loading_text">création</p>
      </div>
    );
  }

  return (
    <Fragment>
      <Menu />
      <main className="flex flex-col items-center">
        {showModal && (
          <div className="Drafting_modal">
            <div className="Drafting_modal_content">
              <p>
                Êtes-vous sûr de vouloir changer d&#39;option ? <br /> Cela
                supprimera ce que vous avez déjà fait.
              </p>
              <div className="Drafting_modal_buttons">
                <button onClick={confirmOptionChange}>Confirmer</button>
                <button onClick={cancelOptionChange}>Annuler</button>
              </div>
            </div>
          </div>
        )}
        <form
          onSubmit={createQuestions}
          method="post"
          className="w-1/2 bg-[#F3F4F6] flex flex-col items-center border-2 rounded my-12 p-8"
        >
          <h1 className="text-2xl my-8">Créer votre examen personnalisé</h1>

          {collectedOptions.map((options: string[], index: number) => (
            <CreateExamOptions
              key={index}
              part={differentParts[index]}
              options={options}
              showParts={showParts}
              setShowParts={setShowParts}
              setShowModal={setShowModal}
              setChangedOption={setChangedOption}
              setCollectedOptions={setCollectedOptions}
              setOptionsSetting={setOptionsSetting}
            />
          ))}
        </form>
      </main>
      <Footer />
    </Fragment>
  );
};
