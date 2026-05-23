# 📚 Versos del Alma

Aplicación móvil para gestionar una colección de poemas con soporte multimedia y autenticación por usuario. Desarrollada con **Ionic + Angular** y **Supabase** como backend.

---

## ✨ Funcionalidades

- **Autenticación** con registro e inicio de sesión vía Supabase Auth
- **Poemas privados por usuario** — cada cuenta ve y gestiona solo sus propios poemas
- **CRUD completo** de poemas: crear, listar, editar y eliminar
- **Búsqueda** en tiempo real por título, autor o época literaria
- **Reproductor de audio** integrado con toggle play/pause
- **Modal de video** con soporte para URLs de YouTube
- **Subida de archivos** a Supabase Storage (imágenes de portada y audio)
- **Skeleton loader** mientras se cargan los datos
- **Cerrar sesión** desde el header principal

---

## 🛠 Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework UI | Ionic 8 + Angular 20 |
| Mobile nativo | Capacitor 8 (Android) |
| Backend / Base de datos | Supabase (PostgreSQL) |
| Autenticación | Supabase Auth |
| Almacenamiento de archivos | Supabase Storage |
| Lenguaje | TypeScript 5.9 |
| Tests | Karma + Jasmine |

---

## 📁 Estructura del proyecto

```
poemas/
├── resources/
│   ├── icon.png           # Ícono fuente (1024×1024)
│   └── splash.png         # Splash screen fuente
├── src/
│   └── app/
│       ├── guards/
│       │   └── auth.guard.ts          # Protege rutas privadas
│       ├── pages/
│       │   ├── login/                 # Pantalla de login/registro
│       │   ├── videojuegos/           # Lista de poemas
│       │   └── videojuego-form/       # Formulario crear/editar
│       └── services/
│           ├── supabase.client.ts     # Instancia única de Supabase
│           ├── auth.service.ts        # Login, registro, logout, sesión
│           └── videojuegos.ts         # CRUD de poemas + Storage
├── android/                # Proyecto Android (Capacitor)
├── capacitor.config.ts
└── angular.json
```

---

## 🗄 Modelo de datos

Tabla `poemas` en Supabase:

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | number | Clave primaria (auto) |
| `user_id` | uuid | ID del usuario propietario (FK a `auth.users`) |
| `titulo` | string | Título del poema *(requerido)* |
| `autor` | string | Nombre del autor *(requerido)* |
| `contenido` | string | Texto completo del poema *(requerido)* |
| `epoca` | string | Época o movimiento literario |
| `youtube_url` | string | URL de video en YouTube |
| `audio_url` | string | URL del audio (Supabase Storage) |
| `imagen_url` | string | URL de la portada (Supabase Storage) |

### Políticas RLS activas

| Política | Operación | Condición |
|---|---|---|
| Usuarios ven sus poemas | SELECT | `auth.uid() = user_id` |
| Usuarios insertan sus poemas | INSERT | `auth.uid() = user_id` |
| Usuarios actualizan sus poemas | UPDATE | `auth.uid() = user_id` |
| Usuarios eliminan sus poemas | DELETE | `auth.uid() = user_id` |

Bucket de Storage: **`poemas-media`** (público), con carpetas `imagenes/` y `audios/`.

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

| Ruta | Pantalla | Protegida |
|---|---|---|
| `/login` | Login / Registro | No |
| `/poemas` | Lista de poemas | ✅ Sí |
| `/poemas-form` | Crear poema | ✅ Sí |
| `/poemas-form/:id` | Editar poema | ✅ Sí |

---

## 🔐 Flujo de autenticación

1. App abre → redirige a `/login`
2. Usuario se registra o inicia sesión con email y contraseña
3. Login exitoso → redirige a `/poemas`
4. Si intenta acceder a una ruta protegida sin sesión → regresa a `/login`
5. Botón de cerrar sesión en el header termina la sesión y regresa al login

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
