import React, { createContext, useContext, useState, ReactNode } from 'react';
import { NewsArticle, Course, TeamMember, CourseParticipant, PageContent } from '../types';
import { NEWS_DATA, COURSES_DATA, TEAM_DATA, PARTICIPANTS_DATA } from '../constants';

interface DataContextType {
  // News
  news: NewsArticle[];
  addNews: (article: Omit<NewsArticle, 'id'>) => void;
  updateNews: (id: number, article: Partial<NewsArticle>) => void;
  deleteNews: (id: number) => void;
  
  // Courses
  courses: Course[];
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: number, course: Partial<Course>) => void;
  deleteCourse: (id: number) => void;
  
  // Team
  team: TeamMember[];
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  updateTeamMember: (id: number, member: Partial<TeamMember>) => void;
  deleteTeamMember: (id: number) => void;
  
  // Participants
  participants: CourseParticipant[];
  addParticipant: (participant: Omit<CourseParticipant, 'id'>) => void;
  updateParticipant: (id: number, participant: Partial<CourseParticipant>) => void;
  deleteParticipant: (id: number) => void;
  
  // Page Content
  pageContent: PageContent;
  updatePageContent: (page: keyof PageContent, content: any) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [news, setNews] = useState<NewsArticle[]>(
    NEWS_DATA.sort((a, b) => new Date(b.publishDate.split('.').reverse().join('-')).getTime() - new Date(a.publishDate.split('.').reverse().join('-')).getTime())
  );
  const [courses, setCourses] = useState<Course[]>(COURSES_DATA);
  const [team, setTeam] = useState<TeamMember[]>(TEAM_DATA);
  const [participants, setParticipants] = useState<CourseParticipant[]>(PARTICIPANTS_DATA);
  const [pageContent, setPageContent] = useState<PageContent>({
    home: {
      heroTitle: 'Udruženje Resuscitacijski savjet u Bosni i Hercegovini',
      heroSubtitle: 'Znanje koje spašava živote',
      aboutSection: 'Naša misija je promicanje i unaprjeđenje znanja i vještina oživljavanja u Bosni i Hercegovini, kako među zdravstvenim djelatnicima, tako i u široj javnosti. Vjerujemo da edukacijom možemo značajno povećati stopu preživljavanja kod iznenadnog srčanog zastoja.',
    },
    about: {
      title: 'O nama',
      content: 'Udruženje Resuscitacijski savjet u Bosni i Hercegovini osnovano je s ciljem promicanja i unaprjeđenja znanja i vještina oživljavanja širom zemlje, u skladu s najnovijim europskim i svjetskim smjernicama. Radujemo se budućim projektima i suradnji sa svim zainteresiranim stranama u svrhu spašavanja života.',
    },
    contact: {
      title: 'Kontakt',
      content: 'Kontaktirajte nas za više informacija o našim kursevima i aktivnostima. Naš tim stručnjaka spreman je odgovoriti na sva vaša pitanja.',
    },
  });

  // News functions
  const addNews = (article: Omit<NewsArticle, 'id'>) => {
    const newArticle: NewsArticle = {
      ...article,
      id: Math.max(...news.map(n => n.id)) + 1,
    };
    const updatedNews = [newArticle, ...news];
    // Sort by date (newest first)
    updatedNews.sort((a, b) => new Date(b.publishDate.split('.').reverse().join('-')).getTime() - new Date(a.publishDate.split('.').reverse().join('-')).getTime());
    setNews(updatedNews);
  };

  const updateNews = (id: number, updatedArticle: Partial<NewsArticle>) => {
    const updatedNews = news.map(article => 
      article.id === id ? { ...article, ...updatedArticle } : article
    );
    // Sort by date (newest first)
    updatedNews.sort((a, b) => new Date(b.publishDate.split('.').reverse().join('-')).getTime() - new Date(a.publishDate.split('.').reverse().join('-')).getTime());
    setNews(updatedNews);
  };

  const deleteNews = (id: number) => {
    setNews(news.filter(article => article.id !== id));
  };

  // Courses functions
  const addCourse = (course: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...course,
      id: Math.max(...courses.map(c => c.id)) + 1,
    };
    setCourses([...courses, newCourse]);
  };

  const updateCourse = (id: number, updatedCourse: Partial<Course>) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, ...updatedCourse } : course
    ));
  };

  const deleteCourse = (id: number) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  // Team functions
  const addTeamMember = (member: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...member,
      id: Math.max(...team.map(m => m.id)) + 1,
    };
    setTeam([...team, newMember]);
  };

  const updateTeamMember = (id: number, updatedMember: Partial<TeamMember>) => {
    setTeam(team.map(member => 
      member.id === id ? { ...member, ...updatedMember } : member
    ));
  };

  const deleteTeamMember = (id: number) => {
    setTeam(team.filter(member => member.id !== id));
  };

  // Participants functions
  const addParticipant = (participant: Omit<CourseParticipant, 'id'>) => {
    const newParticipant: CourseParticipant = {
      ...participant,
      id: Math.max(...participants.map(p => p.id)) + 1,
    };
    setParticipants([...participants, newParticipant]);
  };

  const updateParticipant = (id: number, updatedParticipant: Partial<CourseParticipant>) => {
    setParticipants(participants.map(participant => 
      participant.id === id ? { ...participant, ...updatedParticipant } : participant
    ));
  };

  const deleteParticipant = (id: number) => {
    setParticipants(participants.filter(participant => participant.id !== id));
  };

  // Page content functions
  const updatePageContent = (page: keyof PageContent, content: any) => {
    setPageContent(prev => ({
      ...prev,
      [page]: content,
    }));
  };

  const value: DataContextType = {
    news,
    addNews,
    updateNews,
    deleteNews,
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    team,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    participants,
    addParticipant,
    updateParticipant,
    deleteParticipant,
    pageContent,
    updatePageContent,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};