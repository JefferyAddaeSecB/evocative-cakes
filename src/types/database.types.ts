export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string
          source: 'contact_form' | 'chatbot'
          customer_name: string
          customer_email: string
          customer_phone: string
          event_type: string | null
          event_date: string | null
          cake_description: string
          dietary_restrictions: string | null
          serving_size: string | null
          design_preferences: string | null
          status: 'new' | 'started' | 'in_progress' | 'completed' | 'delivered'
          admin_notes: string | null
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          source: 'contact_form' | 'chatbot'
          customer_name: string
          customer_email: string
          customer_phone: string
          event_type?: string | null
          event_date?: string | null
          cake_description: string
          dietary_restrictions?: string | null
          serving_size?: string | null
          design_preferences?: string | null
          status?: 'new' | 'started' | 'in_progress' | 'completed' | 'delivered'
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          source?: 'contact_form' | 'chatbot'
          customer_name?: string
          customer_email?: string
          customer_phone?: string
          event_type?: string | null
          event_date?: string | null
          cake_description?: string
          dietary_restrictions?: string | null
          serving_size?: string | null
          design_preferences?: string | null
          status?: 'new' | 'started' | 'in_progress' | 'completed' | 'delivered'
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
      }
      gallery_images: {
        Row: {
          id: string
          placement: 'gallery' | 'hero'
          category: 'Wedding Cakes' | 'Birthday Cakes' | 'Cupcakes' | 'Cookies & Treats' | 'Custom Cakes' | null
          title: string | null
          description: string | null
          alt_text: string | null
          storage_path: string
          sort_order: number
          is_published: boolean
          is_archived: boolean
          created_at: string
          updated_at: string
          archived_at: string | null
        }
        Insert: {
          id?: string
          placement: 'gallery' | 'hero'
          category?: 'Wedding Cakes' | 'Birthday Cakes' | 'Cupcakes' | 'Cookies & Treats' | 'Custom Cakes' | null
          title?: string | null
          description?: string | null
          alt_text?: string | null
          storage_path: string
          sort_order?: number
          is_published?: boolean
          is_archived?: boolean
          created_at?: string
          updated_at?: string
          archived_at?: string | null
        }
        Update: {
          id?: string
          placement?: 'gallery' | 'hero'
          category?: 'Wedding Cakes' | 'Birthday Cakes' | 'Cupcakes' | 'Cookies & Treats' | 'Custom Cakes' | null
          title?: string | null
          description?: string | null
          alt_text?: string | null
          storage_path?: string
          sort_order?: number
          is_published?: boolean
          is_archived?: boolean
          created_at?: string
          updated_at?: string
          archived_at?: string | null
        }
      }
      order_images: {
        Row: {
          id: string
          order_id: string
          image_url: string
          file_name: string | null
          file_size: number | null
          uploaded_at: string
        }
        Insert: {
          id?: string
          order_id: string
          image_url: string
          file_name?: string | null
          file_size?: number | null
          uploaded_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          image_url?: string
          file_name?: string | null
          file_size?: number | null
          uploaded_at?: string
        }
      }
      chatbot_conversations: {
        Row: {
          id: string
          order_id: string
          messages: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          messages: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          messages?: Json
          created_at?: string
          updated_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
      }
    }
  }
}
