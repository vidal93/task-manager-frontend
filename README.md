# Task Manager — Frontend

Aplicación Angular 17 para gestión de tareas personales. Parte del challenge técnico fullstack de Atom.

La app permite iniciar sesión con correo electrónico, crear nuevas cuentas automáticamente si no existen, y gestionar tareas con título, descripción, fecha y estado de completado.

## Comentarios sobre el desarrollo

Decidí usar **signals** desde el inicio porque para este tipo de aplicación —estado local, sin necesidad de store global— son suficientes y el código queda más limpio que con BehaviorSubject. No hay que preocuparse por el unsubscribe ni por el boilerplate de los observables de estado.

Para el flujo de login opté por hacer primero un GET al backend buscando el usuario por correo. Si devuelve 404 se muestra un diálogo de confirmación para crear la cuenta. Esto evita registrar usuarios accidentalmente y le da control explícito al usuario sobre si quiere continuar.

El toast lo construí desde cero en lugar de usar `MatSnackBar`. Quería que se pudiera apilar sin pisarse y que el estilo fuera coherente con el tema de la app. Con MatSnackBar no se tiene ese control fácilmente.

Para la autenticación implementé dos interceptores HTTP que trabajan en cadena: `authInterceptor` agrega el token a cada petición y `errorInterceptor` cierra la sesión automáticamente si el servidor responde con 401. El orden en que se registran en `app.config.ts` importa para que esto funcione correctamente.

Los tests los enfoqué en los flujos críticos: el flujo completo de login, el CRUD de tareas, y los guards e interceptores. No busqué cobertura alta por sí sola sino cubrir los caminos que realmente importan.

Un punto que me tomó revisión fue la configuración de Jest para que mostrara errores en los archivos `.spec.ts`., luego tambien la configuracion del proyecto en Firebase para el CI/CD y los servicios requeridos.

## Tecnologías

| Tecnología                 | Versión | Para qué se usa                             |
|----------------------------|---------|-------------------------------------------- |
| Angular                    | 17.3    | Framework principal                         |
| Angular Material           | 17.x    | Componentes de UI                           |
| TypeScript                 | 5.x     | Lenguaje principal, modo estricto           |
| RxJS                       | 7.x     | Manejo de peticiones HTTP con observables   |
| Jest + jest-preset-angular | 29.x    | Tests unitarios                             |
| SCSS                       | —       | Estilos por componente y variables globales |

## Estructura del proyecto

```
src/app/
├── core/                          # Todo lo transversal: servicios, guardas, interceptores
│   ├── guards/
│   │   └── auth.guard.ts          # Redirige a /auth si no hay sesión activa
│   ├── interceptors/
│   │   ├── auth.interceptor.ts    # Agrega el token a cada petición HTTP
│   │   └── error.interceptor.ts   # Detecta 401 y cierra sesión automáticamente
│   ├── models/                    # Interfaces TypeScript de toda la app
│   ├── services/
│   │   ├── auth.service.ts        # Maneja la sesión con signals y localStorage
│   │   ├── user.service.ts        # Llamadas HTTP para buscar y crear usuarios
│   │   ├── task.service.ts        # Llamadas HTTP para el CRUD de tareas
│   │   └── toast.service.ts       # Cola de notificaciones con signals
│   └── validators/
│       └── email.validator.ts     # Valida que el correo tenga TLD (ej: @gmail.com)
│
├── features/
│   ├── auth/
│   │   ├── login/                 # Página de inicio de sesión
│   │   └── confirm-user-dialog/   # Diálogo para confirmar la creación de cuenta
│   └── tasks/
│       ├── task-list/             # Página principal con pestañas pendientes/completadas
│       ├── task-form-dialog/      # Diálogo para crear y editar tareas
│       └── delete-task-dialog/    # Diálogo de confirmación antes de eliminar
│
└── shared/
    └── components/
        └── toast/                 # Notificaciones que aparecen en la esquina
```

## Por qué estas decisiones

**Signals en lugar de BehaviorSubject** — para estado local como la sesión del usuario o la lista de tareas se usan `signal()` y `computed()`. Es más simple y no requiere manejar subscripciones manualmente.

**Standalone components** — ningún componente pertenece a un NgModule. Es la forma recomendada en Angular 17 y reduce el boilerplate.

**Validador de correo propio** — el validador nativo de Angular acepta correos sin dominio completo como `usuario@gmail`. El nuestro exige formato real con TLD.

**Toast sin dependencias externas** — se descartó `MatSnackBar` para tener control total sobre el estilo y el comportamiento de auto-dismiss.

**Lazy loading en todas las rutas** — los componentes de `/auth` y `/tasks` se cargan solo cuando se necesitan, reduciendo el bundle inicial.

## Rutas

| Ruta     | Componente             | ¿Protegida?                 |
|----------|------------------------|-----------------------------|
| `/`      | —                      | Redirige a `/auth`          |
| `/auth`  | `LoginComponent`       | No                          |
| `/tasks` | `TaskListComponent`    | Sí — requiere sesión activa |

## Cómo correrlo localmente

```bash
npm install
npm start
```

La app corre en `http://localhost:4200` y se conecta al backend local por defecto.

Para apuntar al backend en producción, editar `src/environments/environment.ts`:

```typescript
export const environment = {
    production: false,
    apiUrl: 'https://us-central1-task-manager-app-900fc.cloudfunctions.net/api',
};
```

## Tests

```bash
npm test            # Corre todos los tests
npm run test:ci     # Tests con reporte de cobertura (para CI)
```

## Build y deploy

```bash
npm run build                        # Build de producción en /dist
firebase deploy --only hosting       # Deploy manual a Firebase Hosting
```

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`) ejecuta en cada push y PR a `master`:

```
push/PR a master
    │
    ├── [1] test       → npm run test:ci → sube artefacto de cobertura
    │
    ├── [2] build      → ng build --configuration=production (solo si test pasa)
    │
    └── [3] deploy     → Firebase Hosting (solo push a master, requiere secret GCP_SA_KEY)
```

El deploy usa `FirebaseExtended/action-hosting-deploy@v0` y el secret `GCP_SA_KEY` del repositorio.

## App en producción

La aplicación está publicada en Firebase Hosting:

```
https://task-manager-app-900fc.web.app
```
