import { CriteriaLevel, Statistics, StudentScore } from "../types";

export const mockStudents: StudentScore[] = [
  {
    id: "12345",
    name: "ด.ช. สมชาย รักเรียน",
    scores: {
      thai_obj: 30,
      thai_sub: 15,
      thai: 45,
      math: 55,
      science: 62,
      english: 40,
    },
  },
  {
    id: "67890",
    name: "ด.ญ. สมหญิง ขยันดี",
    scores: {
      thai_obj: 40,
      thai_sub: 20,
      thai: 60,
      math: 75,
      science: 80,
      english: 65,
    },
  },
];

export const mockStatistics: Statistics = {
  id: "2568",
  school: { thai_obj: 25, thai_sub: 15, thai: 40, math: 45, science: 50, english: 35 },
  district: { thai_obj: 27, thai_sub: 15, thai: 42, math: 46, science: 52, english: 38 },
  province: { thai_obj: 26, thai_sub: 15, thai: 41, math: 44, science: 51, english: 37 },
  region: { thai_obj: 30, thai_sub: 15, thai: 45, math: 48, science: 55, english: 40 },
  national: { thai_obj: 33, thai_sub: 15, thai: 48, math: 50, science: 58, english: 45 },
};

export const mockCriteria: CriteriaLevel[] = [
  { name: "ดีเยี่ยม", min: 80, max: 100, color: "#10b981", textColor: "text-emerald-700", bgColor: "bg-emerald-100" },
  { name: "ดีมาก", min: 70, max: 79.99, color: "#3b82f6", textColor: "text-blue-700", bgColor: "bg-blue-100" },
  { name: "ดี", min: 60, max: 69.99, color: "#14b8a6", textColor: "text-teal-700", bgColor: "bg-teal-100" },
  { name: "ค่อนข้างดี", min: 50, max: 59.99, color: "#eab308", textColor: "text-yellow-700", bgColor: "bg-yellow-100" },
  { name: "ปานกลาง", min: 0, max: 49.99, color: "#f97316", textColor: "text-orange-700", bgColor: "bg-orange-100" },
];

export const getQualityLevel = (score: number): CriteriaLevel => {
  return mockCriteria.find((c) => score >= c.min && score <= c.max) || mockCriteria[mockCriteria.length - 1];
};
