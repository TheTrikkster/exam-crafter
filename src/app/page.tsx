"use client";
import { useRef } from 'react';
import './page.scss'
import Headers from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import Head from 'next/head';

export default function Home() {
  const footerRef = useRef<HTMLDivElement | null>(null);

  function scrollToFooter() {
    if (footerRef.current) {
      footerRef.current.scrollIntoView({ behavior: 'smooth' });
    }  
  }

  return (
      <>
        <Head>
          <meta name="description" content="Créez un examen personnalisé à partir d'une leçon fournir. L'IA génère un examen basé sur la leçon pour aider les étudiants à s'entraîner et à s'améliorer." />
          <meta name="keywords" content="IA, examen personnalisé, entraînement étudiant, amélioration des compétences"/>
          <meta property="og:title" content="Exeam Crafter" />
          <meta property="og:description" content="Créez un examen personnalisé à partir d'une leçon fournir. L'IA génère un examen basé sur la leçon pour aider les étudiants à s'entraîner et à s'améliorer." />
          <meta property="og:image" content="URL_DE_VOTRE_IMAGE" /> {/* Si vous avez une image représentative pour votre site */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="URL_COMPLET_DE_LA_PAGE" /> {/* Mettre l'url de la page d'accueil */}
        </Head>
        <Headers scrollToFooter={scrollToFooter} />
        <main className='main_container'>
          <div className='main_explication_container'>
            <h2>Tout ce que vous devez savoir</h2>
            <ol>
              <li>
                <h4>Objectif du Projet</h4>
                <p>
                  Si vous êtes un étudiant qui cherche à s&#39;entraîner et à s&#39;améliorer, vous êtes au bon endroit. Ce projet est conçu pour tous les étudiants, qu&#39;ils aient des difficultés et cherchent à progresser, ou qu&#39;ils souhaitent simplement s&#39;améliorer sur une partie précise de leur cours.
                </p>
              </li>
              <li>
                <h4>Fonctionnement</h4>
                <p>
                  Le processus est très simple. Vous allez pouvoir créer votre propre examen en fournissant une leçon et en choisissant le niveau de difficulté. À partir de cette leçon, une intelligence artificielle créera un examen composé de dix questions. Une fois l&#39;examen terminé, vous recevrez une correction détaillée. Veuillez noter que cette intelligence artificielle, bien qu&#39;avancée, n&#39;est pas infaillible. Il se peut qu&#39;il y ait des erreurs occasionnelles, et nous vous prions de nous excuser à l&#39;avance si cela se produit.
                </p>
              </li>
              <li>
                <h4>Prérequis</h4>
                <p>
                  Pour créer votre examen, vous devez simplement fournir une leçon sous forme de pdf, ou vous avez la possibilité de l&#39;écrire à la main. Pour commencer, il vous suffit d&#39;appuyer sur &quot;Commencer&quot;.
                </p>
              </li>
            </ol>
          </div>
        </main>
        <Footer footerRef={footerRef} />
      </>
  )
}
