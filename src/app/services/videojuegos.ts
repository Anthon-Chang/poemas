import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export interface Poema {
  id?: number;
  user_id?: string;
  titulo: string;
  autor: string;
  contenido: string;
  epoca?: string;
  youtube_url?: string;
  audio_url?: string;
  imagen_url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VideojuegosService {

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
          lock: async (name, acquireTimeout, fn) => {
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
      }
    );
  }

  async listar() {
    const { data, error } = await this.supabase
      .from('poemas')
      .select('*')
      .order('id', { ascending: false });
    if (error) throw error;
    return data as Poema[];
  }

  async obtenerPorId(id: number) {
    const { data, error } = await this.supabase
      .from('poemas')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Poema;
  }

  async crear(poema: Poema) {
    const { data: { user } } = await this.supabase.auth.getUser();
    const { data, error } = await this.supabase
      .from('poemas')
      .insert({ ...poema, user_id: user?.id })
      .select();
    if (error) throw error;
    return data;
  }

  async actualizar(id: number, poema: Poema) {
    const { data, error } = await this.supabase
      .from('poemas')
      .update(poema)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data;
  }

  async eliminar(id: number) {
    const { error } = await this.supabase
      .from('poemas')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  // ── Supabase Storage ──────────────────────────────────────────────────────

  async subirImagen(file: File): Promise<string> {
    const nombre = `imagenes/${Date.now()}_${file.name}`;
    const { error } = await this.supabase.storage
      .from('poemas-media')
      .upload(nombre, file, { upsert: true });
    if (error) throw error;
    const { data } = this.supabase.storage
      .from('poemas-media')
      .getPublicUrl(nombre);
    return data.publicUrl;
  }

  async subirAudio(file: File): Promise<string> {
    const nombre = `audios/${Date.now()}_${file.name}`;
    const { error } = await this.supabase.storage
      .from('poemas-media')
      .upload(nombre, file, { upsert: true });
    if (error) throw error;
    const { data } = this.supabase.storage
      .from('poemas-media')
      .getPublicUrl(nombre);
    return data.publicUrl;
  }
}
