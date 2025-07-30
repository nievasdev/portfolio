import { useRouter } from 'next/router';
import { useState } from 'react';
import { siteConfig } from "../config/site";
import NextLink from "next/link";
import clsx from "clsx";

import {
	GithubIcon,
	LinkedingLogo,
	HomeIcon
} from "./icons";

export const Navbar = () => {
	const router = useRouter();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	function handleScrollToSection(e, sectionId) {
		e.preventDefault();

		if(sectionId === "blogRef") router.replace('/blog');
		if(router.pathname === "/blog" && sectionId === "blogRef") return null;

		if (router.pathname === '/') {
		const targetElement = document.getElementById(sectionId);

			if (targetElement) {
				window.scrollTo({
					top: targetElement.offsetTop,
					behavior: "smooth",
				});
			}
		}
		else {
			router.replace('/#' + sectionId);
		}
	}

	return (
		<nav className="sticky top-0 z-50 backdrop-blur-sm bg-transparent text-white border-b border-gray-200/10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Desktop Navigation */}
					<div className="hidden sm:flex gap-4 justify-start ml-2">
						{siteConfig.navItems.map((item) => (
							<div key={item.href}>
								<NextLink
									className="text-white hover:text-blue-400 transition-colors px-3 py-2 rounded-md text-sm font-medium"
									onClick={(e) => handleScrollToSection(e, item.id)}
									href={item.href}
								>
									{item.label === "Home" ? <HomeIcon className="w-5 h-5" /> : item.label}
								</NextLink>
							</div>
						))}
					</div>

					{/* Desktop Right Side */}
					<div className="hidden sm:flex items-center gap-4">
						<a href={siteConfig.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
							<LinkedingLogo className="w-5 h-5" />
						</a>
						<a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
							<GithubIcon className="w-5 h-5" />
						</a>
					</div>

					{/* Mobile Right Side */}
					<div className="sm:hidden flex items-center gap-4">
						<a href={siteConfig.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
							<LinkedingLogo className="w-5 h-5" />
						</a>
						<a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
							<GithubIcon className="w-5 h-5" />
						</a>
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="text-white hover:text-blue-400 transition-colors p-2"
						>
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			{isMenuOpen && (
				<div className="sm:hidden bg-black/90 backdrop-blur-sm border-t border-gray-200/10">
					<div className="px-4 py-2 space-y-1">
						{siteConfig.navMenuItems?.map((item, index) => (
							<NextLink
								key={`${item}-${index}`}
								onClick={(e) => {
									handleScrollToSection(e, item.id);
									setIsMenuOpen(false);
								}}
								href={item.href}
								className="block px-3 py-2 text-white hover:text-blue-400 transition-colors"
							>
								{item.label}
							</NextLink>
						))}
					</div>
				</div>
			)}
		</nav>
	);
};