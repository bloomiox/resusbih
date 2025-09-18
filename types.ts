export enum Page {
  Home = 'Home',
  About = 'About',
  Courses = 'Courses',
  News = 'News',
  Contact = 'Contact',
  Login = 'Login',
  Admin = 'Admin',
}

export interface CourseDetails {
  duration: string;
  certification: string;
  topics: string[];
}

export interface Course {
  id: number;
  title: string;
  description: string;
  audience: string;
  imageUrl: string;
  details: CourseDetails;
  registrationEnabled: boolean;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  spec: string;
  imageUrl: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  publishDate: string;
  shortDescription: string;
  fullContent: string;
  imageUrl?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user?: {
    email: string;
  };
}

export interface PageContent {
  home: {
    heroTitle: string;
    heroSubtitle: string;
    aboutSection: string;
  };
  about: {
    title: string;
    content: string;
  };
  contact: {
    title: string;
    content: string;
  };
}

export interface CourseParticipant {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  profession: string;
  courseId: number;
  courseName: string;
  registrationDate: string;
  completionDate?: string;
  certificateIssued: boolean;
  certificateNumber?: string;
  status: 'registered' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Certificate {
  participantId: number;
  participantName: string;
  courseName: string;
  completionDate: string;
  certificateNumber: string;
  issueDate: string;
}