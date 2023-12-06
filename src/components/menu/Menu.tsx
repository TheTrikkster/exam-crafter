"use client";
import React, { Fragment, useState } from "react";
import "./Menu.scss";
import MenuIcon from "../../../public/menu.png";
import CloseIcon from "../../../public/effacer.png";
import Image from "next/image";
import { ScrollToFooter } from "@/app/functions";
import { useContext } from "react";
import { ThemeContext } from "@/app/functions";

function Menu() {
  const [mobileMenu, setMobileMenu] = useState<boolean>(false);
  const [closingMenu, setClosingMenu] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const context: any = useContext(ThemeContext);

  const menuContainerClass = mobileMenu
    ? "Menu_container_fixed"
    : "Menu_container";
  const menuIconClass = mobileMenu ? "Menu_icon_close" : "Menu_icon";
  const closeIconClass = mobileMenu ? "Menu_icon" : "Menu_icon_close";
  const menuRightElementsClass = mobileMenu
    ? closingMenu
      ? "Menu_right_elements_container_animate"
      : "Menu_right_elements_container_mobile"
    : "Menu_right_elements_container";
  const menuPositionClass = `Menu_elements_position  ${
    closingMenu ? "closing" : ""
  }`;

  const handleCloseMenu = () => {
    setClosingMenu(true);

    setTimeout(() => {
      setMobileMenu(false);
      setClosingMenu(false);
    }, 300);
  };

  const handleClick = () => {
    ScrollToFooter(context);
    setMobileMenu(false);
  };

  return (
    <Fragment>
      <nav className={menuContainerClass}>
        <div className="Menu_header_fixed">
          <h2>
            <a href="/">Exam Crafter</a>
          </h2>
          <div className="Menu_icon_container">
            <Image
              src={MenuIcon}
              alt="icon pour menu"
              className={menuIconClass}
              onClick={() => setMobileMenu(true)}
            />
            <Image
              src={CloseIcon}
              alt="icon pour fermer menu"
              className={closeIconClass}
              onClick={handleCloseMenu}
            />
          </div>
        </div>
        <ul className={menuRightElementsClass}>
          <div className={menuPositionClass}>
            <li className="Menu_element" onClick={handleClick}>
              Pourquoi
            </li>
            <li>
              <a href="/drafting" className="Menu_element">
                Créer Exam
              </a>
            </li>
            <li>
              <a href="/" className="Menu_element">
                Accueil
              </a>
            </li>
          </div>
        </ul>
      </nav>
      <div className={mobileMenu ? "Menu_if_position_fixed" : ""}></div>
    </Fragment>
  );
}

export default Menu;
