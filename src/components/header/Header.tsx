import "./Header.scss"
import image1 from "../../../public/image1.png"
import Image from 'next/image'
// import Head from 'next/head';

function Header() {
  return (
    <div className='header_container'>
      {/* <Head>
        <title>Créez votre examen</title>
        <meta name="description" content="Une page pour créer un examen basé sur votre leçon. Uploadez un fichier ou entrez le texte manuellement." />
      </Head> */}
        <h1>Exam Crafter</h1>
        <div className='header_texts_and_image_container'>
            <div className="header_title_container">
                <h3>Désireux de vous entraîner,<br />mais perdu dans le processus ?</h3>
                <div className="header_move_subtitle_container">
                  <h3 className='header_move_subtitle'>Bienvenue, vous avez découvert</h3>
                  <h3 className='header_move_subtitle_second_part'>le carrefour de l&#39;entrainement personnalisé !</h3>
                </div>
            </div>
            <Image src={image1} alt="un étudiant qui apprend" width={330} className="header_image"/>
        </div>
    </div>
  )
}

export default Header