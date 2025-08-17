import { Work, Project } from '@/types';

// Since we can't use fs on the client side, we'll import the data directly
// This is a temporary solution - in production you'd want to use API routes or static generation

// Private works data - not exported, only accessible through getWorks()
const worksDataEn: Work[] = [
  {
    name: "Antel",
    time: "2022 - Current",
    logo: "/logo_ancel.png",
    text: "Node.js microservices handling 3.5M daily transactions. Large-scale refactoring reduced deployment by 40%, errors by 99.9%. GitLab CI/CD with 85% test coverage.",
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
    text: "Built React dashboards consuming Node/Express APIs. Integrated GitHub & Jira for real-time cross-referenced reports. Agile/Scrum full lifecycle support.",
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
    text: "Migrated frontend from Zend PHP to React.js, improving load time by 60%. Git branching strategies for releases. Optimized SQL queries, reducing response by 40%.",
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
    text: "Developed custom JavaScript modules for ERP system, tailoring workflows to client needs across diverse industries. Responsive UI with HTML5/CSS3.",
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

// Spanish works data
const worksDataEs: Work[] = [
  {
    name: "Antel",
    time: "2022 - Actual",
    logo: "/logo_ancel.png",
    text: "Microservicios Node.js manejando 3.5M transacciones diarias. Refactorización a gran escala redujo despliegues 40%, errores 99.9%. GitLab CI/CD con 85% cobertura de pruebas.",
    largeText: [
      "Antel, la Administración Nacional de Telecomunicaciones, es una empresa estatal uruguaya responsable de brindar servicios de telecomunicaciones en Uruguay. Es el principal proveedor de servicios de telefonía fija y móvil, internet y televisión por cable del país. Fundada en 1974, Antel juega un papel clave en la infraestructura de comunicaciones en Uruguay, ofreciendo servicios tanto a nivel nacional como internacional.",
      "Mi crecimiento como desarrollador ha sido ayudado por dos ingenieros con muchos años de experiencia en Antel. Han proporcionado correcciones a mi código y recomendado cursos para mejorar mis habilidades."
    ],
    workMethod: "El método de trabajo involucra una reunión semanal para coordinar proyectos y prioridades.",
    projects: [
      {
        title: "Página en NextJs",
        text: "Un proyecto en Next.js desde cero con una base de datos SQLite, login, validaciones y un servicio de mensajería SMS."
      },
      {
        title: "Node",
        text: "Proyecto Node con autenticación y generación de códigos de seguridad."
      },
      {
        title: "Java a Node",
        text: "Migración de un proyecto de gestión de IP de Java a Node."
      },
      {
        title: "Jest",
        text: "Creación de Pruebas Unitarias en Jest"
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
    text: "Construí dashboards React consumiendo APIs Node/Express. Integré GitHub y Jira para reportes de referencia cruzada en tiempo real. Soporte completo del ciclo de vida Agile/Scrum.",
    largeText: [
      "Upshow es una empresa especializada en tecnología y plataformas interactivas diseñadas para mejorar el engagement e interacción en eventos en vivo y lugares públicos. Proporciona soluciones que permiten a establecimientos y organizadores mostrar contenido generado por usuarios en pantallas y monitores, creando una experiencia más atractiva para la audiencia y fomentando la participación en tiempo real.",
      "Mi crecimiento dentro de la empresa fue gracias a un equipo que me proporcionó retroalimentación, clases de inglés y cursos pagados de Udemy patrocinados por la empresa."
    ],
    workMethod: "Se utiliza metodología Scrum basada en solicitudes de un gerente.",
    projects: [
      {
        title: "Funcionalidad React",
        text: "Creación de pequeñas funcionalidades para proyectos React."
      },
      {
        title: "Node, GitHub y Jira",
        text: "Proyecto de integración de datos entre GitHub y Jira."
      },
      {
        title: "Elasticsearch",
        text: "Proyecto de automatización para análisis de datos en Elasticsearch."
      },
      {
        title: "Mostrar estado de servicios",
        text: "Proyecto que muestra el estado de nuestros servicios día a día y hora a hora."
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
    text: "Migré frontend de Zend PHP a React.js, mejorando tiempo de carga 60%. Estrategias de branching Git para releases. Optimicé consultas SQL, reduciendo respuesta 40%.",
    largeText: [
      "Hacknoid es una empresa orientada a la ciberseguridad que tiene una aplicación de pentesting automatizado."
    ],
    workMethod: "Reuniones ocasionales con el jefe.",
    projects: [
      {
        title: "Django, Python",
        text: "Creación de backend con Django Python."
      },
      {
        title: "Zend a React",
        text: "Migración de frontend de Zend Framework a React."
      },
      {
        title: "Pentesting automatizado",
        text: "Creación de módulos para pentesting en Python."
      }
    ],
    technologies: [
      { name: "Python", logo: "/logo_python.png" },
      { name: "JavaScript", logo: "/logo_javascript.png" },
      { name: "React", logo: "/logo_react.png" },
      { name: "Node", logo: "/logo_node.png" }
    ]
  },
  {
    name: "Gestion total",
    time: "2017 - 2018",
    logo: "/logo_gestionTotal.png",
    text: "Desarrollé módulos JavaScript personalizados para sistema ERP, adaptando flujos de trabajo a necesidades de clientes en diversas industrias. UI responsiva con HTML5/CSS3.",
    largeText: [
      "Gestion total vende funcionalidades en un ERPNext que se enfoca en la gestión administrativa de empresas.",
      "Mi crecimiento vino de resolver los pequeños desafíos que surgían en el trabajo"
    ],
    workMethod: "Encargos por clientes.",
    projects: [],
    technologies: [
      { name: "Python", logo: "/logo_python.png" },
      { name: "JavaScript", logo: "/logo_javascript.png" }
    ]
  }
];

// Private projects data - not exported, only accessible through getProjects()
const projectsDataEn: Project[] = [
  {
    name: "Meteor",
    time: "2022",
    logo: "/logo_meteor.png",
    text: "Stock management system for store inventory. Controls product brands, types, quantities & sales history with MongoDB database.",
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

// Spanish projects data
const projectsDataEs: Project[] = [
  {
    name: "Meteor",
    time: "2022",
    logo: "/logo_meteor.png",
    text: "Sistema de gestión de inventario para tienda. Controla marcas de productos, tipos, cantidades e historial de ventas con base de datos MongoDB.",
    largeText: [
      "Meteor es una plataforma de desarrollo web y móvil de código abierto que utiliza JavaScript tanto en el lado del cliente como del servidor, con un sistema de datos en tiempo real y una amplia gama de paquetes y bibliotecas de código abierto para facilitar la integración con otras tecnologías y servicios web."
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
    text: "Un sitio web basado en Flask con una base de datos PostgreSQL para las elecciones presidenciales de una comisión de profesores de física.",
    largeText: [
      "Flask es un framework web de Python que permite a los desarrolladores crear aplicaciones web de forma rápida y sencilla. Flask se considera un micro-framework, lo que significa que está diseñado para ser ligero y flexible, y no incluye componentes adicionales innecesarios.",
      "Flask proporciona las herramientas básicas para crear aplicaciones web, como enrutamiento de URL, gestión de cookies, soporte para plantillas Jinja2 y más. Aunque Flask se considera un framework de nivel principiante, es altamente escalable y extensible, y es utilizado por desarrolladores de todos los niveles de experiencia para crear aplicaciones web desde simples hasta complejas."
    ],
    github: "https://github.com/Mauro-js/test_python_flask",
    technologies: [
      { name: "Python", logo: "/logo_python.png" }
    ]
  }
];

// Get all works data based on language (synchronous for instant loading)
export function getWorks(language: 'en' | 'es' = 'en'): Work[] {
  return language === 'es' ? worksDataEs : worksDataEn;
}

// Get all projects data based on language (synchronous for instant loading)
export function getProjects(language: 'en' | 'es' = 'en'): Project[] {
  return language === 'es' ? projectsDataEs : projectsDataEn;
}

// Blog functionality removed - not implemented

// Get site configuration
export const siteConfig = {
  name: "Mauro Nievas - Portfolio",
  description: "Full Stack Developer Portfolio",
  navItems: [
    { label: "Home", href: "/", id: "home" },
    { label: "Works", href: "#works", id: "works" },
    { label: "Projects", href: "#projects", id: "projects" },
    { label: "About", href: "#about", id: "about" }
  ],
  navMenuItems: [
    { label: "Home", href: "/", id: "home" },
    { label: "Works", href: "#works", id: "works" },
    { label: "Projects", href: "#projects", id: "projects" },
    { label: "About", href: "#about", id: "about" }
  ],
  links: {
    github: "https://github.com/maurocardena",
    linkeding: "https://www.linkedin.com/in/mauro-nievas/"
  }
};