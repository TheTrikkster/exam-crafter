import './page.scss';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import Head from '@/components/head/Head';
import { ThemeProvider } from './functions';
import { Fragment } from 'react';

export default function Home() {
  const textsMenu = [
    {
      title: 'Objectif du Projet',
      text: "Si vous êtes un étudiant qui cherche à s'entraîner et à s'améliorer, vous êtes au bon endroit. Ce projet est conçu pour tous les étudiants, qu'ils aient des difficultés et cherchent à progresser, ou qu'ils souhaitent simplement s'améliorer sur une partie précise de leur cours."
    },
    {
      title: 'Fonctionnement',
      text: "Le processus est très simple. Suivez les étapes, une fois finis l'IA créera un examen, ensuite vous pourrait changer les questions si nécessaire. Quand l'examen terminé, vous recevrez une correction. Veuillez noter que cette intelligence artificielle, bien qu'avancée, n'est pas infaillible. Il se peut qu'il y ait des erreurs occasionnelles, nous vous prions de nous excuser à l'avance si cela se produit."
    }
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
            {textsMenu.map((title, index) => {
              return (
                <div key={index}>
                  <h4 className="text-[#202020] text-4xl mb-5">
                    {title.title}
                  </h4>
                  <p className="text-[#202020] mt-5 font-thin">{title.text}</p>
                </div>
              );
            })}
          </div>
        </main>
        <Footer />
      </ThemeProvider>
    </Fragment>
  );
}
