import "./Header.scss"
import Menu from "../menu/Menu";
import imageAccueil from "../../../public/image1.png"
import ImageBackground from "../../../public/background.jpg"
import ImageBackgroundMobile from "../../../public/background-mobile.jpg"
import Image from 'next/image'
import Head from 'next/head';

type HeaderType = {
  description: string,
  keywords: string,
  scrollToFooter?: any
}

function Header({description, keywords, scrollToFooter}:HeaderType) {

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
      <header>
        <Menu scrollToFooter={scrollToFooter} />
        <div className='header_container'>
          <Image src={ImageBackground} alt="un étudiant qui apprend" className="header_background_image"/>
          <div className='header_texts_and_image_container'>
              <div className="header_title_container">
                  <h1>
                    <span className="line">Motivé pour vous</span>
                    <span className="line">entraîner,</span>
                    <span className="line">mais en quête du bon</span>
                    <span className="line">outil ?</span>
                  </h1>
                  <h2 className="header_subtitle">Plongez dans l&#39;univers de l&#39;entraînement personnalisé</h2>
                  {/* <div className="header_move_subtitle_container">
                    <h3 className='header_move_subtitle'>Plongez dans l&#39;univers de l&#39;entraînement personnalisé !</h3>
                  </div> */}
                  <p className="header_start_button"><a href="/drafting">Commencer</a></p>
              </div>
              <Image src={ImageBackgroundMobile} alt="un étudiant qui apprend" className="header_background_image_mobile"/>
              <Image src={imageAccueil} alt="un étudiant qui apprend" className="header_image"/>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header