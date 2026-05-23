import { Injectable } from '@angular/core';
import { SupabaseClient, Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase.client';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private supabase: SupabaseClient = supabase;
  private _session = new BehaviorSubject<Session | null>(null);

  session$: Observable<Session | null> = this._session.asObservable();

  constructor() {

    // Cargar sesión existente al iniciar
    this.supabase.auth.getSession().then(({ data }) => {
      this._session.next(data.session);
    });

    // Escuchar cambios de sesión
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this._session.next(session);
    });
  }

  get currentUser(): User | null {
    return this._session.value?.user ?? null;
  }

  get isLoggedIn(): boolean {
    return !!this._session.value;
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async register(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }
}
