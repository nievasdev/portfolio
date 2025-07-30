'use client';

import React, { useState } from 'react';
import {
  Link,
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarItem,
  NavbarMenuItem,
  linkStyles,
} from "./ui";
import { siteConfig } from "@/lib/data";
import { clsx } from "clsx";
import {
  GithubIcon,
  LinkedingLogo,
  HomeIcon
} from "./icons";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault(); // Evita el comportamiento de enlace predeterminado

    if (sectionId === "blogRef") {
      window.location.href = '/blog';
      return;
    }

    if (window.location.pathname === '/') {
      const targetElement = document.getElementById(sectionId); // Obtiene el elemento de destino por su ID

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop, // Desplaza a la parte superior del elemento
          behavior: "smooth", // Agrega desplazamiento suave
        });
      }
    } else {
      window.location.href = '/#' + sectionId;
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <NextUINavbar maxWidth="2xl" position="sticky" className="backdrop-blur-sm bg-[#1a1a1a] text-white">
      <NavbarContent className="basis-1/5 sm:basis-full text-white" justify="start">
        {/* Navigation items only visible on mobile */}
      </NavbarContent>

      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal href={siteConfig.links.linkeding}>
            <LinkedingLogo className="text-default-500" />
          </Link>
          <Link isExternal href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          {/*<ThemeSwitch />*/}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4 text-white" justify="end">
        <Link isExternal href={siteConfig.links.linkeding}>
          <LinkedingLogo className="text-default-500" />
        </Link>
        <Link isExternal href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        {/*<ThemeSwitch />*/}
        <NavbarMenuToggle
          isOpen={isMenuOpen}
          onToggle={toggleMenu}
        />
      </NavbarContent>

      <NavbarMenu isOpen={isMenuOpen}>
        <div className="mx-4 mt-2 flex flex-col gap-2 backdrop-blur-sm text-white">
          {siteConfig.navMenuItems.map((item, index) => {
            return (
              <NavbarMenuItem key={`${item.label}-${index}`}>
                <a
                  onClick={(e) => {
                    handleScrollToSection(e, item.id);
                    setIsMenuOpen(false); // Close menu after click
                  }}
                  href={item.href}
                  className="cursor-pointer"
                >
                  {item.label}
                </a>
              </NavbarMenuItem>
            );
          })}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
}