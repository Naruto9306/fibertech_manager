FibraOpticaApp 📡

Una aplicación móvil para la gestión y mantenimiento de infraestructura de fibra óptica, desarrollada con React Native y Expo.
🚀 Características
🔍 Escaneo de QR

    Escaneo de códigos QR de proyectos y equipos

    Historial de escaneos con detalles completos

    Simulación de escaneos para testing

    Interfaz de cámara optimizada

🗺️ Mapa de Red

    Visualización interactiva de todos los nodos de la red

    Conexiones entre nodos con estados de color (activo, mantenimiento, inactivo)

    Búsqueda y filtrado de nodos

    Navegación por el mapa con controles de zoom

    Información detallada de cada nodo al hacer tap

🛠️ Registro de Mantenimiento

    Formulario completo para registrar trabajos de mantenimiento

    Evidencia multimedia (fotos antes/después con marca de agua)

    Grabación de notas de audio

    Selectores de tipo, prioridad y estado

    Almacenamiento de ubicación y equipo

🛠️ Tecnologías Utilizadas

    React Native - Framework principal

    Expo - Desarrollo y build

    Expo Camera - Escaneo de QR y cámara

    React Native Maps - Mapas y geolocalización

    Expo Image Picker - Selección de imágenes

    Expo AV - Grabación de audio

📦 Instalación

    1 - Clonar el repositorio
    git clone [url-del-repositorio]
    cd FibraOpticaApp
    2 - Instalar dependencias
    npm install
    3 - Instalar Expo CLI globalmente (si no lo tienes)
    npm install -g expo-cli
    4 - Ejecutar la aplicación
    npx expo start

🔧 Configuración
Permisos requeridos

La aplicación requiere los siguientes permisos:

    Cámara: Para escanear QR y tomar fotos de evidencia

    Micrófono: Para grabar notas de audio

    Ubicación: Para el mapa y geolocalización

    Galería: Para seleccionar fotos existentes

    Expo Location - Geolocalización

    Ionicons - Iconografía

📱 Funcionalidades Detalladas
ScanQR.js

    Interfaz de cámara con overlay de escaneo

    Procesamiento automático de datos QR (JSON y texto plano)

    Historial persistente de escaneos

    Modal de detalles con información completa

ViewOnMap.js

    Mapa interactivo con marcadores personalizados

    Leyenda de colores para estados de nodos

    Búsqueda en tiempo real

    Conexiones visuales entre nodos

    Modal de información detallada

CreateMaintenance.js

    Formulario multi-sección

    Captura de medios con marca de agua automática

    Grabación de audio integrada

    Validación de campos requeridos

    Selectores visuales intuitivos

🎨 Diseño

La aplicación sigue un diseño moderno y limpio con:

    Esquema de colores en modo claro

    Iconografía consistente con Ionicons

    Sombras sutiles y bordes redondeados

    Tipografía clara y legible

    Navegación intuitiva
