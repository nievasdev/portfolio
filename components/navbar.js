import {
	Link,
	Navbar as NextUINavbar,
	NavbarContent,
	NavbarMenu,
	NavbarMenuToggle,
	NavbarItem,
	NavbarMenuItem,
} from "@nextui-org/react";
import { useRouter } from 'next/router';
import { link as linkStyles } from "@nextui-org/theme";

import { siteConfig } from "../config/site";
import NextLink from "next/link";
import clsx from "clsx";

//import { ThemeSwitch } from "./theme-switch";
import {
	GithubIcon,
} from "./icons";


export const Navbar = () => {
	const router = useRouter();

	function handleScrollToSection(e, sectionId) {
		e.preventDefault(); // Evita el comportamiento de enlace predeterminado

		if(sectionId === "blogRef") router.replace('/blog');
		if(router.pathname === "/blog" && sectionId === "blogRef") return null;

		if (router.pathname === '/') {
		const targetElement = document.getElementById(sectionId); // Obtiene el elemento de destino por su ID

			if (targetElement) {
				window.scrollTo({
					top: targetElement.offsetTop, // Desplaza a la parte superior del elemento
					behavior: "smooth", // Agrega desplazamiento suave
				});
			}
		}
		else {
			router.replace('/#' + sectionId);
		}
	}


	return (
		<NextUINavbar maxWidth="2xl" position="sticky" className="backdrop-blur-sm bg-transparent text-white">
			<NavbarContent className="basis-1/5 sm:basis-full text-white" justify="start">
				<div className="hidden sm:flex gap-4 justify-start ml-2">
					{siteConfig.navItems.map((item) => (
						<NavbarItem key={item.href}>
							<NextLink
								className={clsx(
									linkStyles({ color: "foreground" }),
									"data-[active=true]:text-primary data-[active=true]:font-medium text-white"
								)}
								onClick={(e) => handleScrollToSection(e, item.id)}
								color="foreground"
								href={item.href}
							>
								{item.label}
							</NextLink>
						</NavbarItem>
					))}
				</div>
			</NavbarContent>

			<NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
				<NavbarItem className="hidden sm:flex gap-2">
					<Link isExternal href={siteConfig.links.github}>
						<GithubIcon className="text-default-500" />
					</Link>
					{/*<ThemeSwitch />*/}
				</NavbarItem>
			</NavbarContent>

			<NavbarContent className="sm:hidden basis-1 pl-4 text-white" justify="end">
				<Link isExternal href={siteConfig.links.github}>
					<GithubIcon className="text-default-500" />
				</Link>
				{/*<ThemeSwitch />*/}
				<NavbarMenuToggle />
			</NavbarContent>

			<NavbarMenu>
				<div className="mx-4 mt-2 flex flex-col gap-2 backdrop-blur-sm text-white">
					{siteConfig.navMenuItems.map((item, index) => (
						<NavbarMenuItem key={`${item}-${index}`}>
							<NextLink
								onClick={(e) => handleScrollToSection(e, item.id)}
								href={item.href}
							>
								{item.label}
							</NextLink>
						</NavbarMenuItem>
					))}
				</div>
			</NavbarMenu>
		</NextUINavbar>
	);
};
