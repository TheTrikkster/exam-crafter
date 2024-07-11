import './Footer.scss';
import Image, { StaticImageData } from 'next/image';
import Linkedin from '../../../public/linkedin.png';
import Github from '../../../public/github.png';
import Email from '../../../public/email.png';
import { TheContext } from '@/app/functions';

type ContactType = {
  src: StaticImageData;
  href: string;
  alt: string;
};

function Footer() {
  const contact = [
    {
      src: Linkedin,
      href: 'https://www.linkedin.com/in/israil-doukhaev-61a41a218/',
      alt: 'icon linkedin'
    },
    {
      src: Github,
      href: 'https://github.com/TheTrikkster/exam-crafter',
      alt: 'icon github'
    },
    {
      src: Email,
      href: 'mailto:israilst67@gmail.com',
      alt: 'icon email'
    }
  ];

  return (
    <footer className="Footer_container mt-auto">
      <div className="Footer_text_container">
        <TheContext />
        <div>
          <h3>Ma Mission</h3>
          <p className="Footer_text font-thin">
            Inspiré par mon propre parcours d&#39;apprentissage, j&#39;ai crée
            ce site pour rendre la préparation aux examens plus efficace.
            Croyant en une éducation individualisée, j&#39;invite chacun à se
            joindre à moi dans cette aventure passionnante pour un apprentissage
            personnalisé et réussi !
          </p>
        </div>
        <div>
          <p className="Footer_contact">Contact</p>
          <div className="Footer_contact_container">
            {contact.map((contact: ContactType, index) => (
              <a key={index} href={contact.href}>
                <Image
                  src={contact.src}
                  alt={contact.alt}
                  className="Footer_contact_icon"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
      <p>© 2023 Doukhaev Israil</p>
    </footer>
  );
}

export default Footer;
