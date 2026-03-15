export interface TeamMember {
    id: number;
    name: string;
    role: string;
    initials: string;
    tenure?: string;
}

export const teamMembers: TeamMember[] = [
    {
        id: 1,
        name: "Rtn. Sheela Sabnis",
        role: "RDC Chair Person Emeritus",
        initials: "SS",
    },
    {
        id: 2,
        name: "Rtn. Kiran Patil",
        role: "RDC Chairman",
        initials: "KP",
    },
    {
        id: 3,
        name: "Rtn. Dhirendra Singh",
        role: "Club President",
        initials: "DS",
        tenure: "2025–26",
    },
    {
        id: 4,
        name: "Rtn. Namdeo Chaudhari",
        role: "Club Secretary",
        initials: "NC",
        tenure: "2025–26",
    },
    {
        id: 5,
        name: "Rtn. Ramesh More",
        role: "Club President Elect",
        initials: "RM",
        tenure: "2026–27",
    },
];

export const ambassadors = [
    {
        name: "Rtn. K.V. Mohan Kumar",
        role: "LN-4 Ambassador, South Asia",
        initials: "KM",
    },
    {
        name: "Rtn. Sudhish Nair",
        role: "L4 Coordinator, Rotary Club of New Kalyan",
        initials: "SN",
    },
];
