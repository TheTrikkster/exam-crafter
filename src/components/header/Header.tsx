import "./Header.scss"
import Menu from "../menu/Menu";
import imageAccueil from "../../../public/image1.png"
import ImageBackground from "../../../public/background.jpg"
import ImageBackgroundMobile from "../../../public/background-mobile.jpg"
import Image from 'next/image'

type HeaderType = {
  scrollToFooter: () => void
}

function Header({scrollToFooter}: HeaderType) {

  return (
    <>
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