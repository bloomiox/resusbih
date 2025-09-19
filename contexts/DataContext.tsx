import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NewsArticle, Course, TeamMember, CourseParticipant, PageContent } from '../types';
import { newsService, coursesService, teamService, participantsService, pageContentService } from '../services/supabaseService';

interface DataContextType {
  // Loading states
  loading: boolean;
  error: string | null;
  
  // News
  news: NewsArticle[];
  addNews: (article: Omit<NewsArticle, 'id'>) => Promise<void>;
  updateNews: (id: number, article: Partial<NewsArticle>) => Promise<void>;
  deleteNews: (id: number) => Promise<void>;
  
  // Courses
  courses: Course[];
  addCourse: (course: Omit<Course, 'id'>) => Promise<void>;
  updateCourse: (id: number, course: Partial<Course>) => Promise<void>;
  deleteCourse: (id: number) => Promise<void>;
  
  // Team
  team: TeamMember[];
  addTeamMember: (member: Omit<TeamMember, 'id'>) => Promise<void>;
  updateTeamMember: (id: number, member: Partial<TeamMember>) => Promise<void>;
  deleteTeamMember: (id: number) => Promise<void>;
  
  // Participants
  participants: CourseParticipant[];
  addParticipant: (participant: Omit<CourseParticipant, 'id'>) => Promise<void>;
  updateParticipant: (id: number, participant: Partial<CourseParticipant>) => Promise<void>;
  deleteParticipant: (id: number) => Promise<void>;
  registerForCourse: (registration: any) => Promise<void>;
  
  // Page Content
  pageContent: PageContent;
  updatePageContent: (page: keyof PageContent, content: any) => Promise<void>;
  
  // Refresh data
  refreshData: () => Promise<void>;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [participants, setParticipants] = useState<CourseParticipant[]>([]);
  const [pageContent, setPageContent] = useState<PageContent>({
    home: {
      heroTitle: 'Udruženje Resuscitacijski savjet u Bosni i Hercegovini',
      heroSubtitle: 'Znanje koje spašava živote',
      aboutSection: 'Naša misija je promicanje i unaprjeđenje znanja i vještina oživljavanja u Bosni i Hercegovini.',
    },
    about: {
      title: 'O nama',
      content: 'Udruženje Resuscitacijski savjet u Bosni i Hercegovini osnovano je s ciljem promicanja i unaprjeđenja znanja i vještina oživljavanja.',
    },
    contact: {
      title: 'Kontakt',
      content: 'Kontaktirajte nas za više informacija o našim kursevima i aktivnostima.',
    },
  });

  // Load initial data
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [newsData, coursesData, teamData, pageContentData] = await Promise.all([
        newsService.getAll(),
        coursesService.getAll(),
        teamService.getAll(),
        pageContentService.getAll(),
      ]);

      setNews(newsData);
      setCourses(coursesData);
      setTeam(teamData);
      setPageContent(pageContentData);

      // Load participants
      try {
        const participantsData = await participantsService.getAll();
        setParticipants(participantsData);
      } catch (error) {
        // Ignore auth errors for participants - they're admin-only
        console.log('Participants not loaded (admin-only)');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // News functions
  const addNews = async (article: Omit<NewsArticle, 'id'>) => {
    try {
      const newArticle = await newsService.create(article);
      setNews(prev => [newArticle, ...prev].sort((a, b) => 
        new Date(b.publishDate.split('.').reverse().join('-')).getTime() - 
        new Date(a.publishDate.split('.').reverse().join('-')).getTime()
      ));
    } catch (error) {
      console.error('Error adding news:', error);
      throw error;
    }
  };

  const updateNews = async (id: number, updates: Partial<NewsArticle>) => {
    try {
      const updatedArticle = await newsService.update(id, updates);
      setNews(prev => prev.map(article => 
        article.id === id ? updatedArticle : article
      ).sort((a, b) => 
        new Date(b.publishDate.split('.').reverse().join('-')).getTime() - 
        new Date(a.publishDate.split('.').reverse().join('-')).getTime()
      ));
    } catch (error) {
      console.error('Error updating news:', error);
      throw error;
    }
  };

  const deleteNews = async (id: number) => {
    try {
      await newsService.delete(id);
      setNews(prev => prev.filter(article => article.id !== id));
    } catch (error) {
      console.error('Error deleting news:', error);
      throw error;
    }
  };

  // Courses functions
  const addCourse = async (course: Omit<Course, 'id'>) => {
    try {
      const newCourse = await coursesService.create(course);
      setCourses(prev => [...prev, newCourse]);
    } catch (error) {
      console.error('Error adding course:', error);
      throw error;
    }
  };

  const updateCourse = async (id: number, updates: Partial<Course>) => {
    try {
      const updatedCourse = await coursesService.update(id, updates);
      setCourses(prev => prev.map(course => 
        course.id === id ? updatedCourse : course
      ));
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  };

  const deleteCourse = async (id: number) => {
    try {
      await coursesService.delete(id);
      setCourses(prev => prev.filter(course => course.id !== id));
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  };

  // Team functions
  const addTeamMember = async (member: Omit<TeamMember, 'id'>) => {
    try {
      const newMember = await teamService.create(member);
      setTeam(prev => [...prev, newMember]);
    } catch (error) {
      console.error('Error adding team member:', error);
      throw error;
    }
  };

  const updateTeamMember = async (id: number, updates: Partial<TeamMember>) => {
    try {
      const updatedMember = await teamService.update(id, updates);
      setTeam(prev => prev.map(member => 
        member.id === id ? updatedMember : member
      ));
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error;
    }
  };

  const deleteTeamMember = async (id: number) => {
    try {
      await teamService.delete(id);
      setTeam(prev => prev.filter(member => member.id !== id));
    } catch (error) {
      console.error('Error deleting team member:', error);
      throw error;
    }
  };

  // Participants functions
  const addParticipant = async (participant: Omit<CourseParticipant, 'id'>) => {
    try {
      const newParticipant = await participantsService.create(participant);
      setParticipants(prev => [newParticipant, ...prev]);
    } catch (error) {
      console.error('Error adding participant:', error);
      throw error;
    }
  };

  const updateParticipant = async (id: number, updates: Partial<CourseParticipant>) => {
    try {
      const updatedParticipant = await participantsService.update(id, updates);
      setParticipants(prev => prev.map(participant => 
        participant.id === id ? updatedParticipant : participant
      ));
    } catch (error) {
      console.error('Error updating participant:', error);
      throw error;
    }
  };

  const deleteParticipant = async (id: number) => {
    try {
      await participantsService.delete(id);
      setParticipants(prev => prev.filter(participant => participant.id !== id));
    } catch (error) {
      console.error('Error deleting participant:', error);
      throw error;
    }
  };

  const registerForCourse = async (registration: any) => {
    try {
      const result = await participantsService.create(registration);
      // Refresh participants data
      try {
        const participantsData = await participantsService.getAll();
        setParticipants(participantsData);
      } catch (error) {
        // Ignore if error
      }
      return result;
    } catch (error) {
      console.error('Error registering for course:', error);
      throw error;
    }
  };

  // Page content functions
  const updatePageContent = async (page: keyof PageContent, content: any) => {
    try {
      await pageContentService.update(page, content);
      setPageContent(prev => ({
        ...prev,
        [page]: content,
      }));
    } catch (error) {
      console.error('Error updating page content:', error);
      throw error;
    }
  };

  const value: DataContextType = {
    loading,
    error,
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
    registerForCourse,
    pageContent,
    updatePageContent,
    refreshData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};