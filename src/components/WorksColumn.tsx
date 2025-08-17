'use client';

import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Tooltip,
} from './ui';
import { Work } from '@/types';
import { useModal } from '../hooks/useModal';
import { useLanguage } from '../contexts/LanguageContext';

interface WorksColumnProps {
  worksData: Work[];
  onWorkHover?: (work: Work | null) => void;
}

export default function WorksColumn({ worksData, onWorkHover }: WorksColumnProps) {
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const { isOpen, onOpen, onClose } = useModal();
  const { t } = useLanguage();

  const handleOpen = (workName: string) => {
    const work = worksData?.find(w => w.name === workName);
    if (work) {
      setSelectedWork(work);
      setCurrentProjectIndex(0); // Reset carousel to first project
      onOpen();
    }
  };

  // Auto-rotating carousel effect for projects
  useEffect(() => {
    if (!isOpen || !selectedWork || selectedWork.projects.length <= 2) return;

    const maxIndex = selectedWork.projects.length - 2;
    const interval = setInterval(() => {
      setCurrentProjectIndex((prevIndex) =>
        prevIndex >= maxIndex ? 0 : prevIndex + 1
      );
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [isOpen, selectedWork]);

  const goToProject = (index: number) => {
    setCurrentProjectIndex(index);
  };

  return (
    <>
      {/* Enhanced Work Details Modal - Matches Original Portfolio */}
      <Modal
        size="5xl"
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalContent>
          {selectedWork && (
            <>
              <ModalHeader>
                <div className="modal-title">
                  <div>
                    <h2 className="text-3xl font-bold text-white">{selectedWork.name}</h2>
                    <p className="text-lg text-spacial-4-70">{selectedWork.time}</p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="work-details-content space-y-8">

                  {/* Company Overview Section */}
                  <div className="company-overview">
                    <div className="flex gap-6 items-start">
                      <div className="flex-shrink-0">
                        <Image
                          src={selectedWork.logo}
                          alt={`${selectedWork.name} logo`}
                          className="img-company-large img-contain"
                        />
                      </div>
                      <div className="flex-1 space-y-4">
                        {selectedWork.largeText.map((paragraph, index) => (
                          <p key={index} className="text-lg text-spacial-4-90 leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                        {/* Work Method directly after description */}
                        <div className="mt-6">
                          <p className="text-lg text-spacial-4-90 leading-relaxed">
                            {selectedWork.workMethod}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Projects Section - Carousel */}
                  {selectedWork.projects.length > 0 && (
                    <div className="projects-section">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-semibold text-white">{t('works.keyProjects')}</h3>
                        {selectedWork.projects.length > 2 && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-spacial-4-70">
                              {Math.min(currentProjectIndex + 2, selectedWork.projects.length)} {t('works.of')} {selectedWork.projects.length} {t('works.visible')}
                            </span>
                            <div className="flex gap-1">
                              {Array.from({ length: selectedWork.projects.length - 1 }, (_, index) => (
                                <button
                                  key={index}
                                  onClick={() => goToProject(index)}
                                  className={`w-2 h-2 rounded-full transition-all ${
                                    index === currentProjectIndex
                                      ? 'bg-spacial-3'
                                      : 'bg-spacial-4-30 hover:bg-spacial-4-50'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="overflow-hidden">
                        <div
                          className="flex transition-transform duration-300 ease-in-out"
                          style={{
                            transform: `translateX(-${currentProjectIndex * 50}%)`,
                            width: `${selectedWork.projects.length * 50}%`
                          }}
                        >
                          {selectedWork.projects.map((project, index) => (
                            <div
                              key={index}
                              className="project-item bg-spacial-2 rounded-lg p-6 border border-spacial-3/20 flex-shrink-0"
                              style={{ width: `${100 / selectedWork.projects.length * 2}%` }}
                            >
                              <h4 className="text-xl font-semibold text-spacial-3 mb-3">
                                {project.title}
                              </h4>
                              <p className="text-lg text-spacial-4-90 leading-relaxed">
                                {project.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Navigation buttons for multiple projects */}
                      {selectedWork.projects.length > 2 && (
                        <div className="flex justify-center gap-4 mt-4">
                          <button
                            onClick={() => goToProject(Math.max(0, currentProjectIndex - 1))}
                            disabled={currentProjectIndex === 0}
                            className="px-4 py-2 bg-spacial-1 hover:bg-spacial-2 rounded-lg text-spacial-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {t('works.previous')}
                          </button>
                          <button
                            onClick={() => goToProject(Math.min(selectedWork.projects.length - 2, currentProjectIndex + 1))}
                            disabled={currentProjectIndex >= selectedWork.projects.length - 2}
                            className="px-4 py-2 bg-spacial-1 hover:bg-spacial-2 rounded-lg text-spacial-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {t('works.next')}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Technologies Section */}
                  <div className="technologies-section">
                    <h3 className="text-2xl font-semibold text-white mb-6">{t('works.technologiesUsed')}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {selectedWork.technologies.map((tech, techIndex) => (
                        <div key={techIndex} className="tech-item text-center">
                          <div className="bg-spacial-1 rounded-lg p-4 hover:bg-spacial-2 transition-colors">
                            <Image
                              src={tech.logo}
                              alt={tech.name}
                              className="img-lg img-contain hover-scale transition-transform mx-auto mb-3"
                            />
                            <p className="text-sm text-spacial-4-70 font-medium">{tech.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary Section */}
                  <div className="summary-section">
                    <h3 className="text-2xl font-semibold text-white mb-4">{t('works.roleSummary')}</h3>
                    <div className="bg-gradient-to-r from-spacial-1 to-spacial-2 rounded-lg p-6 border border-spacial-3/20">
                      <p className="text-xl text-spacial-4-90 leading-relaxed font-medium">
                        {selectedWork.text}
                      </p>
                    </div>
                  </div>

                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Works List */}
      <div className="space-y-2">
        {worksData?.map((work) => (
          <div
            key={work.name}
            onMouseEnter={() => onWorkHover?.(work)}
            onMouseLeave={() => onWorkHover?.(null)}
          >
            <Card>
            <CardHeader>
              <div className="card-title">
                <h3 className="text-2xl font-semibold text-white">{work.name}</h3>
                <span className="text-base text-spacial-4-70 bg-spacial-1 px-3 py-1 rounded font-medium">
                  {work.time}
                </span>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="card-content">
                <div className="card-image">
                  <Image
                    src={work.logo}
                    alt={work.name}
                    className="img-card img-contain"
                    width={144}
                    height={144}
                    radius="md"
                  />
                </div>
                <div className="card-text">
                  <p className="text-base text-spacial-4-90 leading-relaxed font-medium mb-3">
                    {work.text}
                  </p>
                </div>
              </div>
            </CardBody>
            <CardFooter>
              {/* Technologies and Button Row */}
              <div className="card-actions">
                <div className="card-technologies">
                  {work.technologies.map((tech) => (
                    <Tooltip
                      key={tech.name + '-' + work.name}
                      content={tech.name}
                      placement="top"
                      showArrow={true}
                      classNames={{
                        base: "backdrop-blur-md",
                        content: "tooltip"
                      }}
                    >
                      <div className="tech-icon">
                        <Image
                          src={tech.logo}
                          alt={tech.name}
                          className="img-lg hover-scale"
                          width={36}
                          height={36}
                          radius="none"
                        />
                      </div>
                    </Tooltip>
                  ))}
                </div>

                <Button
                  className="ml-4 group"
                  size="md"
                  variant="solid"
                  onClick={() => handleOpen(work.name)}
                >
                  <span className="button-text">{t('works.viewDetails')}</span>
                </Button>
              </div>
            </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
}