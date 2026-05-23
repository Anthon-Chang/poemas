import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export const supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    lock: async (name: string, acquireTimeout: number, fn: () => Promise<any>) => {
      if (typeof navigator !== 'undefined' && navigator.locks) {
        try {
          return await navigator.locks.request(
            name,
            { mode: 'exclusive', steal: true },
            fn
          );
        } catch (e) {
          console.warn('[Supabase] Lock falló, ejecutando sin lock:', e);
        }
      }
      return await fn();
    }
  }
});
