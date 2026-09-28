# Banking Web

Aplicación web desarrollada con **Next.js + TypeScript** para consumir y visualizar las funcionalidades proporcionadas por `banking-api`.

La aplicación permite gestionar cuentas, realizar transferencias, consultar movimientos, procesar transferencias por lote y generar estados de cuenta desde una interfaz web.

---

## 1. Tecnologías

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- JWT para autenticación
- API REST `banking-api`

---

## 2. Funcionalidades

La aplicación incluye:

- Inicio de sesión.
- Registro de usuarios.
- Manejo de sesión mediante JWT.
- Autorización según roles `ADMIN` y `USER`.
- Consulta de cuentas.
- Creación de cuentas para usuarios autorizados.
- Consulta de balance.
- Transferencias entre cuentas.
- Consulta de movimientos.
- Filtros y paginación de movimientos.
- Carga de archivos CSV para procesamiento batch.
- Consulta del estado de procesos batch.
- Consulta de operaciones procesadas dentro de un batch.
- Consulta de estados de cuenta mensuales.
- Descarga de estados de cuenta en PDF.
- Manejo de respuestas `401 Unauthorized` y `403 Forbidden`.
- Cierre de sesión.

---

## 3. Requisitos

Antes de ejecutar el frontend se requiere:

- Node.js 20+
- npm
- `banking-api` configurada y ejecutándose

La configuración completa del backend, SQL Server, migraciones, seeds y pruebas de concurrencia se encuentra documentada en el repositorio de `banking-api`.

---

## 4. Instalación

Instalar las dependencias:

```bash
npm install
```

Crear el archivo de variables de entorno correspondiente para desarrollo.

Por ejemplo:

```bash
cp .env.example .env.local
```

En Windows también puede copiarse manualmente `.env.example` como `.env.local`.

---

## 5. Variables de entorno

El frontend necesita conocer la URL de `banking-api`.

Configurar en `.env.local` la variable utilizada por el proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```


Si el backend utiliza otro host o puerto, debe modificarse esta URL.

---

## 6. Ejecutar el proyecto

Modo desarrollo:

```bash
npm run dev
```

Después de iniciar la aplicación, abrir en el navegador la URL indicada por Next.js en la terminal.

Por defecto, Next.js normalmente utiliza:

```text
http://localhost:3000
```

Si ese puerto está ocupado, Next.js puede utilizar otro puerto disponible.

---

## 7. Backend

El frontend consume la API REST proporcionada por:

```text
banking-api
```

La API debe estar ejecutándose antes de utilizar las funcionalidades que requieren información del servidor.

La documentación Swagger del backend está disponible en:

```text
http://localhost:3001/api/docs
```

> La URL anterior asume que `banking-api` está ejecutándose en el puerto `3001`. Si se configura otro valor para `PORT`, debe ajustarse la URL.

---

## 8. Autenticación

La aplicación utiliza autenticación mediante **JWT**.

El flujo general es:

```text
Login
  ↓
banking-api
  ↓
JWT
  ↓
Sesión autenticada
  ↓
Requests con Bearer Token
```

Después de iniciar sesión, las solicitudes protegidas hacia la API incluyen:

```http
Authorization: Bearer <token>
```

Si la API responde:

```text
401 Unauthorized
```

la sesión deja de considerarse válida y el usuario debe autenticarse nuevamente.

Una respuesta:

```text
403 Forbidden
```

indica que el usuario está autenticado, pero su rol no tiene permiso para realizar la operación solicitada.

---

## 9. Roles

La interfaz contempla los roles:

```text
ADMIN
USER
```

Las opciones disponibles pueden variar según el rol del usuario autenticado.

### ADMIN

Puede acceder a las funcionalidades administrativas habilitadas por la API, incluyendo operaciones como:

- creación de cuentas;
- carga/procesamiento de archivos batch;
- funcionalidades generales de consulta y transferencias.

### USER

Puede acceder a las operaciones habilitadas para usuarios normales, como:

- consulta de cuentas;
- consulta de balances;
- consulta de movimientos;
- transferencias;
- estados de cuenta;
- consulta de procesos batch permitidos por la API.

La autorización definitiva siempre es validada por `banking-api`; ocultar una opción en la interfaz no sustituye la seguridad del backend.

---

## 10. Cuentas

La sección de cuentas permite consultar información de las cuentas bancarias disponibles.

Para facilitar el uso de la aplicación, los selectores muestran las cuentas utilizando:

```text
Número de cuenta - Titular
```

Ejemplo:

```text
1000000011 - Cuenta Demo Origen
```

Internamente, la aplicación continúa utilizando el UUID de la cuenta para comunicarse con la API.

Esto evita que el usuario tenga que copiar o introducir UUIDs manualmente.

---

## 11. Transferencias

La interfaz de transferencias permite seleccionar:

- cuenta origen;
- cuenta destino;
- monto.

Las cuentas se seleccionan mediante un buscador/combobox.

La cuenta seleccionada como origen se excluye de las opciones disponibles como destino para evitar seleccionar la misma cuenta en ambos campos.

Las validaciones financieras definitivas, incluyendo balance disponible, estado de la cuenta y concurrencia, son responsabilidad de `banking-api`.

---

## 12. Movimientos

La sección de movimientos permite consultar el historial de una cuenta.

La interfaz soporta los filtros proporcionados por la API, incluyendo:

- rango de fechas;
- tipo de movimiento;
- monto;
- paginación.

La cuenta puede seleccionarse mediante el buscador de cuentas sin introducir manualmente su UUID.

La paginación y los filtros se ejecutan desde el backend para evitar cargar grandes cantidades de movimientos en el navegador.

---

## 13. Procesamiento batch

La aplicación permite cargar archivos CSV para procesamiento masivo de transferencias.

Después de enviar el archivo, el backend crea un proceso batch que puede continuar ejecutándose de manera asíncrona.

Desde el frontend puede consultarse:

- estado del proceso;
- progreso;
- operaciones procesadas;
- operaciones exitosas;
- operaciones fallidas;
- detalle de los elementos del batch.

Los procesos existentes pueden seleccionarse mediante un buscador que utiliza información legible como el nombre del archivo y su estado, mientras internamente conserva el UUID del proceso.

---

## 14. Estados de cuenta

La aplicación permite consultar estados de cuenta mensuales seleccionando:

- cuenta;
- año;
- mes.

La respuesta muestra:

- información de la cuenta;
- período consultado;
- total de créditos;
- total de débitos;
- movimientos;
- paginación.

---

## 15. Descarga de estado de cuenta PDF

Desde la sección de estados de cuenta también puede descargarse el reporte correspondiente en formato PDF.

El PDF es generado por `banking-api` y descargado desde el frontend.

---

## 16. Manejo de errores

La interfaz muestra los errores devueltos por la API de manera controlada.

Algunos ejemplos de errores que pueden presentarse son:

- credenciales inválidas;
- sesión expirada;
- permisos insuficientes;
- cuenta inexistente;
- fondos insuficientes;
- datos inválidos;
- errores durante procesamiento batch.

Las reglas financieras y de negocio se mantienen en el backend para evitar duplicar lógica crítica en el cliente.

---

## 17. Flujo recomendado para probar la aplicación

Antes de iniciar el frontend, preparar `banking-api` siguiendo su README.

Con el backend ejecutándose:

```bash
npm run dev
```

Luego:

1. iniciar sesión con un usuario válido;
2. consultar las cuentas disponibles;
3. realizar una transferencia;
4. consultar los movimientos de la cuenta;
5. consultar un estado de cuenta;
6. descargar el estado de cuenta en PDF;
7. con un usuario `ADMIN`, cargar un archivo CSV y consultar el progreso del batch.

Para disponer de cuentas con balance desde el inicio puede utilizarse en `banking-api`:

```bash
npm run seed:demo
```

Este seed crea/restablece las cuentas demo documentadas en el README del backend.

---

## 18. Arquitectura

El frontend mantiene separadas las responsabilidades de:

- componentes de interfaz;
- formularios;
- acceso a la API;
- estado de autenticación;
- hooks;
- tipos TypeScript;
- componentes reutilizables.

La lógica financiera crítica no se implementa en el frontend.

El navegador se encarga principalmente de:

```text
Interfaz
   ↓
Validaciones de experiencia de usuario
   ↓
Requests HTTP
   ↓
banking-api
   ↓
Reglas de negocio / SQL Server
```

De esta forma, las reglas relacionadas con balance, concurrencia, idempotencia y consistencia financiera permanecen centralizadas en el backend.

---

## 19. Ejecución para evaluación

Para una revisión rápida del frontend:

```bash
npm install
```

Configurar la URL de `banking-api` en las variables de entorno.

Luego:

```bash
npm run dev
```

La API debe estar ejecutándose y su base de datos debe haber sido preparada siguiendo las instrucciones del README de `banking-api`.

---

## 20. Licencia

```text
UNLICENSED
```

Proyecto privado desarrollado como solución de evaluación técnica.