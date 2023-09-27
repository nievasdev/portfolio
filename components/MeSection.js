import React, { useEffect, useState } from 'react';
import { Octokit } from '@octokit/core';

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
                // Calcular la diferencia de tiempo
                const currentDate = new Date();
                const targetDate = new Date('2017-04-04');
                const timeDiff = currentDate - targetDate;

                // Calcular años, meses y días
                const years = Math.floor(timeDiff / (365 * 24 * 60 * 60 * 1000));
                const months = Math.floor(
                    (timeDiff % (365 * 24 * 60 * 60 * 1000)) / (30 * 24 * 60 * 60 * 1000)
                );
                const days = Math.floor(
                    (timeDiff % (30 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000)
                );

                setTimeDifference({ years, months, days });
            })
            .catch((error) => {
                console.error('Error fetching GitHub data:', error);
            });
    }, []);

    return (
        <div id="meRef" className='text-center pt-44 sm:pt-8 bg-spacial-2 w-full disaper'>
            <p
                className="text-5xl sm:text-5xl md:text-7xl lg:text-7xl xl:text-7xl 2xl:text-7xl font-sans font-black text-ellipsis z-40 group "
            >
                Me
            </p>
            <div className='grid grid-cols-1 grid-rows-2 xl:grid-cols-2 mt-10' >
                <p>
                    { timeDifference !== null && "I have experience working for various companies and different work methodologies. I've been studying programming on my own since I was 12 years old, and I'm currently pursuing a degree in computer engineering. I have " + timeDifference.years  + " years of experience, and what I excel at the most is JavaScript, React, Next.js, Node, and Python. I'm aiming to be a sought-after engineer for the biggest companies in the world within the next 10 years."}
                </p>
                <div  className='p-2 grid_card'>
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
    )
}