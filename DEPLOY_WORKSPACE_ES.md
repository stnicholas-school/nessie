# Publicar Nessie internamente en tu centro educativo

Esta guía explica cómo publicar Nessie como complemento de Google Workspace para todo un centro, con una única clave de la API Gemini en manos del equipo de informática. El profesorado instala el complemento y usa la herramienta sin crear ninguna clave.

Si solo quieres probar Nessie, no necesitas nada de esto: haz una copia del documento modelo y pega tu clave en Configuración.

## Qué formato elegir

| | Copia del documento | Complemento interno |
|---|---|---|
| Quién aporta la clave | Cada docente, la suya | El centro, una sola |
| Instalación | Hacer una copia del documento | La instala el administrador para el dominio |
| Dónde funciona | Solo en las copias de ese documento | En cualquier documento del docente |
| Actualización del código | Hay que rehacer cada copia | Una versión nueva llega a todo el mundo |
| Quién lo mantiene | El propio docente | El equipo de informática |
| Requiere proyecto de Google Cloud | No | Sí |

El formato de copia sigue siendo el recomendado para la difusión pública. El complemento interno tiene sentido cuando el centro quiere una herramienta única para todos, evitar que cada docente cree una clave y controlar las actualizaciones de forma centralizada.

**Nunca publiques una instancia con clave compartida en modo público en Marketplace.** Cualquiera que la instalase consumiría, y agotaría, la cuota de tu centro.

## Antes de empezar

Vas a necesitar:

- Una cuenta con privilegios de administrador de Google Workspace.
- Permiso para crear un proyecto de Google Cloud dentro de la organización.
- Alrededor de una hora para la primera publicación.
- Preferiblemente, facturación activada en el proyecto de Cloud. La capa gratuita de la API Gemini tiene límites por minuto y por día que se aplican a la clave entera, no a cada docente.

---

## Paso 1. Crear la clave del centro

1. Entra en https://aistudio.google.com/apikey y crea la clave dentro de un proyecto de Google Cloud de la organización, no en un proyecto personal.
2. En Google Cloud, abre APIs y servicios → Credenciales, localiza la clave y restríngela: en "Restricciones de API", deja solo la **Generative Language API**. Las restricciones por IP o por referente no se aplican a Apps Script.
3. Anota quién tiene acceso a esa clave. Trátala como una contraseña institucional.

Si el centro ya usa Google Cloud, conviene crear un proyecto específico, por ejemplo `nessie-centro`, para separar cuota y facturación.

## Paso 2. Preparar el proyecto de Apps Script

1. Crea un proyecto nuevo de Apps Script (o duplica el interno) y añade todos los archivos de Nessie.
2. En `config.js`, activa la clave compartida:

   ```javascript
   SHARED_KEY_ENABLED: true,
   ```

   Este es el único archivo que cambia respecto a la versión pública. Mantenlo en `false` en cualquier proyecto que distribuyas para copiar.

3. En Configuración del proyecto → Propiedades de la secuencia de comandos, crea:

   | Propiedad | Valor |
   |---|---|
   | `NESSIE_SHARED_API_KEY` | la clave creada en el paso 1 |

   No pongas la clave en ningún archivo `.js`, para que nunca llegue al control de versiones.

4. En el editor, ejecuta `checkSharedApiKey()` una vez. Debe responder `Teste de conexão: OK` junto con la clave enmascarada. Si responde con un valor vacío, la propiedad se guardó en otro sitio.

La clave personal de un docente, cuando existe, tiene prioridad sobre la del centro. Así, quien ya usaba Nessie con su propia clave sigue con su cuota, y el resto usa la del centro sin configurar nada.

## Paso 3. Vincular un proyecto de Google Cloud

Marketplace exige un proyecto estándar de Cloud. El que crea Apps Script automáticamente no sirve.

1. En Google Cloud, selecciona el proyecto del centro y copia el número de proyecto (no el ID).
2. En Apps Script, ve a Configuración del proyecto → Proyecto de Google Cloud Platform (GCP), pulsa Cambiar proyecto y pega el número.
3. En Cloud, abre APIs y servicios → Biblioteca y activa el **SDK de Google Workspace Marketplace**.
4. En APIs y servicios → Pantalla de consentimiento de OAuth, configura la aplicación como **Interna**. Rellena el nombre, el correo de asistencia y el correo del desarrollador.

Con la pantalla de consentimiento marcada como Interna, solo las cuentas de tu dominio pueden autorizar el complemento.

## Paso 4. Implementar una versión

1. En Apps Script, pulsa Implementar → Nueva implementación.
2. En el tipo, elige **Complemento de editor**.
3. Pon una descripción, por ejemplo `Nessie 2.1.0`, e implementa.
4. Copia el ID de la secuencia de comandos, en Configuración del proyecto, y anota el número de versión recién creado.

Cada cambio de código exige una implementación nueva y actualizar el número de versión en el paso siguiente. Sin eso, el profesorado sigue con el código antiguo.

## Paso 5. Configurar el SDK de Marketplace

En Google Cloud, abre APIs y servicios → SDK de Google Workspace Marketplace.

**En la pestaña Configuración de la aplicación:**

- Visibilidad: **Privada**, restringida a tu dominio.
- Configuración de instalación: **Instalación por el administrador**, si quieres desplegarla para todo el centro, o **Instalación individual**, si prefieres que cada docente decida.
- En Integración, marca **Complemento de Documentos** e indica el ID de la secuencia de comandos y el número de versión del paso 4.
- En Permisos de OAuth, enumera exactamente los tres permisos de `appsscript.json`:

  ```
  https://www.googleapis.com/auth/documents.currentonly
  https://www.googleapis.com/auth/script.container.ui
  https://www.googleapis.com/auth/script.external_request
  ```

  Cualquier diferencia entre esta lista y el manifiesto hace que la instalación falle.

**En la pestaña Ficha de la tienda**, aunque la aplicación sea privada, rellena el nombre, la descripción corta, la descripción detallada, la categoría, el idioma, un icono de 128 por 128 píxeles, al menos una captura de pantalla y los enlaces de asistencia, condiciones y privacidad. Un documento interno de Google Docs publicado en la web sirve como enlace de política de privacidad.

Para el icono, exporta el logo de Nessie: el SVG está en `Index.html`, en la cabecera del panel, y cualquier editor de imagen lo convierte a PNG.

Pulsa Publicar. Al tratarse de una aplicación interna, no hay revisión de Google y la publicación es inmediata.

## Paso 6. Instalarlo para el centro

Si elegiste la instalación por el administrador:

1. En la consola de administración, ve a Aplicaciones → Google Workspace Marketplace → Lista de aplicaciones.
2. Pulsa Añadir aplicación → Aplicaciones internas y selecciona Nessie.
3. Elige si la instalas para toda la organización o solo para determinadas unidades organizativas, por ejemplo la del profesorado.
4. Acepta los permisos en nombre del dominio.

Pide al profesorado que recargue cualquier documento abierto. El menú Nessie aparece en la barra de menús y el panel funciona de inmediato, sin pedir clave.

---

## Después de publicar

**Cambiar la clave.** Edita la propiedad `NESSIE_SHARED_API_KEY` y ejecuta `checkSharedApiKey()`. No hace falta implementar una versión nueva ni reinstalar nada.

**Actualizar el código.** Implementa una versión nueva en Apps Script y actualiza el número de versión en el SDK de Marketplace. El profesorado recibe la actualización la próxima vez que abra un documento.

**Vigilar el uso.** En Google Cloud, en APIs y servicios → Panel, la Generative Language API muestra el volumen de peticiones y los errores. Ahí se comprueba si la cuota va justa.

**Revocar el acceso.** Para apagarlo todo de golpe, ejecuta `clearSharedApiKey()` o elimina la clave en Cloud. El complemento sigue instalado, y las funciones que no usan IA, como resaltar puntuación y el lector de audio, siguen funcionando.

## Problemas frecuentes

| Síntoma | Causa probable |
|---|---|
| La instalación falla con un error de permisos | La lista de permisos del SDK de Marketplace no coincide con `appsscript.json`. |
| No aparece el menú Nessie | Hay que recargar el documento después de instalar. |
| El panel pide la clave aunque la propiedad exista | `SHARED_KEY_ENABLED` sigue en `false`, o la propiedad se guardó en otro proyecto. Ejecuta `checkSharedApiKey()` para comprobarlo. |
| "Límite de uso de la API alcanzado" en horario de clase | La cuota gratuita es compartida por todo el centro. Activa la facturación en el proyecto de Cloud. |
| El profesorado ve el menú en el idioma por defecto | El menú se construye antes de la autorización, y en ese momento se usa el idioma por defecto. Se corrige al recargar el documento. |
| El código nuevo no llega al profesorado | Faltó actualizar el número de versión en el SDK de Marketplace después de implementar. |

## Lista de verificación de seguridad

- [ ] La clave está solo en Propiedades de la secuencia de comandos, nunca en un archivo del repositorio.
- [ ] La clave está restringida a la Generative Language API.
- [ ] La visibilidad de la aplicación en Marketplace es privada, restringida al dominio.
- [ ] La pantalla de consentimiento de OAuth está marcada como Interna.
- [ ] El acceso de edición al proyecto de Apps Script está limitado al equipo de informática, ya que quien edita el proyecto puede leer la clave.
- [ ] El proyecto que distribuyes públicamente, para copiar, tiene `SHARED_KEY_ENABLED: false` y ninguna propiedad de clave.
