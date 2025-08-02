'use client';

import React, { useState } from 'react';
import { Button, Card, CardHeader, CardBody, Divider, Image, Link, Modal, ModalContent, ModalHeader, ModalBody, Tooltip } from "./ui";
import { useModal } from "../hooks/useModal";
import { GithubIcon } from "./icons";
import { Project } from '@/types';

interface ProjectsColumnProps {
  projectsData: Project[];
}

export default function ProjectsColumn({ projectsData }: ProjectsColumnProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { isOpen, onOpen, onClose } = useModal();

  const handleOpen = (projectName: string) => {
    const project = projectsData?.find(p => p.name === projectName);
    if (project) {
      setSelectedProject(project);
      onOpen();
    }
  };

  return (
    <>
      <Modal
        size="4xl"
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalContent>
          {selectedProject && (
            <>
              <ModalHeader>
                <div className="modal-title">{selectedProject.name}</div>
                <div className="modal-actions">
                  <Link isExternal href={selectedProject.github}>
                    <GithubIcon className="text-spacial-3 hover-text-spacial-4 transition-colors w-6 h-6" />
                  </Link>
                </div>
              </ModalHeader>
              <ModalBody>
                <p className="modal-description">
                  {selectedProject.text}
                </p>
                {selectedProject.largeText?.map((text, index) => (
                  <p key={index} className="modal-text">
                    {text}
                  </p>
                ))}

                <div className="modal-technologies">
                  <h4 className="technologies-title">Technologies Used:</h4>
                  <div className="technologies-list">
                    {selectedProject.technologies?.map(tech => (
                      <div
                        key={tech.name + "-" + selectedProject.name}
                        className="technology-item"
                      >
                        <Image
                          src={tech.logo}
                          alt={tech.name}
                          className="img-xl img-contain mr-3 img-hover-scale"
                          width={28}
                          height={28}
                        />
                        <span className="text-spacial-4 text-base font-medium">{tech.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <div className="space-y-2">
        {projectsData?.map(project => (
          <Card key={project.name}>
            <CardHeader>
              <div className="card-title">
                <h3 className="text-2xl font-semibold text-white">{project.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-base text-spacial-4-70 bg-spacial-1 px-3 py-1 rounded font-medium">
                    {project.time}
                  </span>
                  <Link isExternal href={project.github}>
                    <GithubIcon className="text-spacial-3 hover-text-spacial-4 transition-colors w-5 h-5" />
                  </Link>
                </div>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="card-content">
                <div className="card-image">
                  <Image
                    src={project.logo}
                    alt={project.name}
                    className="img-card img-contain"
                    width={144}
                    height={144}
                    radius="md"
                  />
                </div>
                <div className="card-text">
                  <p className="text-base text-spacial-4-90 leading-relaxed font-medium mb-3">
                    {project.text}
                  </p>

                  {/* Technologies and Button Row */}
                  <div className="card-actions">
                    <div className="card-technologies">
                      {project.technologies.map((tech) => (
                        <Tooltip
                          key={tech.name + '-' + project.name}
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
                              className="img-lg img-hover-scale"
                              width={36}
                              height={36}
                              radius="none"
                            />
                          </div>
                        </Tooltip>
                      ))}
                    </div>

                    <div className="card-buttons">
                      <Button
                        size="md"
                        variant="solid"
                        onClick={() => handleOpen(project.name)}
                      >
                        View Details
                      </Button>
                      <Button
                        as="a"
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="md"
                        variant="bordered"
                      >
                        <GithubIcon className="w-4 h-4 mr-1" />
                        GitHub
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </>
  );
}