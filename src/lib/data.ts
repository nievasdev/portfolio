import { Work, Project, Blog } from '@/types';

// Since we can't use fs on the client side, we'll import the data directly
// This is a temporary solution - in production you'd want to use API routes or static generation

// Private works data - not exported, only accessible through getWorks()
const worksData: Work[] = [
  {
    name: "Antel",
    time: "2022 - Current",
    logo: "/logo_ancel.png",
    text: "Built Node.js microservices handling 3.5M daily transactions. Reduced deployment times by 40% and errors by 99.9%. Established CI/CD workflow with 85% test coverage.",
    largeText: [
      "Antel, the National Administration of Telecommunications, is a Uruguayan state-owned company responsible for providing telecommunications services in Uruguay. It is the main provider of fixed and mobile telephone services, internet, and cable television in the country. Founded in 1974, Antel plays a key role in the communications infrastructure in Uruguay, offering services both at a national and international level.",
      "My growth as a developer has been aided by two engineers with many years of experience at Antel. They have provided corrections to my code and recommended courses to enhance my skills."
    ],
    workMethod: "The working method involves a weekly meeting to coordinate projects and priorities.",
    projects: [
      {
        title: "Page in NextJs",
        text: "A project in Next.js from scratch with an SQLite database, login, validations, and an SMS messaging service."
      },
      {
        title: "Node",
        text: "Node project with authentication and generation of security codes."
      },
      {
        title: "Java to Node",
        text: "Migration of an IP management project from Java to Node."
      },
      {
        title: "Jest",
        text: "Creating Unit Tests in Jest"
      }
    ],
    technologies: [
      { name: "JavaScript", logo: "/logo_javascript.png" },
      { name: "React", logo: "/logo_react.png" },
      { name: "NextJs", logo: "/logo_next.png" },
      { name: "Node", logo: "/logo_node.png" }
    ]
  },
  {
    name: "Upshow",
    time: "2021 - 2022",
    logo: "/logo_upshow.png",
    text: "Built React dashboards with Node/Express APIs. Integrated GitHub/Jira for real-time team reports. Full lifecycle Agile/Scrum workflow.",
    largeText: [
      "Upshow is a company specialized in technology and interactive platforms designed to enhance engagement and interaction at live events and public venues. It provides solutions that allow establishments and organizers to display user-generated content on screens and monitors, creating a more engaging experience for the audience and encouraging real-time participation.",
      "My growth within the company was thanks to a team that provided me with feedback, English classes, and paid Udemy courses sponsored by the company."
    ],
    workMethod: "Scrum methodology is used based on requests from a manager.",
    projects: [
      {
        title: "React feature",
        text: "Creation of small features for React projects."
      },
      {
        title: "Node, GitHub and Jira",
        text: "Data integration project between GitHub and Jira."
      },
      {
        title: "Elasticsearch",
        text: "Automation project for data analysis in Elasticsearch."
      },
      {
        title: "Show services status",
        text: "Project that displays the status of our services day by day and hour by hour."
      }
    ],
    technologies: [
      { name: "JavaScript", logo: "/logo_javascript.png" },
      { name: "React", logo: "/logo_react.png" },
      { name: "Node", logo: "/logo_node.png" }
    ]
  },
  {
    name: "Hacknoid",
    time: "2018 - 2021",
    logo: "/logo_hacknoid.png",
    text: "Migrated frontend from Zend PHP to React.js (60% faster load time). Established Git branching strategies for releases/hotfixes. Optimized SQL queries (40% response time improvement). Developed maintainability tools.",
    largeText: [
      "Hacknoid is a cybersecurity-oriented company that has an automated pentesting application."
    ],
    workMethod: "Occasional meetings with the boss.",
    projects: [
      {
        title: "Django, Python",
        text: "Creation of backend with Django Python."
      },
      {
        title: "Zend to React",
        text: "Migration of frontend from Zend Framework to React."
      },
      {
        title: "Automated pentesting",
        text: "Creation of modules for pentesting in Python."
      }
    ],
    technologies: [
      { name: "python", logo: "/logo_python.png" },
      { name: "JavaScript", logo: "/logo_javascript.png" },
      { name: "React", logo: "/logo_react.png" },
      { name: "Node", logo: "/logo_node.png" }
    ]
  },
  {
    name: "Gestion total",
    time: "2017 - 2018",
    logo: "/logo_gestionTotal.png",
    text: "Developed custom JavaScript modules for ERP system across diverse industries. Implemented responsive UI layouts with HTML5/CSS3.",
    largeText: [
      "Gestion total sells features on an ERPNext which is focused on the administrative management of companies.",
      "My growth came from solving the small challenges that arose at work"
    ],
    workMethod: "Commissioned by clients.",
    projects: [],
    technologies: [
      { name: "python", logo: "/logo_python.png" },
      { name: "JavaScript", logo: "/logo_javascript.png" }
    ]
  }
];

// Private projects data - not exported, only accessible through getProjects()
const projectsData: Project[] = [
  {
    name: "Meteor",
    time: "2022",
    logo: "/logo_meteor.png",
    text: "This website is intended for stock management in a store, which allows control of the database of product brands, types, quantities, and sales history, all in a MongoDB database.",
    largeText: [
      "Meteor is an open-source web and mobile development platform that uses JavaScript on both the client and server sides, with a real-time data system and a wide range of open-source packages and libraries to facilitate integration with other web technologies and services."
    ],
    github: "https://github.com/Mauro-js/Meteor_practices",
    technologies: [
      { name: "JavaScript", logo: "/logo_javascript.png" },
      { name: "Node", logo: "/logo_node.png" }
    ]
  },
  {
    name: "Flask",
    time: "2023",
    logo: "/logo_flask.png", 
    text: "A Flask-based website with a PostgreSQL database for the presidential elections of a physics professors' commission.",
    largeText: [
      "Flask is a Python web framework that allows developers to quickly and easily create web applications. Flask is considered a micro-framework, which means that it is designed to be lightweight and flexible, and does not include unnecessary additional components.",
      "Flask provides the basic tools for creating web applications, such as URL routing, cookie management, support for Jinja2 templates, and more. Although Flask is considered a beginner-level framework, it is highly scalable and extensible, and is used by developers of all levels of experience to create web applications from simple to complex."
    ],
    github: "https://github.com/Mauro-js/test_python_flask",
    technologies: [
      { name: "python", logo: "/logo_python.png" }
    ]
  }
];

// Get all works data
export async function getWorks(): Promise<Work[]> {
  return worksData;
}

// Get all projects data  
export async function getProjects(): Promise<Project[]> {
  return projectsData;
}

// Get all blog data (for future use)
export async function getBlogs(): Promise<Blog[]> {
  return [];
}

// Get site configuration
export const siteConfig = {
  name: "Mauro Nievas - Portfolio",
  description: "Full Stack Developer Portfolio",
  navItems: [
    { label: "Home", href: "/", id: "home" },
    { label: "Works", href: "#works", id: "works" },
    { label: "Projects", href: "#projects", id: "projects" },
    { label: "About", href: "#about", id: "about" },
    { label: "Blog", href: "/blog", id: "blogRef" }
  ],
  navMenuItems: [
    { label: "Home", href: "/", id: "home" },
    { label: "Works", href: "#works", id: "works" },
    { label: "Projects", href: "#projects", id: "projects" },
    { label: "About", href: "#about", id: "about" },
    { label: "Blog", href: "/blog", id: "blogRef" }
  ],
  links: {
    github: "https://github.com/maurocardena",
    linkeding: "https://www.linkedin.com/in/mauro-nievas/"
  }
};