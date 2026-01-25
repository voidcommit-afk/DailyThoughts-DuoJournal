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
                    primary_color: string | null
                    accent_color: string | null
                    background_color: string | null
                    font_size: string | null
                    background_type: string | null
                    background_value: string | null
                    background_blur: number | null
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
                    primary_color?: string | null
                    accent_color?: string | null
                    background_color?: string | null
                    font_size?: string | null
                    background_type?: string | null
                    background_value?: string | null
                    background_blur?: number | null
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
                    primary_color?: string | null
                    accent_color?: string | null
                    background_color?: string | null
                    font_size?: string | null
                    background_type?: string | null
                    background_value?: string | null
                    background_blur?: number | null
                }
            }
        }
    }
}
