'use client';

import React, { useEffect, useState } from 'react';
import { Octokit } from '@octokit/core';
import { Card, CardHeader, CardBody } from "./ui";
import GitHubContributions from "./GitHubContributions";

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

export default function MeSectionCompact() {
    const [userData, setUserData] = useState(null);


    useEffect(() => {
        const octokit = new Octokit();

        octokit
            .request('GET /users/nievasdev', {
                username: 'nievasdev',
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

    }, []);

    return (
        <div className="me-section-compact space-y-2 w-full me-section">
            {/* Professional Description */}
            <div className="p-3 md:p-4 lg:p-5 bg-spacial-1 rounded-lg">
                <p className="text-center text-sm md:text-base lg:text-lg text-spacial-4-90 font-medium leading-relaxed">
                    Full‑Stack developer delivering mission‑critical software across telecom, cybersecurity, and SaaS.
                    Deep JavaScript/TypeScript expertise with a strong focus on Node.js (APIs, microservices, performance) and React/Next.js on the frontend.
                    Experienced with REST APIs, Jest‑based testing, Git, and CI/CD.
                    Proactive, hands‑on, and relentless about performance and code quality.
                </p>
            </div>

            {/* Stats and Technologies */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 lg:gap-6">
                <Card className="bg-spacial-1">
                    <CardBody className="text-center p-3 md:p-4 lg:p-6">
                        <div className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white">
                            {userData ? userData.public_repos : '15+'}
                        </div>
                        <div className="text-sm md:text-base lg:text-lg text-spacial-4-70 font-medium">Public Repos</div>
                    </CardBody>
                </Card>
                <Card className="bg-spacial-1">
                    <CardBody className="text-center p-3 md:p-4 lg:p-6">
                        <h3 className="text-sm md:text-base lg:text-lg font-semibold text-white mb-2">Technologies</h3>
                        <div className="flex justify-center flex-wrap gap-1 md:gap-2">
                            {technologies.map((tech) => (
                                <img
                                    key={tech.name}
                                    src={tech.logo}
                                    alt={tech.name}
                                    className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 img-contain hover-scale transition-transform cursor-pointer"
                                    title={tech.name}
                                />
                            ))}
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* GitHub Contributions */}
            <GitHubContributions username="nievasdev" className="mb-4" />

        </div>
    );
}