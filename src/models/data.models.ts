export interface Resume {
  firstname: string;
  lastname: string;
  jobTitle: string;
  profileImage?: string;
  website?: string;
  linkedIn?: string;
  github?: string;
  email?: string;
  phone?: string;
  profile: string;
  skills: string[];
  experiences: Experience[];
  educations: Education[];
}

export interface ExperienceGroup {
  profile: string;
  experiences: Experience[];
}

export interface Experience {
  profile: string;
  jobTitle: string;
  company: string;
  location: string;
  type: string;
  startDate: string;
  endDate: string;
  points: string[];
}

export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}
