export interface StudentScore {
  id: string;
  name: string;
  scores: {
    thai_obj: number;
    thai_sub: number;
    thai: number;
    math: number;
    science: number;
    english: number;
  };
}

export interface Statistics {
  id: string;
  school: { thai_obj: number; thai_sub: number; thai: number; math: number; science: number; english: number };
  district: { thai_obj: number; thai_sub: number; thai: number; math: number; science: number; english: number };
  province: { thai_obj: number; thai_sub: number; thai: number; math: number; science: number; english: number };
  region: { thai_obj: number; thai_sub: number; thai: number; math: number; science: number; english: number };
  national: { thai_obj: number; thai_sub: number; thai: number; math: number; science: number; english: number };
}

export interface Logos {
  obec: string | null;
  school: string | null;
  niets: string | null;
}

export interface CriteriaLevel {
  name: string;
  min: number;
  max: number;
  color: string;
  textColor: string;
  bgColor: string;
}
