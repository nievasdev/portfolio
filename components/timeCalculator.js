const timeCalculator = () => {
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

    return { years, months, days };
}

export default timeCalculator;