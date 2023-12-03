import React, { useEffect, useState } from 'react';
import { Octokit } from '@octokit/core';
import timeCalculator from "./timeCalculator";
import { Card, CardHeader, CardBody, CardFooter, Divider, Image } from "@nextui-org/react";

const technologies = [
    {
        "name": "JavaScript",
        "logo": "/logo_javascript.png"
    },
    {
        "name": "python",
        "logo": "/logo_python.png"
    },
    {
        "name": "React",
        "logo": "/logo_react.png"
    },
    {
        "name": "NextJs",
        "logo": "/logo_next.png"
    },
    {
        "name": "Node",
        "logo": "/logo_node.png"
    }
]

export default function MeSection() {

    const [userData, setUserData] = useState(null);
    const [timeDifference, setTimeDifference] = useState(null);

    useEffect(() => {
        const octokit = new Octokit();

        octokit
            .request('GET /users/Mauro-js', {
                username: 'Mauro-js',
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28',
                },
            })
            .then((response) => {
                setUserData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching GitHub data:', error);
            });

        setTimeDifference(timeCalculator());
    }, []);

    return (
        <section id="meRef" className='text-center sm:pt-8 bg-spacial-2 w-full disaper mx-auto place-items-center m-2 sm:w-3/4'>
                <p
                    className="text-5xl sm:text-5xl md:text-7xl lg:text-7xl xl:text-7xl 2xl:text-7xl font-sans font-black text-ellipsis z-40 group"
                >
                    Me
                </p>
                <div className='place-content-center'>
                    <div className='grid grid-cols-1 grid-rows-2 xl:grid-cols-2 mt-10 text-xl' >
                        <p>
                            {timeDifference !== null && "Experienced in diverse corporate environments and work methodologies, I began self-studying programming at 12 and am now pursuing a degree in computer engineering. Boasting " + timeDifference.years + " years of expertise, my strengths lie in JavaScript, React, Next.js, Node, and Python. My goal is to become a highly sought-after engineer for global industry leaders within the next decade."}
                        </p>
                        <div className='md:p-2 grid_card'>
                            {userData && (
                                <Card className="bg-spacial-2 w-[150px] m-5">
                                    <CardHeader className="gap-3">
                                        <div className="flex place-items-center w-full">
                                            <p className="text-xl">Public Repos</p>
                                        </div>
                                    </CardHeader>
                                    <Divider />
                                    <CardBody className="grid place-items-center sm:grid-flow-col text-2xl">
                                        {userData.public_repos}
                                    </CardBody>
                                </Card>
                            )}
                            <Card className="bg-spacial-2 w-max-[400px] m-5">
                                <CardHeader className="gap-3">
                                    <div className="flex place-items-center w-full">
                                        <p className="text-xl">Experience</p>
                                    </div>
                                </CardHeader>
                                <Divider />
                                <CardBody className="grid place-items-center sm:grid-flow-col text-2xl">
                                    {timeDifference !== null && <p>
                                        {timeDifference.years} Years, {timeDifference.months} Months and {timeDifference.days} days
                                    </p>}
                                </CardBody>
                            </Card>
                        </div>
                        <div className='p-2 grid_card'>
                            {
                                technologies.map((tech) => {
                                    return <div key={tech.name + "_perfil"} className='p-2'><Image
                                        className="min-w-[50px] pl-2 button-hover"
                                        alt="technology"
                                        radius="none"

                                        src={tech.logo}
                                        width={40}
                                    /></div>
                                })

                            }
                        </div>
                    </div>
                </div>
        </section>
    )
}