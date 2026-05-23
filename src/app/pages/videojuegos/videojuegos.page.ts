import { Component, OnInit } from '@angular/core';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonLabel,
  IonIcon,
  IonFab,
  IonFabButton,
  IonChip,
  IonSearchbar,
  IonSkeletonText,
  IonButtons,
  IonButton
} from '@ionic/angular/standalone';

import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { addIcons } from 'ionicons';

import {
  bookOutline,
  addOutline,
  createOutline,
  trashOutline,
  musicalNoteOutline,
  logoYoutube,
  timeOutline,
  logOutOutline
} from 'ionicons/icons';

import { VideojuegosService, Poema } from '../../services/videojuegos';
import { AuthService } from '../../services/auth.service';

import {
  DomSanitizer,
  SafeResourceUrl
} from '@angular/platform-browser';

@Component({
  selector: 'app-videojuegos',
  templateUrl: './videojuegos.page.html',
  styleUrls: ['./videojuegos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,

    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,

    IonLabel,
    IonIcon,
    IonFab,
    IonFabButton,
    IonChip,
    IonSearchbar,
    IonSkeletonText,
    IonButtons,
    IonButton
  ]
})
export class VideojuegosPage implements OnInit {

  poemas: Poema[] = [];
  poemasFiltrados: Poema[] = [];

  busqueda: string = '';
  cargando: boolean = true;

  poemaActivo: Poema | null = null;
  videoUrl: SafeResourceUrl | null = null;

  audioActivo: HTMLAudioElement | null = null;
  reproduciendo: boolean = false;
  poemaReproduciendoId: number | null = null;

  constructor(
    private videojuegosService: VideojuegosService,
    private sanitizer: DomSanitizer,
    private auth: AuthService,
    private router: Router
  ) {
    addIcons({
      bookOutline,
      addOutline,
      createOutline,
      trashOutline,
      musicalNoteOutline,
      logoYoutube,
      timeOutline,
      logOutOutline
    });
  }

  ngOnInit() {
    this.cargar();
  }

  ionViewWillEnter() {
    this.cargar();
  }

  async cargar() {
    this.cargando = true;

    try {
      this.poemas = await this.videojuegosService.listar();
      this.poemasFiltrados = [...this.poemas];
    } catch (e) {
      console.error(e);
    } finally {
      this.cargando = false;
    }
  }

  filtrar(event: any) {
    const q = event.detail.value?.toLowerCase() || '';

    this.poemasFiltrados = this.poemas.filter(p =>
      p.titulo.toLowerCase().includes(q) ||
      p.autor.toLowerCase().includes(q) ||
      (p.epoca || '').toLowerCase().includes(q)
    );
  }

  async eliminar(id: number) {
    await this.videojuegosService.eliminar(id);
    await this.cargar();
  }

  // ─────────────────────────────────────────────
  // VIDEO YOUTUBE
  // ─────────────────────────────────────────────

  verVideo(poema: Poema) {

    if (!poema.youtube_url) return;

    this.poemaActivo = poema;

    const videoId = this.extraerYoutubeId(poema.youtube_url);

    if (videoId) {
      this.videoUrl =
        this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
        );
    }
  }

  cerrarVideo() {
    this.poemaActivo = null;
    this.videoUrl = null;
  }

  extraerYoutubeId(url: string): string | null {

    const regExp =
      /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    const match = url.match(regExp);

    return match ? match[1] : null;
  }

  // ─────────────────────────────────────────────
  // AUDIO
  // ─────────────────────────────────────────────

  toggleAudio(poema: Poema) {
    if (!poema.audio_url) return;

    // Si el usuario da clic en el poema que ya está sonando, pausamos o reanudamos
    if (this.audioActivo && this.poemaReproduciendoId === poema.id) {
      if (this.reproduciendo) {
        this.audioActivo.pause();
        this.reproduciendo = false;
      } else {
        this.audioActivo.play();
        this.reproduciendo = true;
      }
      return;
    }

    // Si había otro poema sonando antes, lo detenemos por completo
    if (this.audioActivo) {
      this.audioActivo.pause();
      this.audioActivo = null;
      this.reproduciendo = false;
      this.poemaReproduciendoId = null;
    }

    // Instanciamos el nuevo audio del poema seleccionado
    this.audioActivo = new Audio(poema.audio_url);
    this.poemaReproduciendoId = poema.id ?? null;
    this.audioActivo.play();
    this.reproduciendo = true;

    // Al terminar la pista, reseteamos los estados limpios
    this.audioActivo.onended = () => {
      this.reproduciendo = false;
      this.audioActivo = null;
      this.poemaReproduciendoId = null;
    };
  }

  get skeletonArray() {
    return Array(4);
  }

  async cerrarSesion() {
    await this.auth.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}