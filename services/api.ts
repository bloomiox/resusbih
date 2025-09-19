import { NewsArticle, Course, TeamMember, CourseParticipant, PageContent } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Authentication
  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    const response = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.token = response.token;
    localStorage.setItem('authToken', response.token);
    
    return response;
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', { method: 'POST' });
    this.token = null;
    localStorage.removeItem('authToken');
  }

  async verifyToken(): Promise<{ user: any }> {
    return this.request('/auth/verify');
  }

  // News
  async getNews(): Promise<NewsArticle[]> {
    return this.request('/news');
  }

  async getNewsById(id: number): Promise<NewsArticle> {
    return this.request(`/news/${id}`);
  }

  async createNews(article: Omit<NewsArticle, 'id'>): Promise<NewsArticle> {
    return this.request('/news', {
      method: 'POST',
      body: JSON.stringify(article),
    });
  }

  async updateNews(id: number, updates: Partial<NewsArticle>): Promise<NewsArticle> {
    return this.request(`/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteNews(id: number): Promise<void> {
    return this.request(`/news/${id}`, { method: 'DELETE' });
  }

  // Courses
  async getCourses(): Promise<Course[]> {
    return this.request('/courses');
  }

  async getCourseById(id: number): Promise<Course> {
    return this.request(`/courses/${id}`);
  }

  async createCourse(course: Omit<Course, 'id'>): Promise<Course> {
    return this.request('/courses', {
      method: 'POST',
      body: JSON.stringify(course),
    });
  }

  async updateCourse(id: number, updates: Partial<Course>): Promise<Course> {
    return this.request(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteCourse(id: number): Promise<void> {
    return this.request(`/courses/${id}`, { method: 'DELETE' });
  }

  // Team
  async getTeam(): Promise<TeamMember[]> {
    return this.request('/team');
  }

  async getTeamMemberById(id: number): Promise<TeamMember> {
    return this.request(`/team/${id}`);
  }

  async createTeamMember(member: Omit<TeamMember, 'id'>): Promise<TeamMember> {
    return this.request('/team', {
      method: 'POST',
      body: JSON.stringify(member),
    });
  }

  async updateTeamMember(id: number, updates: Partial<TeamMember>): Promise<TeamMember> {
    return this.request(`/team/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTeamMember(id: number): Promise<void> {
    return this.request(`/team/${id}`, { method: 'DELETE' });
  }

  // Participants
  async getParticipants(): Promise<CourseParticipant[]> {
    return this.request('/participants');
  }

  async getParticipantById(id: number): Promise<CourseParticipant> {
    return this.request(`/participants/${id}`);
  }

  async registerForCourse(registration: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    courseId: number;
    address?: string;
    dateOfBirth?: string;
    profession?: string;
    notes?: string;
  }): Promise<{ message: string; participant: any }> {
    return this.request('/participants/register', {
      method: 'POST',
      body: JSON.stringify(registration),
    });
  }

  async createParticipant(participant: Omit<CourseParticipant, 'id'>): Promise<CourseParticipant> {
    return this.request('/participants', {
      method: 'POST',
      body: JSON.stringify(participant),
    });
  }

  async updateParticipant(id: number, updates: Partial<CourseParticipant>): Promise<CourseParticipant> {
    return this.request(`/participants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteParticipant(id: number): Promise<void> {
    return this.request(`/participants/${id}`, { method: 'DELETE' });
  }

  // Page Content
  async getPageContent(): Promise<PageContent> {
    return this.request('/page-content');
  }

  async getPageContentByKey(pageKey: string): Promise<any> {
    return this.request(`/page-content/${pageKey}`);
  }

  async updatePageContent(pageKey: string, content: any): Promise<{ pageKey: string; content: any }> {
    return this.request(`/page-content/${pageKey}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  }

  // Analytics
  async trackEvent(eventType: string, eventData?: any): Promise<void> {
    return this.request('/analytics/track', {
      method: 'POST',
      body: JSON.stringify({ eventType, eventData }),
    });
  }

  async getAnalyticsDashboard(timeRange: '7d' | '30d' | '90d' = '30d'): Promise<any> {
    return this.request(`/analytics/dashboard?timeRange=${timeRange}`);
  }

  async getRegistrationAnalytics(): Promise<any> {
    return this.request('/analytics/registrations');
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; version: string }> {
    return this.request('/health');
  }
}

export const apiService = new ApiService();
export default apiService;