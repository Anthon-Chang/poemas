import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonBackButton,
  IonButtons,
  IonSpinner
} from '@ionic/angular/standalone';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { addIcons } from 'ionicons';

import {
  saveOutline,
  arrowBackOutline,
  imageOutline,
  musicalNoteOutline,
  linkOutline,
  cloudUploadOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';

import { VideojuegosService, Poema } from '../../services/videojuegos';

@Component({
  selector: 'app-videojuego-form',
  templateUrl: './videojuego-form.page.html',
  styleUrls: ['./videojuego-form.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,

    IonIcon,
    IonBackButton,
    IonButtons,
    IonSpinner
  ]
})
export class VideojuegoFormPage implements OnInit {

  id?: number;

  guardando: boolean = false;
  subiendoImagen: boolean = false;
  subiendoAudio: boolean = false;
  exito: boolean = false;

  poema: Poema = {
    titulo: '',
    autor: '',
    contenido: '',
    epoca: '',
    youtube_url: '',
    audio_url: '',
    imagen_url: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private svc: VideojuegosService
  ) {
    addIcons({
      saveOutline,
      arrowBackOutline,
      imageOutline,
      musicalNoteOutline,
      linkOutline,
      cloudUploadOutline,
      checkmarkCircleOutline
    });
  }

  async ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.id = Number(idParam);
      this.poema = await this.svc.obtenerPorId(this.id);
    }
  }

  async onImagenSeleccionada(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    this.subiendoImagen = true;

    try {
      this.poema.imagen_url = await this.svc.subirImagen(input.files[0]);
    } catch (e) {
      console.error('Error subiendo imagen:', e);
    } finally {
      this.subiendoImagen = false;
    }
  }

  async onAudioSeleccionado(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    this.subiendoAudio = true;

    try {
      this.poema.audio_url = await this.svc.subirAudio(input.files[0]);
    } catch (e) {
      console.error('Error subiendo audio:', e);
    } finally {
      this.subiendoAudio = false;
    }
  }

  async guardar() {
    this.guardando = true;

    try {
      if (this.id) {
        await this.svc.actualizar(this.id, this.poema);
      } else {
        await this.svc.crear(this.poema);
      }

      this.exito = true;

      setTimeout(() => {
        this.router.navigate(['/poemas']);
      }, 1200);

    } catch (e) {
      console.error(e);
    } finally {
      this.guardando = false;
    }
  }
}