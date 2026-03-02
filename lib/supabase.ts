import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export const createClient = (token?: string) => {
    const options: any = {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
        },
        global: {
            headers: {}
        }
    };

    // If a token is provided, inject it as a custom header for RLS
    if (token) {
        options.global.headers['x-primelink-token'] = token;
    }

    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
        options
    );
};

// Helper for generic client-side operations (like UUID generation)
export const supabase = createClient();
