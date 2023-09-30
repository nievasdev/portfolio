
import { Button } from "@nextui-org/react";
import { Card, CardHeader, CardBody, CardFooter, Divider, Image } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
const projectsJson = require("../public/projects.json");
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import {
    GithubIcon,
} from "./icons";
import { useState } from "react";

export default function Projects() {
    const [selectedProject, SetSelectedProject] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleOpen = (projectName) => {
        SetSelectedProject(projectsJson.filter(object => object.name === projectName)[0]);
        onOpen();
    }

    return (
        <>
            <Modal
                size="5xl"
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalContent>
                    {(onClose) => {
                        return <>
                            <ModalHeader className="flex gap-1 justify-between">
                                <div>{selectedProject.name}</div>
                                <div className="flex justify-end mr-5">
                                    <Link isExternal href={selectedProject.github}>
                                        <GithubIcon className="text-default-500" />
                                    </Link>
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <p>
                                    {selectedProject.text}
                                </p>
                                {
                                    selectedProject.largeText.map(text => {
                                        return <p key={Math.random()}>{text}</p>
                                    })
                                }
                                <div className="w-full grid_card">
                                    {
                                        selectedProject.technologies.map(tech => {
                                            return (
                                                <div
                                                    key={tech.name + "-" + selectedProject.name + "-" + Math.random()}
                                                    className="m-2"
                                                >
                                                    <Image
                                                        className="min-w-[50px] pl-2 button-hover"
                                                        alt="technology"
                                                        radius="none"
                                                        key={tech.name + "-" + selectedProject.name}
                                                        src={tech.logo}
                                                        width={40}
                                                    />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </ModalBody>
                        </>
                    }
                    }
                </ModalContent>
            </Modal>
            <div className='text-center pt-44 sm:pt-8 w-full disaper'>
                <p
                    className="text-5xl sm:text-5xl md:text-7xl lg:text-7xl xl:text-7xl 2xl:text-7xl font-sans font-black text-ellipsis z-40 group "

                >
                    Projects
                </p>
                <div className='grid grid-cols-1 grid-rows-2 xl:grid-cols-2 place-items-center content-center mt-10 h-full w-full disaper' >
                    {
                        projectsJson.map(project => {
                            return (
                                <div key={project.name} className="p-5 h-full">
                                    <Card className="h-full bg-spacial-2 w-full disaper" >
                                        <CardHeader className="gap-3">
                                            <div className="flex justify-between items-center w-full">
                                                <div className="flex items-center">
                                                    <p className="text-xl">{project.name}</p>
                                                    <p className="text-small ml-5 text-default-800">{project.time}</p>
                                                </div>
                                                <Link isExternal href={project.github}>
                                                    <GithubIcon className="text-default-500" />
                                                </Link>
                                            </div>
                                        </CardHeader>
                                        <Divider />
                                        <CardBody className="grid place-items-center sm:grid-flow-col">
                                            <Image
                                                alt="Card background"
                                                src={project.logo}
                                                width={150}
                                            />
                                            <p className="mt-5 sm:ml-5 sm:mt-0">
                                                {project.text}
                                            </p>
                                        </CardBody>
                                        <CardFooter>
                                            <Button
                                                className='mt-5 w-8 mr-5 sm:mr-28 '
                                                size="sm"
                                                variant="flat"
                                                onClick={() => handleOpen(project.name)}
                                            >
                                                more ...
                                            </Button>
                                            <div className="w-full grid_card">
                                                {
                                                    project.technologies.map(tech => {
                                                        return (
                                                            <div
                                                                key={tech.name + "-" + project.name}
                                                                className="m-2"
                                                            >
                                                                <Image
                                                                    className="min-w-[50px] pl-2 button-hover"
                                                                    alt="technology"
                                                                    radius="none"
                                                                    key={tech.name + "-" + project.name}
                                                                    src={tech.logo}
                                                                    width={40}
                                                                />
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </div>)
                        })
                    }
                </div>
            </div>
        </>
    )
}