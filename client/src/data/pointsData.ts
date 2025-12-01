export interface RegistrationData {
    eventName: string;
    sciences: number;
    psychology: number;
    socialSciences: number;
    business: number;
    commerce: number;
    total: number;
}

export interface SchoolEventStats {
    event: string;
    totalReg: number;
    turnUp: number;
    turnDown: number;
    score: number;
}

export interface WinnerData {
    event: string;
    position: string;
    school: string;
    class: string;
    team: string;
}

export const SCHOOLS = [
    "School of Sciences",
    "School of Psychological Sciences",
    "School of Social Sciences",
    "School of Business and Management",
    "School of Commerce Finance and Accountancy",
];

export const EVENTS = [
    "Photography",
    "Pot Art",
    "Greeting Card Making",
    "Painting",
    "Pencil Sketching",
    "Reel Making",
    "Collage Making",
    "Mehandi Design",
    "Digital Poster Making",
    "Rangoli Design",
    "Debate",
    "Quiz",
    "Extempore",
    "Pot Pourri",
    "Dance",
    "Music",
    "Fashion Show"
];

// Mock Data Generators
const generateRegistrations = (): RegistrationData[] => {
    return EVENTS.map(event => {
        const sciences = Math.floor(Math.random() * 20);
        const psychology = Math.floor(Math.random() * 20);
        const socialSciences = Math.floor(Math.random() * 20);
        const business = Math.floor(Math.random() * 20);
        const commerce = Math.floor(Math.random() * 20);
        return {
            eventName: event,
            sciences,
            psychology,
            socialSciences,
            business,
            commerce,
            total: sciences + psychology + socialSciences + business + commerce
        };
    });
};

const generateSchoolStats = (): SchoolEventStats[] => {
    return EVENTS.map(event => {
        const totalReg = Math.floor(Math.random() * 30) + 5;
        const turnUp = Math.floor(totalReg * (0.5 + Math.random() * 0.5));
        const turnDown = totalReg - turnUp;
        const score = turnUp * 10 + Math.floor(Math.random() * 50);
        return {
            event,
            totalReg,
            turnUp,
            turnDown,
            score
        };
    });
};

const generateWinners = (): WinnerData[] => {
    const winners: WinnerData[] = [];
    EVENTS.forEach(event => {
        ["1st", "2nd", "3rd"].forEach(pos => {
            winners.push({
                event,
                position: pos,
                school: SCHOOLS[Math.floor(Math.random() * SCHOOLS.length)],
                class: `${Math.floor(Math.random() * 3) + 1} ${["BCA", "BBA", "BCom", "BSc", "BA"][Math.floor(Math.random() * 5)]}`,
                team: `Team ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`
            });
        });
    });
    return winners;
};

// Exported Data
export const REGISTRATIONS_DATA: RegistrationData[] = generateRegistrations();

export const SCHOOL_STATS: { [key: string]: SchoolEventStats[] } = {
    "School of Sciences": generateSchoolStats(),
    "School of Psychological Sciences": generateSchoolStats(),
    "School of Social Sciences": generateSchoolStats(),
    "School of Business and Management": generateSchoolStats(),
    "School of Commerce Finance and Accountancy": generateSchoolStats(),
};

export const WINNERS_DATA: WinnerData[] = generateWinners();
