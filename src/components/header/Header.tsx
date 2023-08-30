import "./Header.scss"
import image1 from "../../../public/image1.png"
import Image from 'next/image'
import Head from 'next/head';

type HeaderType = {
  description: string,
  keywords: string
}

function Header({description, keywords}:HeaderType) {

  // <meta name="description" content="Répondez à la question pour progresser dans l'examen. Chaque réponse est importante pour votre évaluation finale." />
  // <meta name="keywords" content="examen, question, IA, examen personnalisé"/>

  // <meta name="description" content="Consultez le résultat de votre examen, y compris les corrections, les commentaires et la note finale." />
  // <meta name="keywords" content="résultat, examen, correction, commentaire, note"/>


  return (
    <>
      <Head>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords}/>
        <meta property="og:title" content="Exeam Crafter" />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="URL_DE_VOTRE_IMAGE" /> {/* Si vous avez une image représentative pour votre site */}
        <meta property="og:type" content="website" />
      </Head>
      <header className='header_container'>
        <h1>Exam Crafter</h1>
        <div className='header_texts_and_image_container'>
            <div className="header_title_container">
                <h3>Désireux de vous entraîner,<br />mais perdu dans le processus ?</h3>
                <div className="header_move_subtitle_container">
                  <h3 className='header_move_subtitle'>Bienvenue, vous avez découvert</h3>
                  <h3 className='header_move_subtitle_second_part'>le carrefour de l&#39;entrainement personnalisé !</h3>
                </div>
            </div>
            <div className="image-wrapper">
              <Image src={image1} alt="un étudiant qui apprend" width={330} className="header_image"/>
            </div>
        </div>
      </header>
    </>
  )
}

export default Header