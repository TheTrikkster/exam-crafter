import "./Header.scss";
import Menu from "../menu/Menu";
import imageAccueil from "../../../public/image1.png";
import ImageBackground from "../../../public/background.jpg";
import ImageBackgroundMobile from "../../../public/background-mobile.jpg";
import Image from "next/image";

function Header() {
  return (
    <header>
      <Menu />
      <div className="Header_container">
        <Image
          src={ImageBackground}
          alt="un étudiant qui apprend"
          className="Header_background_image"
          priority
        />
        <div className="Header_texts_and_image_container">
          <div className="Header_title_container">
            <h1>Réalisez votre examen personnalisé avec l&#39;IA</h1>
            <p className="Header_subtitle">
              Upload ton cours, génère un examen, puis après l&#39;avoir passé,
              reçois une correction sans aucune inscription ni limite.
            </p>
            <p className="Header_start_button_container">
              <a href="/drafting" className="Header_start_button">
                Commencer
              </a>
            </p>
          </div>
          <Image
            src={ImageBackgroundMobile}
            alt="un étudiant qui apprend"
            className="Header_background_image_mobile"
            priority
          />
          <Image
            src={imageAccueil}
            alt="un étudiant qui apprend"
            className="Header_image"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
