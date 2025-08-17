'use client';

import React, { useEffect, useState } from 'react';
import { Octokit } from '@octokit/core';
import { Card, CardHeader, CardBody, Button } from "./ui";
import GitHubContributions from "./GitHubContributions";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from '../contexts/LanguageContext';

const technologies = [
    {
        "name": "JavaScript",
        "logo": "/logo_javascript.png"
    },
    {
        "name": "Python",
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
    const [isLoading, setIsLoading] = useState(true);
    const { t } = useLanguage();


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
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching GitHub data:', error);
                setIsLoading(false);
            });

    }, []);

    return (
        <div className="me-section-compact space-y-2 w-full me-section">
            {/* Professional Description */}
            <div className="p-3 md:p-4 lg:p-5 bg-spacial-1 rounded-lg">
                <p className="text-center text-base text-spacial-4-90 font-medium leading-relaxed">
                    {t('about.description')}
                </p>
            </div>

            {/* Stats and Technologies */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 lg:gap-6">
                <Card className="bg-spacial-1">
                    <CardBody className="text-center p-3 md:p-4 lg:p-6">
                        <div className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white">
                            {isLoading ? (
                                <div className="animate-pulse bg-spacial-4-30 rounded h-8 w-12 mx-auto"></div>
                            ) : (
                                userData ? userData.public_repos : '15+'
                            )}
                        </div>
                        <div className="text-sm md:text-base lg:text-lg text-spacial-4-70 font-medium">{t('about.repos')}</div>
                    </CardBody>
                </Card>
                <Card className="bg-spacial-1">
                    <CardBody className="text-center p-3 md:p-4 lg:p-6">
                        <h3 className="text-sm md:text-base lg:text-lg font-semibold text-white mb-2">{t('about.technologies')}</h3>
                        <div className="technologies flex justify-center flex-wrap gap-1 md:gap-2">
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

            {/* Resume Download Button, Theme Toggle and Language Toggle */}
            <div className="flex justify-start gap-3">
                <Button
                    as="a"
                    href="/Mauro Nievas Resume.pdf"
                    download="Mauro_Nievas_Resume.pdf"
                    size="lg"
                    variant="solid"
                    className="bg-spacial-3 hover:bg-spacial-2 text-white font-semibold px-6 py-3 transition-all duration-200 group relative overflow-hidden"
                >
                    <span className="download-arrow inline-block mr-3 font-black -ml-1">↓</span>
                    <span className="button-text relative z-10">{t('about.download')}</span>
                    <div className="shimmer-effect absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100"></div>
                </Button>
                <ThemeToggle />
                <LanguageToggle />
            </div>

        </div>
    );
}