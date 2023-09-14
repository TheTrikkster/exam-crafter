"use client"
import React, { useState } from 'react';
import "./Menu.scss";
import MenuIcon from "../../../public/menu.png";
import CloseIcon from "../../../public/effacer.png";
import Image from 'next/image';
import { ScrollToFooter } from '@/app/functions';
import { useContext } from "react";
import { ThemeContext } from "@/app/functions";

function Menu() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [closingMenu, setClosingMenu] = useState(false);
  const context:any = useContext(ThemeContext);


  const menuContainerClass = mobileMenu ? "menu_container_fixed" : "menu_container";
  const menuIconClass = mobileMenu ? "menu_icon_close" : "menu_icon";
  const closeIconClass = mobileMenu ? "menu_icon" : "menu_icon_close";
  const menuRightElementsClass = mobileMenu ? (closingMenu ? "menu_right_elements_container_animate" : "menu_right_elements_container_mobile") : "menu_right_elements_container";
  const menuPositionClass = `menu_elements_position  ${closingMenu ? "closing" : ""}`;

  const handleCloseMenu = () => {
    setClosingMenu(true);

    setTimeout(() => {
        setMobileMenu(false);
        setClosingMenu(false);
    }, 300);
  }

  return (
    <>
      <nav className={menuContainerClass}>
        <div className="header_fixed">
            <h2><a href="/">Exam Crafter</a></h2>
            <div className="menu_icon_container">
                <Image src={MenuIcon} alt="icon pour menu" className={menuIconClass} onClick={() => setMobileMenu(true)} />
                <Image src={CloseIcon} alt="icon pour fermer menu" className={closeIconClass} onClick={handleCloseMenu} />
            </div>
        </div>
        <ul  className={menuRightElementsClass}>
            <div className={menuPositionClass}>
                <li className="menu_element" onClick={() => {
                    ScrollToFooter(context)
                    setMobileMenu(false)
                }}>Pourquoi</li>
                <li><a href="/drafting" className="menu_element">Créer Exam</a></li>
                <li><a href="/" className="menu_element">Accueil</a></li>
            </div>
        </ul>
    </nav>
    <div className={`${mobileMenu ? "menu_if_position_fixed" : ""}`}></div>
    </>
  )
}

export default Menu;