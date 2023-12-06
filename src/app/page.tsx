import "./page.scss";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Head from "@/components/head/Head";
import { ThemeProvider } from "./functions";
import { Fragment } from "react";

export default function Home() {
  const textsMenu = [
    {
      title: "Objectif du Projet",
      text: "Si vous êtes un étudiant qui cherche à s'entraîner et à s'améliorer, vous êtes au bon endroit. Ce projet est conçu pour tous les étudiants, qu'ils aient des difficultés et cherchent à progresser, ou qu'ils souhaitent simplement s'améliorer sur une partie précise de leur cours.",
    },
    {
      title: "Fonctionnement",
      text: "Le processus est très simple. Vous allez pouvoir créer votre propre examen en fournissant une leçon ou en indiquant sur quoi vous souhaitez passer l'examen. À partir de cette leçon, une intelligence artificielle créera un examen composé de dix questions. Une fois l'examen terminé, vous recevrez une correction détaillée. Veuillez noter que cette intelligence artificielle, bien qu'avancée, n'est pas infaillible. Il se peut qu'il y ait des erreurs occasionnelles, et nous vous prions de nous excuser à l'avance si cela se produit.",
    },
    {
      title: "Prérequis",
      text: "Pour créer votre examen, vous devez simplement fournir une leçon sous forme de pdf, ou vous avez la possibilité de le rédiger à la main, vous avez également la possibilité d'indiquer simplement le thème de l'examen que vous souhaitez. Pour commencer, il vous suffit d'appuyer sur << Commencer >>.",
    },
  ];

  return (
    <Fragment>
      <Head
        title="Exam Crafter: Créez des examens personnalisés avec l'IA à partir de vos leçons"
        description="Créez un examen personnalisé à partir d'une leçon fournir. L'IA génère un examen basé sur la leçon pour aider les étudiants à s'entraîner et à s'améliorer."
        keywords="IA, examen personnalisé, entraînement étudiant, amélioration des compétences"
      />
      <ThemeProvider>
        <Header />
        <main className="Home_container">
          <div className="Home_explication_container">
            <h2>Tout ce que vous devez savoir</h2>
            <ol>
              {textsMenu.map((title, index) => {
                return (
                  <li key={index}>
                    <h4>{title.title}</h4>
                    <p>{title.text}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </main>
        <Footer />
      </ThemeProvider>
    </Fragment>
  );
}
