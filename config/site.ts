export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "MN",
	navItems: [
		{
			label: "Home",
			id: "homeRef",
			href: "/",
		},
		{
			label: "Works",
			id: "worksRef",
			href: "#worksRef",
		},
		{
			label: "Projects",
			id: "projectsRef",
			href: "#projectsRef",
		},
		{
			label: "About",
			id: "meRef",
			href: "#meRef",
		},
	],
	navMenuItems: [
		{
			label: "Home",
			id: "homeRef",
			href: "/",
		},
		{
			label: "Works",
			id: "worksRef",
			href: "#worksRef",
		},
		{
			label: "Projects",
			id: "projectsRef",
			href: "#projectsRef",
		}
	],
	links: {
		github: "https://github.com/Mauro-js",
		linkeding: "https://www.linkedin.com/in/mauro-nievas-11b0bb11b/",
	},
};
