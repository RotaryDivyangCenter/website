export interface Service {
    id: number;
    category: "legs" | "hands";
    name: string;
    badge: "basic" | "hitech";
    description: string;
    material: string;
    eligibility: string;
}

export const services: Service[] = [
    // Legs
    {
        id: 1,
        category: "legs",
        name: "Below Knee Prosthesis",
        badge: "basic",
        description: "Lightweight prosthetic limb for below-knee amputees. Designed for everyday mobility and comfort.",
        material: "High-density polyethylene with EVA foam",
        eligibility: "Below-knee amputation or congenital limb difference",
    },
    {
        id: 2,
        category: "legs",
        name: "Above Knee Prosthesis",
        badge: "basic",
        description: "Functional above-knee prosthesis enabling natural gait. Equipped with a hydraulic knee joint.",
        material: "Polypropylene shell with stainless steel pylon",
        eligibility: "Above-knee amputation or congenital limb difference",
    },
    {
        id: 3,
        category: "legs",
        name: "LN4 Jaipur Foot",
        badge: "hitech",
        description: "World-renowned hi-tech prosthetic foot designed for Indian conditions. Allows walking on uneven terrain, squatting, and more.",
        material: "Reinforced polymer with rubber sole",
        eligibility: "Below-knee amputees, especially suited for rural/semi-urban beneficiaries",
    },
    {
        id: 4,
        category: "legs",
        name: "Microprocessor Knee",
        badge: "hitech",
        description: "Advanced computer-controlled prosthetic knee for above-knee amputees. Adapts to terrain in real time for natural movement.",
        material: "Carbon-fibre frame with microprocessor control unit",
        eligibility: "Above-knee amputees with active lifestyle requirements",
    },
    // Hands
    {
        id: 5,
        category: "hands",
        name: "Basic Functional Hand",
        badge: "basic",
        description: "Durable prosthetic hand providing basic grip and functional capability for daily tasks.",
        material: "PVC and polypropylene with cloth covering",
        eligibility: "Wrist and partial hand amputees",
    },
    {
        id: 6,
        category: "hands",
        name: "LN4 Hi-Tech Prosthetic Hand",
        badge: "hitech",
        description: "Lightweight, activity-specific hi-tech prosthetic hand developed in partnership with the Ellen Meados Foundation, USA.",
        material: "Lightweight carbon composite",
        eligibility: "Upper limb amputees seeking functional aesthetic restoration",
    },
    {
        id: 7,
        category: "hands",
        name: "Cosmetic Hand Prosthesis",
        badge: "basic",
        description: "Silicone cosmetic hand prosthesis that restores natural appearance. Ideal for social confidence.",
        material: "Medical-grade silicone with custom skin-tone matching",
        eligibility: "Any upper-limb amputee seeking cosmetic restoration",
    },
];
