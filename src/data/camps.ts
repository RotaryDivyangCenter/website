export interface Camp {
  id: number;
  name: string;
  location: string;
  date: string;
  limbsProvided: number;
  beneficiaries: number;
  sponsors: string[];
}

export const camps: Camp[] = [
  {
    id: 1,
    name: "Kalyan Prosthetic Camp",
    location: "Kalyan, Thane",
    date: "March 2015",
    limbsProvided: 32,
    beneficiaries: 32,
    sponsors: ["Rotary Club of New Kalyan", "Century Rayon"],
  },
  {
    id: 2,
    name: "Badlapur Divyang Seva Camp",
    location: "Badlapur, Thane",
    date: "September 2015",
    limbsProvided: 28,
    beneficiaries: 28,
    sponsors: ["Rotary District 3142", "Legrand India"],
  },
  {
    id: 3,
    name: "Bhiwandi Prosthetics Camp",
    location: "Bhiwandi, Thane",
    date: "January 2016",
    limbsProvided: 45,
    beneficiaries: 45,
    sponsors: ["Acutaas", "Rotary Club of New Kalyan"],
  },
  {
    id: 4,
    name: "Ulhasnagar Limb Fitment Camp",
    location: "Ulhasnagar, Thane",
    date: "August 2016",
    limbsProvided: 38,
    beneficiaries: 38,
    sponsors: ["Atos India", "Century Rayon"],
  },
  {
    id: 5,
    name: "Ambarnath Divyang Camp",
    location: "Ambarnath, Thane",
    date: "February 2017",
    limbsProvided: 52,
    beneficiaries: 52,
    sponsors: ["Legrand", "Rotary Club of New Kalyan"],
  },
  {
    id: 6,
    name: "Navi Mumbai Prosthetic Camp",
    location: "Navi Mumbai, Maharashtra",
    date: "November 2018",
    limbsProvided: 61,
    beneficiaries: 61,
    sponsors: ["Atos India", "Acutaas", "Rotary District 3142"],
  },
  {
    id: 7,
    name: "LN4 Hi-Tech Limb Camp",
    location: "Kalyan, Thane",
    date: "March 2019",
    limbsProvided: 24,
    beneficiaries: 24,
    sponsors: ["Ellen Meados Foundation USA", "Rotary Club of New Kalyan"],
  },
  {
    id: 8,
    name: "Murbad Tribal Prosthetic Camp",
    location: "Murbad, Thane",
    date: "January 2021",
    limbsProvided: 40,
    beneficiaries: 40,
    sponsors: ["Century Rayon", "Rotary Club of Poona Downtown"],
  },
  {
    id: 9,
    name: "Shahad–Vithalwadi Camp",
    location: "Shahad, Thane",
    date: "October 2022",
    limbsProvided: 55,
    beneficiaries: 55,
    sponsors: ["Acutaas", "Legrand", "Rotary Club of New Kalyan"],
  },
  {
    id: 10,
    name: "Titwala Divyang Mela",
    location: "Titwala, Thane",
    date: "December 2023",
    limbsProvided: 70,
    beneficiaries: 70,
    sponsors: ["Atos India", "Century Rayon", "Rotary District 3142"],
  },
];

export const campStats = {
  totalCamps: 85,
  totalBeneficiaries: 4110,
  totalLimbs: 4150,
  yearsActive: 10,
};
