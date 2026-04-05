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
    // Limbs
    {
        id: 1,
        category: "legs",
        name: "AK",
        badge: "basic",
        description: "Above-knee prosthetic fitment for supported walking and daily activity.",
        material: "Standard prosthetic knee components",
        eligibility: "Above-knee amputees",
    },
    {
        id: 2,
        category: "legs",
        name: "BK",
        badge: "basic",
        description: "Below-knee prosthetic fitment for functional day-to-day mobility.",
        material: "Standard prosthetic socket and pylon components",
        eligibility: "Below-knee amputees",
    },
    {
        id: 3,
        category: "legs",
        name: "AFO - Static",
        badge: "basic",
        description: "Static ankle-foot orthosis support for stable positioning and assisted mobility.",
        material: "Thermoplastic orthotic frame",
        eligibility: "Beneficiaries needing static ankle-foot support",
    },
    {
        id: 4,
        category: "legs",
        name: "AFO - Dynamic",
        badge: "basic",
        description: "Dynamic ankle-foot orthosis support designed for improved gait response.",
        material: "Flexible composite or thermoplastic frame",
        eligibility: "Beneficiaries needing dynamic ankle-foot support",
    },
    {
        id: 5,
        category: "legs",
        name: "Push Knee",
        badge: "basic",
        description: "Mechanical push-knee setup for functional lower-limb mobility support.",
        material: "Mechanical knee joint system",
        eligibility: "Suitable lower-limb amputee cases based on clinical fitment plan",
    },
    {
        id: 6,
        category: "legs",
        name: "KAFO",
        badge: "basic",
        description: "Knee-ankle-foot orthosis support for stability and guided ambulation.",
        material: "Orthotic uprights and custom support frame",
        eligibility: "Beneficiaries requiring knee-ankle-foot orthotic support",
    },
    {
        id: 7,
        category: "legs",
        name: "AK (Hi-Tech)",
        badge: "hitech",
        description: "Advanced above-knee prosthetic fitment with hi-tech knee options for smoother gait and better control.",
        material: "Hi-tech prosthetic knee system and advanced component options",
        eligibility: "Above-knee amputees based on clinical assessment and final decision",
    },
    {
        id: 8,
        category: "legs",
        name: "BK (Hi-Tech)",
        badge: "hitech",
        description: "Advanced below-knee prosthetic fitment with hi-tech components for improved comfort and mobility.",
        material: "Hi-tech prosthetic component options",
        eligibility: "Below-knee amputees based on clinical assessment and final decision",
    },
    // Hands
    {
        id: 9,
        category: "hands",
        name: "LN4",
        badge: "basic",
        description: "LN4 prosthetic hand support for upper-limb functional rehabilitation.",
        material: "Lightweight prosthetic hand components",
        eligibility: "Upper-limb amputees based on clinical assessment",
    },
];
