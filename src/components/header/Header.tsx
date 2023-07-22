import "./Header.scss"
import image1 from "../../../public/image1.png"
import Image from 'next/image'

function Header() {
  return (
    <div className='header_container'>
        <h1>Exam Crafter</h1>
        <div className='header_texts_and_image_container'>
            <div>
                <h3>Désireux de vous entraîner,<br />mais perdu dans le processus ?</h3>
                <h3 className='header_move_subtitle'>Bienvenue, vous avez découvert <br />le carrefour de l&#39;entrainement personnalisé !</h3>
            </div>
            <Image src={image1} alt="" />
        </div>
    </div>
  )
}

export default Header