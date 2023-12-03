import React, { useState, useEffect, useRef } from 'react';
import { Image } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';

const Technologies = ({ technologies }) => {
  return (
    <div className='w-full grid_card'>
      {technologies.map((tech) => (
        <div key={tech.name} className='m-2'>
          <Image
            className='min-w-[50px] pl-2 button-hover'
            alt='technology'
            radius='none'
            src={tech.logo}
            width={40}
          />
        </div>
      ))}
    </div>
  );
};

const Slider = ({ projects }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderIntervalRef = useRef(null);

  const prevSlide = () => {
    clearInterval(sliderIntervalRef.current);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? projects.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    clearInterval(sliderIntervalRef.current);
    setCurrentIndex((prevIndex) => (prevIndex === projects.length - 1 ? 0 : prevIndex + 1));
  };

  useEffect(() => {
    const startSliderInterval = () => {
      sliderIntervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex === projects.length - 1 ? 0 : prevIndex + 1));
      }, 7000);
    };

    startSliderInterval();

    return () => {
      clearInterval(sliderIntervalRef.current);
    };
  }, [projects.length]);

  if (projects.length === 0) return null;

  const items = projects.map((project, index) => {
    return (
      <div key={index} className={`transition-opacity duration-300 ${index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none hidden'}`}>
        <div className='pt-5 text-center justify-center'>
          <p className='text-2xl'>{project.title}</p>
          <br />
          <p className='px-2 py-1 ml-5 mr-5 h-fit font-mono font-normal inline-block bg-default/40 text-default-foreground text-small rounded-small'>{project.text}</p>
        </div>
      </div>
    );
  });

  return (
    <div className='relative justify-center mb-5 pb-5 minibackdrop2 pl-10 pr-10 mb-20'>
      {items}

      <button
        className='absolute backdrop-brightness-50 minibackdrop top-1/2 left-2 transform -translate-y-1/2 h-full text-white p-2'
        onClick={prevSlide}
      >
        <ArrowLeftIcon />
      </button>
      <button
        className='absolute backdrop-brightness-50 minibackdrop top-1/2 right-2 transform -translate-y-1/2 h-full text-white p-2'
        onClick={nextSlide}
      >
        <ArrowRightIcon />
      </button>
    </div>
  );
};

const workJson = require('../../public/works.json');

export default function SelectedWork() {
  const router = useRouter();
  const name = router.query.name;

  const [workSelected] = workJson.filter((work) => work.name === name);

  return (
    <>
      {workSelected && (
        <div key={workSelected.name} className='pt-10 items-center place-content-center pb-5 mx-auto place-items-center m-2 md:w-3/4'>
          <div className='flex flex-col gap-1 text-5xl text-center'>
            {workSelected.name} <p className='italic text-2xl'>{workSelected.time}</p>
          </div>
          <div>
            <div className='place-content-center items-center mt-10 h-full w-full'>
              <div className='p-10'>
                <div className='w-full grid grid-cols-2 grid-rows-1 pb-5'>
                  <Image className='mb-5' alt='Card background' src={workSelected.logo} width={150} />
                  <Technologies technologies={workSelected.technologies} />
                </div>

                {workSelected?.largeText.map((text, index) => {
                  return (
                    <p key={index} className='mb-4'>
                      {text}
                    </p>
                  );
                })}
                <p>{workSelected.text}</p>
                <p className='text-2xl mt-4 mb-3'>Work Method</p>
                <p>{workSelected.workMethod}</p>
              </div>
              <Slider projects={workSelected.projects} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
