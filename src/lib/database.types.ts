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
            entries: {
                Row: {
                    audio_notes: string[] | null
                    content: string
                    created_at: string
                    date: string
                    id: string
                    images: string[] | null
                    updated_at: string
                    user_id: string
                }
                Insert: {
                    audio_notes?: string[] | null
                    content: string
                    created_at?: string
                    date: string
                    id?: string
                    images?: string[] | null
                    updated_at?: string
                    user_id: string
                }
                Update: {
                    audio_notes?: string[] | null
                    content?: string
                    created_at?: string
                    date?: string
                    id?: string
                    images?: string[] | null
                    updated_at?: string
                    user_id?: string
                }
            }
            users: {
                Row: {
                    color_preset: string
                    created_at: string
                    display_name: string
                    email: string | null
                    emoji: string
                    font_family: string
                    id: string
                    partner_emoji: string | null
                    partner_id: string | null
                    theme: string
                }
                Insert: {
                    color_preset?: string
                    created_at?: string
                    display_name?: string
                    email?: string | null
                    emoji?: string
                    font_family?: string
                    id: string
                    partner_emoji?: string | null
                    partner_id?: string | null
                    theme?: string
                }
                Update: {
                    color_preset?: string
                    created_at?: string
                    display_name?: string
                    email?: string | null
                    emoji?: string
                    font_family?: string
                    id?: string
                    partner_emoji?: string | null
                    partner_id?: string | null
                    theme?: string
                }
            }
        }
    }
}
