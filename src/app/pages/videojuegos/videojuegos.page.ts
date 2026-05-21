import { Component, OnInit } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonButton, IonIcon,
  IonFab, IonFabButton
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // NgFor y NgIf ya vienen incluidos
import { VideojuegosService, Videojuego } from '../../services/videojuegos';

@Component({
  selector: 'app-videojuegos',
  templateUrl: './videojuegos.page.html',
  standalone: true,
  imports: [
    CommonModule, // ← esto es suficiente
    RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonButton,
    IonFab, IonFabButton
  ]
})
export class VideojuegosPage implements OnInit {

  videojuegos: Videojuego[] = [];

  constructor(private videojuegosService: VideojuegosService) {}

  ngOnInit() {
    this.cargar();
  }

  ionViewWillEnter() {
    this.cargar();
  }

  async cargar() {
    this.videojuegos = await this.videojuegosService.listar();
  }

  async eliminar(id: number) {
    await this.videojuegosService.eliminar(id);
    await this.cargar();
  }
}