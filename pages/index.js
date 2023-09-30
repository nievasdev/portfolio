import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image'
import { Button } from "@nextui-org/react";
import ChangingContentAnimation from '../components/changingContenAnimation';
import Works from '../components/Works';
import Projects from '../components/Projects';
import MeSection from '../components/MeSection';
import { Divider } from "@nextui-org/react";

const responsiveButton = 'text-sm sm:text-base md:text-xl md:w-30 md:h-18 lg:text-2xl lg:w-34 lg:h-18 xl:text-2xl xl:w-38 xl:h-12 2xl:text-2xl 2xl:w-40 2xl:h-14 button-hover'

const Me = ({ backdrop }) => {
    let classMe = "flex flex-col z-40 place-items-center text-center scale-up-top backdrop-blur-sm p-3 rounded-lg";
    classMe += backdrop ? " minibackdrop" : "";

    return (
        <div className={classMe} >
            <ChangingContentAnimation />
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-5xl font-sans rotate-horizontal-center ">
                Developer
            </p>
        </div>
    );
};

const WorksButton = ({ width, scrollToSection }) => {
    const addClass = width < 350 ? ' sm:mr-16 scale-up-left mb-5' : ' mb-5 sm:mr-16 mr-5 scale-up-left';

    return <Button
        className={responsiveButton + addClass}
        onClick={() => scrollToSection('worksRef')}
        variant="solid"
        color="primary" >
        Works
    </Button>
}

const ProjectsButton = ({ width, scrollToSection }) => {
    const addClass = width < 350 ? ' mt-5 sm:ml-16 scale-up-right' : ' mt-5 ml-5 sm:ml-16 scale-up-right';

    return <Button
        className={responsiveButton + addClass}
        onClick={() => scrollToSection('projectsRef')}
        variant="solid"
        color="primary" >
        Projects
    </Button>
}

const MeButton = ({ color, width, scrollToSection }) => {
    const addClass = width < 350 ? ' sm:ml-16 scale-up-right' : ' mt-5 scale-up-right';

    return <Button
        className={responsiveButton + addClass}
        onClick={() => scrollToSection('meRef')}
        variant="solid"
        color={color} >
        Me
    </Button>
}

export default function IndexPage() {
    const [smallScreen, setSmallScreen] = useState(false);
    const [width, setWidth] = useState(700);
    const [less, setLess] = useState(700);

    const scrollToSection = (section) => {

        const targetElement = document.getElementById(section); // Obtiene el elemento de destino por su ID

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop, // Desplaza a la parte superior del elemento
                behavior: "smooth", // Agrega desplazamiento suave
            });
        }
    };

    const classNameText = 'grid gap-2 z-10';
    const classNameImage = "text-center blur-in";

    useEffect(() => {
        const hash = window.location.hash; // Obtén la parte después de '#'
        const idHash = hash.substring(1);

        if(idHash) {
            scrollToSection(idHash);
            //window.history.replaceState(null, null, window.location.pathname);
        }

        const handleResize = () => {
            const isSmallScreen = window.innerHeight < 780;

            setSmallScreen(isSmallScreen);
            setWidth(window.innerWidth);

            if (window.innerWidth > window.innerHeight) {

                setLess(isSmallScreen ? window.innerHeight : window.innerHeight - 200);
            } else {
                setLess(isSmallScreen ? window.innerWidth : window.innerWidth - 200);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();


        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <>
            <Divider className='hidden' id="homeRef" />
            <div className="h-full relative">
                <section  className="grid gap-2 mx-auto place-items-center m-2">
                    <div className={smallScreen ? classNameText + " absolute" : classNameText}>
                        <Me backdrop={smallScreen} />
                        <div className="z-10 text-center mt-16">
                            <div className={width < 350 ? 'flex flex-col scale-up-center mb-5' : 'scale-up-center mb-5'}>
                                <WorksButton width={width} scrollToSection={scrollToSection} />
                                <MeButton width={width} color="danger" scrollToSection={scrollToSection} />
                                <ProjectsButton width={width} scrollToSection={scrollToSection} />
                            </div>
                        </div>
                    </div>
                    <div className={smallScreen ? classNameImage : classNameImage + " pt-10 relative "} width={less} height={less + 200}
                    >
                        <Image
                            className='absolute opacity-10 rounded-lg z-9'
                            src="/ventana4.gif"
                            width={less}
                            height={less}
                            alt="Picture of the author"
                        />
                        <Image
                            src="/watch1.gif"
                            width={less}
                            height={less}
                            alt="Picture of the author"
                        />
                    </div>
                </section>
                <Divider id="meRef" className='disaper'/>
                <MeSection />
                <Divider id="worksRef" className='disaper' />
                <Works className='disaper' />
                <Divider id="projectsRef" className='disaper' />
                <Projects  className='disaper' />
            </div>
        </>
    );
}
