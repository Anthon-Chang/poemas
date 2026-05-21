import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export interface Videojuego {
  id?: number;
  titulo: string;
  plataforma: string;
  precio: number;
  stock: number;
  categoria?: string;
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
            // Fallback para Angular + Zone.js: evita el NavigatorLockAcquireTimeoutError
            if (typeof navigator !== 'undefined' && navigator.locks) {
              try {
                return await navigator.locks.request(
                  name,
                  { mode: 'exclusive', steal: true }, // 'steal' libera locks bloqueados
                  fn
                );
              } catch (e) {
                console.warn('[Supabase] Lock falló, ejecutando sin lock:', e);
              }
            }
            return await fn(); // fallback sin lock
          }
        }
      }
    );
  }

  // ... el resto de tus métodos no cambia ...

  async listar() {
    const { data, error } = await this.supabase
      .from('videojuegos')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    return data as Videojuego[];
  }

  async obtenerPorId(id: number) {
    const { data, error } = await this.supabase
      .from('videojuegos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Videojuego;
  }

  async crear(videojuego: Videojuego) {
    const { data, error } = await this.supabase
      .from('videojuegos')
      .insert(videojuego)
      .select();

    if (error) throw error;
    return data;
  }

  async actualizar(id: number, videojuego: Videojuego) {
    const { data, error } = await this.supabase
      .from('videojuegos')
      .update(videojuego)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data;
  }

  async eliminar(id: number) {
    const { error } = await this.supabase
      .from('videojuegos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}