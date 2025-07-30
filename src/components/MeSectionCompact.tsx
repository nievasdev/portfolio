'use client';

import React, { useEffect, useState } from 'react';
import { Octokit } from '@octokit/core';
import timeCalculator from "./timeCalculator";
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
    const [timeDifference, setTimeDifference] = useState(null);

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

        setTimeDifference(timeCalculator());
    }, []);

    return (
        <div className="me-section-compact space-y-2 w-full">
            {/* Title */}
            <p className="text-lg md:text-xl lg:text-2xl text-center text-spacial-4-90 font-medium">
                {timeDifference !== null && `Full Stack Developer +${timeDifference.years} years`}
            </p>
            
            {/* Quick Stats */}
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
                        <div className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white">
                            {timeDifference ? `${timeDifference.years}+` : '6+'}
                        </div>
                        <div className="text-sm md:text-base lg:text-lg text-spacial-4-70 font-medium">Years Experience</div>
                    </CardBody>
                </Card>
            </div>

            {/* GitHub Contributions */}
            <GitHubContributions username="nievasdev" className="mb-4" />

            {/* Technologies */}
            <div className="technologies">
                <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-white mb-3 text-center">Technologies</h3>
                <div className="flex justify-center flex-wrap gap-2 md:gap-3 lg:gap-4">
                    {technologies.map((tech) => (
                        <img 
                            key={tech.name}
                            src={tech.logo} 
                            alt={tech.name} 
                            className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 img-contain hover-scale transition-transform cursor-pointer"
                            title={tech.name}
                        />
                    ))}
                </div>
            </div>

            {/* Experience Summary */}
            {timeDifference && (
                <div className="p-3 md:p-4 lg:p-5 bg-spacial-1 rounded-lg">
                    <p className="text-center text-sm md:text-base lg:text-lg text-spacial-4-90 font-medium">
                        <strong>{timeDifference.years} Years, {timeDifference.months} Months</strong> of experience building web applications
                    </p>
                </div>
            )}
        </div>
    );
}