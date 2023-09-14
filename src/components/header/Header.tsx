import "./Header.scss"
import Menu from "../menu/Menu";
import imageAccueil from "../../../public/image1.png"
import ImageBackground from "../../../public/background.jpg"
import ImageBackgroundMobile from "../../../public/background-mobile.jpg"
import Image from 'next/image'

function Header() {
  return (
    <>
      <header>
        <Menu/>
        <div className='header_container'>
          <Image src={ImageBackground} alt="un étudiant qui apprend" className="header_background_image" priority />
          <div className='header_texts_and_image_container'>
              <div className="header_title_container">
                  <h1>
                    Réalisez votre examen personnalisé avec l&#39;IA
                  </h1>
                  <p className="header_subtitle">Upload ton cours, génère un examen, puis après lavoir passé, reçoit une correction sans aucune inscription ni limite.</p>
                  <p className="header_start_button"><a href="/drafting">Commencer</a></p>
              </div>
              <Image src={ImageBackgroundMobile} alt="un étudiant qui apprend" className="header_background_image_mobile" priority />
              <Image src={imageAccueil} alt="un étudiant qui apprend" className="header_image"/>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header