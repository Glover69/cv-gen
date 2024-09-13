export type ChatMessage = {
  content: string;
  sender: 'user' | 'bot';
  animate?: boolean;
}

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
  skills: Skills[];
  experiences: Experience[];
  education: Education[];
}

export interface ExperienceGroup {
  profile: string;
  skills: Skills[];
  experiences: Experience[];
}

export interface Skills {
  name: string;
  color: string;
  backgroundColor: string;
  filter: string;
}

export interface Experience {
  jobTitle: string;
  company: string;
  location: string;
  type: string;
  startDate: string;
  endDate: string;
  points: string[];
}

export interface EducationGroup {
  education: Education[];
}

export interface Education {
  institution: string;
  certification: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

export interface AuthUserInfo {
  created_at: string;
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  identities: {
    provider: string;
    user_id: string;
    connection: string;
    isSocial: boolean;
  }[];
  locale: string;
  name: string;
  nickname: string;
  picture: string;
  updated_at: string;
  user_id: string;
  last_ip: string;
  last_login: string;
  logins_count: number;
  blocked_for: any[]; // Change the type if you have specific types for this
  guardian_authenticators: any[]; // Change the type if you have specific types for this
  passkeys: any[]; // Change the type if you have specific types for this
}

export interface User {
  name: string;
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  picture: string;
  identities: {
    provider: string;
    user_id: string;
    connection: string;
    isSocial: boolean;
  }[];
  resumes: Resume[];
}


export interface SavedUser {
  email: string;
  fullname: string;
  profile: string;
  isEmailVerified: boolean;
  authID: string;
  customerID: string;
  collectionID: string;
}