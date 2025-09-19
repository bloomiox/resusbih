import { supabase } from '../lib/supabase';
import { NewsArticle, Course, TeamMember, CourseParticipant, PageContent } from '../types';

// News Services
export const newsService = {
  async getAll(): Promise<NewsArticle[]> {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .order('publish_date', { ascending: false });
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      title: item.title,
      publishDate: item.publish_date,
      shortDescription: item.short_description,
      fullContent: item.full_content,
      imageUrl: item.image_url,
    }));
  },

  async create(article: Omit<NewsArticle, 'id'>): Promise<NewsArticle> {
    const { data, error } = await supabase
      .from('news_articles')
      .insert({
        title: article.title,
        publish_date: article.publishDate,
        short_description: article.shortDescription,
        full_content: article.fullContent,
        image_url: article.imageUrl,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      publishDate: data.publish_date,
      shortDescription: data.short_description,
      fullContent: data.full_content,
      imageUrl: data.image_url,
    };
  },

  async update(id: number, updates: Partial<NewsArticle>): Promise<NewsArticle> {
    const updateData: any = {};
    if (updates.title) updateData.title = updates.title;
    if (updates.publishDate) updateData.publish_date = updates.publishDate;
    if (updates.shortDescription) updateData.short_description = updates.shortDescription;
    if (updates.fullContent) updateData.full_content = updates.fullContent;
    if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl;

    const { data, error } = await supabase
      .from('news_articles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      publishDate: data.publish_date,
      shortDescription: data.short_description,
      fullContent: data.full_content,
      imageUrl: data.image_url,
    };
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('news_articles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};

// Courses Services
export const coursesService = {
  async getAll(): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      audience: item.audience,
      imageUrl: item.image_url,
      details: {
        duration: item.duration,
        certification: item.certification,
        topics: item.topics,
      },
    }));
  },

  async create(course: Omit<Course, 'id'>): Promise<Course> {
    const { data, error } = await supabase
      .from('courses')
      .insert({
        title: course.title,
        description: course.description,
        audience: course.audience,
        image_url: course.imageUrl,
        duration: course.details.duration,
        certification: course.details.certification,
        topics: course.details.topics,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      audience: data.audience,
      imageUrl: data.image_url,
      details: {
        duration: data.duration,
        certification: data.certification,
        topics: data.topics,
      },
    };
  },

  async update(id: number, updates: Partial<Course>): Promise<Course> {
    const updateData: any = {};
    if (updates.title) updateData.title = updates.title;
    if (updates.description) updateData.description = updates.description;
    if (updates.audience) updateData.audience = updates.audience;
    if (updates.imageUrl) updateData.image_url = updates.imageUrl;
    if (updates.details?.duration) updateData.duration = updates.details.duration;
    if (updates.details?.certification) updateData.certification = updates.details.certification;
    if (updates.details?.topics) updateData.topics = updates.details.topics;

    const { data, error } = await supabase
      .from('courses')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      audience: data.audience,
      imageUrl: data.image_url,
      details: {
        duration: data.duration,
        certification: data.certification,
        topics: data.topics,
      },
    };
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};

// Team Services
export const teamService = {
  async getAll(): Promise<TeamMember[]> {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      role: item.role,
      spec: item.spec,
      imageUrl: item.image_url,
    }));
  },

  async create(member: Omit<TeamMember, 'id'>): Promise<TeamMember> {
    const { data, error } = await supabase
      .from('team_members')
      .insert({
        name: member.name,
        role: member.role,
        spec: member.spec,
        image_url: member.imageUrl,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      role: data.role,
      spec: data.spec,
      imageUrl: data.image_url,
    };
  },

  async update(id: number, updates: Partial<TeamMember>): Promise<TeamMember> {
    const updateData: any = {};
    if (updates.name) updateData.name = updates.name;
    if (updates.role) updateData.role = updates.role;
    if (updates.spec) updateData.spec = updates.spec;
    if (updates.imageUrl) updateData.image_url = updates.imageUrl;

    const { data, error } = await supabase
      .from('team_members')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      role: data.role,
      spec: data.spec,
      imageUrl: data.image_url,
    };
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};

// Participants Services
export const participantsService = {
  async getAll(): Promise<CourseParticipant[]> {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      firstName: item.first_name,
      lastName: item.last_name,
      email: item.email,
      phone: item.phone,
      address: item.address || '',
      dateOfBirth: item.date_of_birth || '',
      profession: item.profession || '',
      courseId: item.course_id,
      courseName: item.course_name,
      registrationDate: item.registration_date,
      completionDate: item.completion_date || undefined,
      certificateIssued: item.certificate_issued,
      certificateNumber: item.certificate_number || undefined,
      status: item.status,
      notes: item.notes || undefined,
    }));
  },

  async create(participant: Omit<CourseParticipant, 'id'>): Promise<CourseParticipant> {
    const { data, error } = await supabase
      .from('participants')
      .insert({
        first_name: participant.firstName,
        last_name: participant.lastName,
        email: participant.email,
        phone: participant.phone,
        address: participant.address || null,
        date_of_birth: participant.dateOfBirth || null,
        profession: participant.profession || null,
        course_id: participant.courseId,
        course_name: participant.courseName,
        registration_date: participant.registrationDate,
        completion_date: participant.completionDate || null,
        certificate_issued: participant.certificateIssued || false,
        certificate_number: participant.certificateNumber || null,
        status: participant.status || 'registered',
        notes: participant.notes || null,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      phone: data.phone,
      address: data.address || '',
      dateOfBirth: data.date_of_birth || '',
      profession: data.profession || '',
      courseId: data.course_id,
      courseName: data.course_name,
      registrationDate: data.registration_date,
      completionDate: data.completion_date || undefined,
      certificateIssued: data.certificate_issued,
      certificateNumber: data.certificate_number || undefined,
      status: data.status,
      notes: data.notes || undefined,
    };
  },

  async update(id: number, updates: Partial<CourseParticipant>): Promise<CourseParticipant> {
    const updateData: any = {};
    if (updates.firstName) updateData.first_name = updates.firstName;
    if (updates.lastName) updateData.last_name = updates.lastName;
    if (updates.email) updateData.email = updates.email;
    if (updates.phone) updateData.phone = updates.phone;
    if (updates.address !== undefined) updateData.address = updates.address || null;
    if (updates.dateOfBirth !== undefined) updateData.date_of_birth = updates.dateOfBirth || null;
    if (updates.profession !== undefined) updateData.profession = updates.profession || null;
    if (updates.courseId) updateData.course_id = updates.courseId;
    if (updates.courseName) updateData.course_name = updates.courseName;
    if (updates.registrationDate) updateData.registration_date = updates.registrationDate;
    if (updates.completionDate !== undefined) updateData.completion_date = updates.completionDate || null;
    if (updates.certificateIssued !== undefined) updateData.certificate_issued = updates.certificateIssued;
    if (updates.certificateNumber !== undefined) updateData.certificate_number = updates.certificateNumber || null;
    if (updates.status) updateData.status = updates.status;
    if (updates.notes !== undefined) updateData.notes = updates.notes || null;

    const { data, error } = await supabase
      .from('participants')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      phone: data.phone,
      address: data.address || '',
      dateOfBirth: data.date_of_birth || '',
      profession: data.profession || '',
      courseId: data.course_id,
      courseName: data.course_name,
      registrationDate: data.registration_date,
      completionDate: data.completion_date || undefined,
      certificateIssued: data.certificate_issued,
      certificateNumber: data.certificate_number || undefined,
      status: data.status,
      notes: data.notes || undefined,
    };
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('participants')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};

// Page Content Services
export const pageContentService = {
  async getAll(): Promise<PageContent> {
    const { data, error } = await supabase
      .from('page_content')
      .select('*');
    
    if (error) throw error;
    
    const pageContent: PageContent = {
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
    };

    data.forEach(item => {
      if (item.page_key === 'home') {
        pageContent.home = item.content;
      } else if (item.page_key === 'about') {
        pageContent.about = item.content;
      } else if (item.page_key === 'contact') {
        pageContent.contact = item.content;
      }
    });

    return pageContent;
  },

  async update(pageKey: keyof PageContent, content: any): Promise<void> {
    const { error } = await supabase
      .from('page_content')
      .upsert({
        page_key: pageKey,
        content: content,
      });
    
    if (error) throw error;
  },
};