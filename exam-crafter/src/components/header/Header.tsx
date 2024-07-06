import './Header.scss';
import Menu from '../menu/Menu';
import PhotoGallery from '../responsive_image/ResponsiveImage';

function Header() {
  return (
    <header>
      <Menu />
      <div className="Header_general-container flex flex-col justify-center items-center">
        <h1 className="Header_title text-center text-5xl mt-20 font-semibold">
          Préparez-vous aux éxamens avec <br /> l&#39;assistance de l&#39;IA
        </h1>
        <p className="text-center text-black mt-10">
          Découvrer l&#39;avenir de la préparation aux examens avec notre
          platforme alimenté par l&#39;IA. <br /> Créez des examens
          personnalisés pour vous entraîner et maximiser votre succès.
        </p>
        <button className="w-52 bg-[#E54C18] rounded-3xl p-3 mt-12 mb-20">
          <a href="/drafting" className="text-white">
            Commencer
          </a>
        </button>
      </div>
      <PhotoGallery />
    </header>
  );
}

export default Header;
