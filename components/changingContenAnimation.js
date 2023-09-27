import React, { useEffect, useState, useMemo } from 'react';

const ChangingContentAnimation = () => {
    const [currentIndexes, setCurrentIndexes] = useState([]);
    const [content, setContent] = useState([]);
    const [clicked, setClicked] = useState(false);

    const handleClick = () => {
        setClicked(!clicked);
        setTimeout(() => {
            setClicked(!clicked);
        }, 1000);

    };

    const lettersLists = useMemo(
        () => ['095170627!', '0627!"#$%&/', '!"#$%XYZ;Ñ', 'abcde!"#$%', '67890!"#$%', '            ', '!"#$%&/123', 'XYZ!"#$%&/', 'abcde!"#$%', '67890!"#$%', '!"#$%&/abc', '!"#$%&/678'],
        []
    );

    const desiredEndLetters = useMemo(
        () => ['M', 'a', 'u', 'r', 'o', ' ', 'N', 'i', 'e', 'v', 'a', 's'],
        []
    );




    useEffect(() => {
        setCurrentIndexes(Array.from({ length: lettersLists.length }, () => 0));
        setContent(lettersLists.map((_, index) => lettersLists[index][0]));
    }, [lettersLists, clicked]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const intervalId = setInterval(() => {
                let allStopped = true;

                const newContent = content.map((currentLetter, index) => {
                    const letters = lettersLists[index % lettersLists.length];
                    if (currentIndexes[index] < letters.length) {
                        const desiredEndLetter = desiredEndLetters[index];
                        if (currentIndexes[index] === letters.length - 1 && desiredEndLetter) {
                            return desiredEndLetter;
                        } else {
                            return letters[currentIndexes[index]];
                        }
                        allStopped = false;
                    }
                    return currentLetter;
                });

                setCurrentIndexes((prevIndexes) =>
                    prevIndexes.map((currentIndex, index) => {
                        const letters = lettersLists[index % lettersLists.length];
                        if (currentIndex < letters.length) {
                            return currentIndex + 1;
                        }
                        return currentIndex;
                    })
                );

                setContent(newContent);

                if (allStopped) {
                    clearInterval(intervalId);
                }
            }, 40);

            return () => {
                clearInterval(intervalId);
            };
        }
    }, [content, currentIndexes, desiredEndLetters, lettersLists, clicked]);


    return (
        <p
            className="text-5xl sm:text-5xl md:text-7xl lg:text-7xl xl:text-7xl 2xl:text-7xl font-sans font-black text-ellipsis z-40 group changing-content glitch highlight-text"
            onClick={handleClick}
        >
            {content.map((letter, index) => (
                <span key={index}>{letter}</span>
            ))}
        </p>
    );
};

export default ChangingContentAnimation;
