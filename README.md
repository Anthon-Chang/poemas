# 📚 Versos del Alma

Aplicación móvil para gestionar una colección de poemas, con soporte multimedia. Desarrollada con **Ionic + Angular** y **Supabase** como backend.

---

## ✨ Funcionalidades

- **CRUD completo** de poemas: crear, listar, editar y eliminar
- **Búsqueda** en tiempo real por título, autor o época literaria
- **Reproductor de audio** integrado con toggle play/pause
- **Modal de video** con soporte para URLs de YouTube
- **Subida de archivos** a Supabase Storage (imágenes de portada y audio)
- **Skeleton loader** mientras se cargan los datos
- **Imagen de portada** por poema con vista previa en el formulario

---

## 🛠 Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework UI | Ionic 8 + Angular 20 |
| Mobile nativo | Capacitor 8 (Android) |
| Backend / Base de datos | Supabase (PostgreSQL) |
| Almacenamiento de archivos | Supabase Storage |
| Lenguaje | TypeScript 5.9 |
| Tests | Karma + Jasmine |

---

## 📁 Estructura del proyecto

```
poemas/
├── resources/
│   ├── icon.png          # Ícono fuente (1024×1024)
│   └── splash.png        # Splash screen fuente
├── src/
│   └── app/
│       ├── pages/
│       │   ├── videojuegos/       # Lista de poemas
│       │   └── videojuego-form/   # Formulario crear/editar
│       └── services/
│           └── videojuegos.ts     # Servicio Supabase + interfaz Poema
├── android/               # Proyecto Android (Capacitor)
├── capacitor.config.ts
└── angular.json
```

---

## 🗄 Modelo de datos

Tabla `poemas` en Supabase:

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | number | Clave primaria (auto) |
| `titulo` | string | Título del poema *(requerido)* |
| `autor` | string | Nombre del autor *(requerido)* |
| `contenido` | string | Texto completo del poema *(requerido)* |
| `epoca` | string | Época o movimiento literario |
| `youtube_url` | string | URL de video en YouTube |
| `audio_url` | string | URL del audio (Supabase Storage) |
| `imagen_url` | string | URL de la portada (Supabase Storage) |

Bucket de Storage requerido: **`poemas-media`** (público), con carpetas `imagenes/` y `audios/`.

---

## 🚀 Instalación y configuración

### Requisitos previos

- Node.js 18+
- Angular CLI
- Ionic CLI
- Android Studio (para build Android)

### 1. Clonar el repositorio

```bash
git clone https://github.com/Anthon-Chang/poemas.git
cd poemas
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Supabase

Edita `src/environments/environment.ts` con tus credenciales:

```ts
export const environment = {
  production: false,
  supabaseUrl: 'TU_SUPABASE_URL',
  supabaseKey: 'TU_SUPABASE_ANON_KEY',
};
```

> ⚠️ **No subas tus credenciales reales al repositorio.** Agrega `environment.ts` al `.gitignore` si el repo es público.

### 4. Correr en el navegador

```bash
ionic serve
```

### 5. Build y sync para Android

```bash
ionic build
npx cap sync android
```

Luego abre Android Studio y ejecuta la app en un emulador o dispositivo físico.

---

## 📱 Rutas de la app

| Ruta | Pantalla |
|---|---|
| `/poemas` | Lista de todos los poemas |
| `/poemas-form` | Formulario para crear un nuevo poema |
| `/poemas-form/:id` | Formulario para editar un poema existente |

---

## 🎨 Paleta de colores

| Variable | Color | Uso |
|---|---|---|
| `--tinta` | `#2c1a0e` | Fondo header, textos principales |
| `--crema` | `#f5f0e8` | Fondo general |
| `--pergamino` | `#e8dcc8` | Bordes, chips |
| `--dorado` | `#c9a84c` | Acentos, bordes decorativos |
| `--rojo-poesia` | `#8b1a1a` | Acciones de eliminar |

---

## 👤 Autor

**Anthon Chang** — [github.com/Anthon-Chang](https://github.com/Anthon-Chang)
