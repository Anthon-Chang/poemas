import { Component, OnInit } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonButton, IonIcon,
  IonFab, IonFabButton, IonCard, IonCardHeader,
  IonCardTitle, IonCardSubtitle, IonCardContent,
  IonBadge, IonChip, IonSearchbar, IonSkeletonText,
  IonThumbnail, IonButtons, IonBackButton
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import {
  bookOutline, addOutline, createOutline, trashOutline,
  playOutline, musicalNoteOutline, logoYoutube,
  heartOutline, heart, searchOutline, timeOutline
} from 'ionicons/icons';
import { VideojuegosService, Poema } from '../../services/videojuegos';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-videojuegos',
  templateUrl: './videojuegos.page.html',
  styleUrls: ['./videojuegos.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonButton, IonIcon,
    IonFab, IonFabButton, IonCard, IonCardHeader,
    IonCardTitle, IonCardSubtitle, IonCardContent,
    IonBadge, IonChip, IonSearchbar, IonSkeletonText,
    IonThumbnail, IonButtons, IonBackButton
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

  constructor(
    private videojuegosService: VideojuegosService,
    private sanitizer: DomSanitizer
  ) {
    addIcons({
      bookOutline, addOutline, createOutline, trashOutline,
      playOutline, musicalNoteOutline, logoYoutube,
      heartOutline, heart, searchOutline, timeOutline
    });
  }

  ngOnInit() { this.cargar(); }
  ionViewWillEnter() { this.cargar(); }

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
    const q = event.target.value?.toLowerCase() || '';
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

  // ── Video YouTube ─────────────────────────────────────────────────────────

  verVideo(poema: Poema) {
    if (!poema.youtube_url) return;
    this.poemaActivo = poema;
    const videoId = this.extraerYoutubeId(poema.youtube_url);
    if (videoId) {
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
      );
    }
  }

  cerrarVideo() {
    this.poemaActivo = null;
    this.videoUrl = null;
  }

  extraerYoutubeId(url: string): string | null {
    const regExp = /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  }

  // ── Audio ─────────────────────────────────────────────────────────────────

  toggleAudio(poema: Poema) {
    if (!poema.audio_url) return;

    if (this.audioActivo && this.reproduciendo) {
      this.audioActivo.pause();
      this.reproduciendo = false;
      return;
    }

    if (this.audioActivo) {
      this.audioActivo.pause();
      this.audioActivo = null;
    }

    this.audioActivo = new Audio(poema.audio_url);
    this.audioActivo.play();
    this.reproduciendo = true;

    this.audioActivo.onended = () => {
      this.reproduciendo = false;
    };
  }

  get skeletonArray() { return Array(4); }
}
