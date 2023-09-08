import "./Footer.scss"
import Image from 'next/image';
import Linkedin from "../../../public/icons8-linkedin-50 (1).png"
import Github from "../../../public/icons8-github-64.png"
import Email from "../../../public/icons8-email-50.png"

function Footer({footerRef}: any) {
  return (
    <footer className="footer_container">
      <div ref={footerRef} className="footer_text_container">
        <h3>La Raison</h3>
        <p className="footer_text">
          Mon ambition pour ce projet était de répondre à un besoin spécifique grâce à l&#39;intelligence artificielle. Je crois avoir atteint cet objectif. Chaque étudiant peut désormais progresser à son propre rythme. J&#39;espère que cela vous sera bénéfique et vous permettra d&#39;améliorer vos compétences, car c&#39;est clairement l&#39;essence même de ce projet.        
        </p>
        <p className="footer_contact">Contact</p>
        <div className="footer_contact_container">
          <a href="https://www.linkedin.com/in/israil-doukhaev-61a41a218/"><Image src={Linkedin} alt="icon linkedin" className="footer_contact_icon" /></a>
          <a href="https://github.com/TheTrikkster/exam-crafter"><Image src={Github} alt="icon github" className="footer_contact_icon" /></a>
          <a href="mailto:israilst67@gmail.com"><Image src={Email} alt="icon github" className="footer_contact_icon" /></a>
        </div>
      </div>
      <p>© 2023 Doukhaev Israil</p>
    </footer>
  )
}

export default Footer