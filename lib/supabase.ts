import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface Database {
  public: {
    Tables: {
      news_articles: {
        Row: {
          id: number
          title: string
          publish_date: string
          short_description: string
          full_content: string
          image_url: string | null
          gallery_images: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          title: string
          publish_date: string
          short_description: string
          full_content: string
          image_url?: string | null
          gallery_images?: string[] | null
        }
        Update: {
          title?: string
          publish_date?: string
          short_description?: string
          full_content?: string
          image_url?: string | null
          gallery_images?: string[] | null
        }
      }
      courses: {
        Row: {
          id: number
          title: string
          description: string
          audience: string
          image_url: string
          duration: string
          certification: string
          topics: string[]
          registration_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          title: string
          description: string
          audience: string
          image_url: string
          duration: string
          certification: string
          topics: string[]
          registration_enabled?: boolean
        }
        Update: {
          title?: string
          description?: string
          audience?: string
          image_url?: string
          duration?: string
          certification?: string
          topics?: string[]
          registration_enabled?: boolean
        }
      }
      team_members: {
        Row: {
          id: number
          name: string
          role: string
          spec: string
          image_url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          role: string
          spec: string
          image_url: string
        }
        Update: {
          name?: string
          role?: string
          spec?: string
          image_url?: string
        }
      }
      participants: {
        Row: {
          id: number
          first_name: string
          last_name: string
          email: string
          phone: string
          address: string | null
          date_of_birth: string | null
          profession: string | null
          course_id: number
          course_name: string
          registration_date: string
          completion_date: string | null
          certificate_issued: boolean
          certificate_number: string | null
          status: 'registered' | 'completed' | 'cancelled'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          first_name: string
          last_name: string
          email: string
          phone: string
          address?: string | null
          date_of_birth?: string | null
          profession?: string | null
          course_id: number
          course_name: string
          registration_date: string
          completion_date?: string | null
          certificate_issued?: boolean
          certificate_number?: string | null
          status?: 'registered' | 'completed' | 'cancelled'
          notes?: string | null
        }
        Update: {
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          address?: string | null
          date_of_birth?: string | null
          profession?: string | null
          course_id?: number
          course_name?: string
          registration_date?: string
          completion_date?: string | null
          certificate_issued?: boolean
          certificate_number?: string | null
          status?: 'registered' | 'completed' | 'cancelled'
          notes?: string | null
        }
      }
      page_content: {
        Row: {
          id: number
          page_key: string
          content: any
          created_at: string
          updated_at: string
        }
        Insert: {
          page_key: string
          content: any
        }
        Update: {
          page_key?: string
          content?: any
        }
      }
    }
  }
}