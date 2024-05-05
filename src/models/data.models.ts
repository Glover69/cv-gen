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
  
  export interface Experience {
    company: string;
    position: string;
    location: string;
    type: string;
    startDate: string;
    endDate: string;
    responsibilities: string[];
  }
  
  export interface Education {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
  }
  