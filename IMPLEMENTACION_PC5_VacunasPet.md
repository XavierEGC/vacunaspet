# VacunasPet — Implementación de Requerimientos
## Práctica de Campo 05 — SIST1402A Soluciones Web y Aplicaciones Distribuidas

**Estudiante:** Xavier Eduardo Gálvez Coello
**Proyecto grupal:** VacunasPet (integrante: Sania Muñoz Trelles)
**Docente:** Patricia Janet Uceda Martos
**Fecha:** Junio 2026

---

## Requerimiento 1 — Proyecto Spring Boot con dos CRUD de tablas

**Estado: Implementado**

El proyecto VacunasPet es una aplicación Spring Boot 3.5.14 (Java 17) que excede el requerimiento mínimo de dos CRUD, implementando **tres entidades con CRUD completo** vía API REST:

| Entidad | Tabla MySQL | Endpoints REST |
|---|---|---|
| Mascota | `mascotas` | GET, POST, DELETE `/api/mascotas` |
| Vacuna | `vacunas` | GET, POST, DELETE `/api/vacunas` |
| RegistroVacuna | `registros_vacuna` | GET, POST, DELETE `/api/registros` |

**Arquitectura técnica:**
- **Persistencia:** JPA / Hibernate sobre MySQL 8.0, con entidades anotadas (`@Entity`, `@Table`, `@Id`, `@GeneratedValue`) y relaciones `@ManyToOne` entre `RegistroVacuna` → `Mascota` y `RegistroVacuna` → `Vacuna`.
- **Capa de acceso a datos:** Interfaces `JpaRepository` (`MascotaRepository`, `VacunaRepository`, `RegistroVacunaRepository`, `UsuarioRepository`) que abstraen las operaciones CRUD sin necesidad de SQL manual.
- **Capa de controladores:** `@RestController` por entidad (`MascotaController`, `VacunaController`, `RegistroVacunaController`) que exponen los endpoints REST consumidos por el frontend Angular.
- **CORS:** Configurado en `CorsConfig.java` para permitir peticiones desde `localhost:4200` (frontend Angular) hacia `localhost:8080` (backend).

Estas tres entidades son la base funcional del proyecto final (gestión de vacunación de mascotas, alineado al ODS 9).

---

## Requerimiento 2 — Mejora visual de páginas HTML

**Estado: Implementado**

El frontend Angular 19 utiliza Bootstrap 5 + SASS/SCSS para una interfaz profesional y consistente, superando el HTML básico sin estilos:

- **Sistema de diseño coherente:** paleta de colores propia (teal/coral) aplicada vía variables CSS (`--teal`, `--teal-light`, `--coral`, `--text-soft`) en lugar de los colores por defecto de Bootstrap.
- **Componentes visuales:**
  - Tarjetas (*cards*) para el catálogo de Mascotas, con imagen/ícono representativo por especie.
  - Tablas estilizadas con encabezados en mayúsculas, hover en filas y numeración correlativa.
  - *Badges* de color para mostrar especie, fabricante de vacuna y estado.
  - Formularios colapsables (Bootstrap `collapse`) para no saturar la pantalla principal.
  - Sidebar de navegación fija con iconografía (Bootstrap Icons).
  - Dashboard con tarjetas resumen (contadores en tiempo real desde la API) y accesos rápidos.
- **Experiencia de usuario mejorada:**
  - Dropdowns inteligentes: razas dinámicas según la especie seleccionada, catálogo de vacunas con auto-completado de fabricante/dosis/descripción, y filtrado de vacunas compatibles según la especie de la mascota.
  - Cálculo automático de la fecha de próxima dosis según el tipo de vacuna aplicada.
  - Mensajes de confirmación visual (alertas Bootstrap) tras operaciones exitosas.

---

## Requerimiento 3 — Arquitectura SOA, Spring Security, autenticación y encriptación

**Estado: Implementado**

### 3.1 Arquitectura SOA del proyecto

VacunasPet sigue una arquitectura orientada a servicios (SOA) de tres capas, desacopladas y comunicadas vía HTTP/REST:

```
┌─────────────────────────────┐
│   CAPA DE PRESENTACIÓN       │   Angular 19 + Bootstrap 5 + SCSS
│   (Frontend - puerto 4200)   │   Componentes: Login, Dashboard,
│                               │   Mascotas, Vacunas, Registros
└───────────────┬───────────────┘
                │ HTTP/REST (JSON)
                │ Header: Authorization Bearer <JWT>
┌───────────────▼───────────────┐
│   CAPA DE SERVICIOS (SOA)     │   Spring Boot 3.5.14 (Java 17)
│   (Backend - puerto 8080)     │   - Controllers (REST endpoints)
│                               │   - Security (JWT, BCrypt, Filters)
│                               │   - Services / Repositories (JPA)
└───────────────┬───────────────┘
                │ JPA / Hibernate
┌───────────────▼───────────────┐
│   CAPA DE PERSISTENCIA        │   MySQL 8.0
│                               │   vacunaspet_db
└────────────────────────────────┘
```

Cada capa es independiente y se comunica únicamente mediante contratos definidos (API REST con JSON), lo que permite que el frontend y el backend evolucionen o se desplieguen por separado — principio central de SOA.

### 3.2 Spring Security — mecanismos de autenticación

Se implementó autenticación real basada en **JWT (JSON Web Tokens)**, reemplazando la configuración inicial de `permitAll()` que dejaba todas las rutas abiertas sin protección.

**Componentes implementados:**

| Componente | Función |
|---|---|
| `SecurityConfig.java` | Define la cadena de filtros de seguridad: rutas públicas (`/api/auth/**`) y rutas protegidas (todas las demás, requieren token válido). Sesión configurada como `STATELESS` (sin sesiones de servidor, propio de APIs REST). |
| `JwtUtil.java` | Genera y valida tokens JWT firmados (algoritmo HS256), con expiración de 10 horas. |
| `JwtFilter.java` | Filtro que intercepta cada petición HTTP, extrae el token del header `Authorization: Bearer <token>`, lo valida y autentica al usuario en el contexto de Spring Security. |
| `CustomUserDetailsService.java` | Carga los datos del usuario (incluyendo su rol) desde la tabla `usuarios` en MySQL para que Spring Security pueda validarlo. |
| `AuthController.java` | Expone el endpoint `POST /api/auth/login`, que recibe usuario/contraseña, los valida contra la base de datos y devuelve un token JWT junto con los datos del usuario autenticado. |

**Flujo de autenticación:**
1. El usuario ingresa sus credenciales en el login de Angular.
2. El frontend envía `POST /api/auth/login` con `{ username, password }`.
3. El backend valida las credenciales usando `AuthenticationManager` + `BCryptPasswordEncoder`.
4. Si son correctas, se genera un JWT y se devuelve al frontend junto con `nombre` y `rol` del usuario.
5. El frontend guarda el token y lo reenvía automáticamente en cada petición posterior mediante un **interceptor HTTP** (`auth.interceptor.ts`).
6. El backend valida el token en cada request mediante `JwtFilter` antes de permitir el acceso a los recursos protegidos (Mascotas, Vacunas, Registros).

**Control de acceso por roles:** la entidad `Usuario` define un enum `Rol` (`ADMIN`, `VETERINARIO`, `CLIENTE`), que se incluye como *claim* dentro del JWT y se traduce a una autoridad de Spring Security (`ROLE_ADMIN`, `ROLE_VETERINARIO`, `ROLE_CLIENTE`), dejando la base lista para restringir funcionalidades según el rol del usuario autenticado.

### 3.3 Encriptación de contraseñas

Las contraseñas de los usuarios se almacenan utilizando **BCrypt** (`BCryptPasswordEncoder` de Spring Security), un algoritmo de hashing unidireccional con *salt* incorporado, diseñado específicamente para credenciales (resistente a ataques de fuerza bruta y rainbow tables).

- Antes: contraseñas almacenadas en texto plano en la tabla `usuarios`.
- Después: cada contraseña se almacena como un hash BCrypt (ej. `$2a$10$c7WxuXiRB9UyDybb5/dNKO...`), generado con factor de costo 10.
- La validación en el login no compara texto plano, sino que usa `passwordEncoder.matches()` para verificar la contraseña ingresada contra el hash almacenado, sin que la contraseña original quede expuesta en ningún momento ni en la base de datos ni en el código.

### 3.4 Frontend — integración con la seguridad del backend

- `login.ts`: reemplazó la simulación local (`setTimeout` + comparación hardcodeada) por una llamada real al endpoint `/api/auth/login` vía `ApiService`.
- `auth.guard.ts`: protege las rutas del frontend (`dashboard`, `mascotas`, `vacunas`, `registros`), redirigiendo al login si no existe un token válido en `localStorage`.
- `auth.interceptor.ts`: interceptor HTTP que añade automáticamente el header `Authorization: Bearer <token>` a toda petición saliente hacia el backend, sin necesidad de repetir esa lógica en cada componente.

---

## Resumen de cumplimiento

| Requerimiento PC5 | Estado |
|---|---|
| Proyecto Spring Boot con ≥2 CRUD | ✅ Cumplido (3 CRUD: Mascota, Vacuna, RegistroVacuna) |
| Mejora visual de páginas HTML | ✅ Cumplido (Bootstrap 5 + SCSS + UX mejorada) |
| Arquitectura SOA documentada | ✅ Cumplido (3 capas desacopladas vía REST) |
| Spring Security implementado | ✅ Cumplido (JWT + filtros + rutas protegidas) |
| Mecanismos de autenticación | ✅ Cumplido (login real validado contra BD) |
| Encriptación de contraseñas | ✅ Cumplido (BCrypt, factor de costo 10) |
