export enum Page {
  Home = 'Home',
  About = 'About',
  Courses = 'Courses',
  News = 'News',
  Contact = 'Contact',
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
  imageUrls: string[];
}