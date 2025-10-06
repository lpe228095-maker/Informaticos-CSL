// ===============================
// SISTEMA UNIFICADO - JAVASCRIPT
// Combina funcionalidades de Natural Alert + Sistema de Alertas
// ===============================

// Variables globales del sistema
let monitoringInterval = null;
let alertHistory = [];
let map;
let markers = [];
let riskLayers = {};
let apiCache = new Map();
let lastUpdateTime = Date.now();
let systemMetrics = {
    totalAlerts: 0,
    criticalAlerts: 0,
    highAlerts: 0,
    responseTime: 0,
    apiCalls: 0
};

// Configuración de notificaciones
let notificationSettings = {
    enabled: false,
    critical: true,
    high: true,
    earthquake: false,
    volcano: false,
    flood: false,
    landslide: false
};

// Configuración de actualización rápida
const FAST_UPDATE_INTERVAL = 15000; // 15 segundos
const CRITICAL_UPDATE_INTERVAL = 5000; // 5 segundos para alertas críticas

// ===============================
// INICIALIZACIÓN DEL SISTEMA
// ===============================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando Natural Alert - Sistema Unificado...');

    // Inicializar componentes
    initLoader();
    initNavigation();
    initMap();
    initChatbot();
    initNotifications();

    // Iniciar monitoreo
    updateLastUpdateTime();
    startFastMonitoring();

    // Verificar estado de notificaciones al cargar
    if (Notification.permission === "granted") {
        enableNotifications();
    }
});

// ===============================
// SISTEMA DE CARGA
// ===============================

function initLoader() {
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');

    // Simular carga del sistema
    setTimeout(function() {
        loader.style.display = 'none';
        mainContent.style.display = 'block';

        // Iniciar animaciones después de la carga
        initAnimations();
    }, 2500);
}

function initAnimations() {
    // Animación de entrada para las secciones
    const sections = document.querySelectorAll('.section, .emergency-section, .notifications-section, .controls-section, .admin-section, .filters-section, .stats-section');

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Animación escalonada
    setTimeout(() => {
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 300);
}

// ===============================
// SISTEMA DE NAVEGACIÓN
// ===============================

function initNavigation() {
    const menuToggle = document.getElementById('menu-toggle');
    const navSection = document.getElementById('nav-section');

    // Menú hamburguesa para móviles
    menuToggle.addEventListener('click', function() {
        navSection.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace (móviles)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navSection.classList.remove('active');
            menuToggle.classList.remove('active');

            // Actualizar enlace activo
            document.querySelectorAll('.nav-link').forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===============================
// SISTEMA DE MAPA
// ===============================

function initMap() {
    console.time('MapInit');
    map = L.map('guatemalaMap').setView([15.5, -90.25], 7);

    // Capa optimizada
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 18,
        minZoom: 6
    }).addTo(map);

    setupRiskLayers();
    addEmergencyResources();
    console.timeEnd('MapInit');
}

function setupRiskLayers() {
    // Capas de riesgo para volcanes
    const volcanoLayer = L.layerGroup().addTo(map);
    riskLayers.volcanoes = volcanoLayer;

    // Capas de riesgo para fallas sísmicas
    const earthquakeLayer = L.layerGroup().addTo(map);
    riskLayers.earthquakes = earthquakeLayer;

    // Ejemplo: agregar volcanes activos
    const volcanoes = [
        { name: "Volcán de Fuego", lat: 14.473, lng: -90.880, status: "critical" },
        { name: "Volcán Pacaya", lat: 14.381, lng: -90.601, status: "high" },
        { name: "Volcán Santiaguito", lat: 14.756, lng: -91.567, status: "medium" }
    ];

    volcanoes.forEach(volcano => {
        const color = volcano.status === 'critical' ? 'red' :
            volcano.status === 'high' ? 'orange' : 'yellow';

        L.circleMarker([volcano.lat, volcano.lng], {
            color: color,
            fillColor: color,
            fillOpacity: 0.7,
            radius: 8
        }).addTo(volcanoLayer).bindPopup(`<b>${volcano.name}</b><br>Estado: ${volcano.status}`);
    });
}

function addEmergencyResources() {
    // Agregar hospitales y centros de emergencia
    const hospitals = [
        { name: "Hospital Roosevelt", lat: 14.634, lng: -90.515, type: "hospital" },
        { name: "Hospital General", lat: 14.647, lng: -90.513, type: "hospital" },
        { name: "Cruz Roja Central", lat: 14.641, lng: -90.519, type: "emergency" }
    ];

    hospitals.forEach(hospital => {
        L.marker([hospital.lat, hospital.lng], {
            icon: L.divIcon({
                html: '<div style="background: #e74c3c; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
                className: 'hospital-marker'
            })
        }).addTo(map).bindPopup(`<b>${hospital.name}</b><br>${hospital.type === 'hospital' ? '🏥 Hospital' : '🆘 Centro de Emergencia'}`);
    });
}

function zoomToGuatemala() {
    map.setView([15.5, -90.25], 7);
    showAlert('info', 'Vista general de Guatemala');
}

function clearMarkers() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    showAlert('info', 'Marcadores limpiados');
}

function toggleRiskLayers() {
    Object.keys(riskLayers).forEach(layer => {
        if (map.hasLayer(riskLayers[layer])) {
            map.removeLayer(riskLayers[layer]);
        } else {
            map.addLayer(riskLayers[layer]);
        }
    });
    showAlert('info', 'Capas de riesgo actualizadas');
}

// ===============================
// SISTEMA DE MONITOREO EN TIEMPO REAL
// ===============================

function startFastMonitoring() {
    if (monitoringInterval) {
        clearInterval(monitoringInterval);
    }

    document.getElementById('startMonitoring').disabled = true;
    document.getElementById('stopMonitoring').disabled = false;

    // Carga inmediata
    refreshData();

    // Monitoreo continuo rápido
    monitoringInterval = setInterval(() => {
        const now = Date.now();
        const timeSinceLastUpdate = now - lastUpdateTime;

        // Actualización más frecuente si hay alertas críticas
        const updateInterval = systemMetrics.criticalAlerts > 0 ?
            CRITICAL_UPDATE_INTERVAL : FAST_UPDATE_INTERVAL;

        if (timeSinceLastUpdate >= updateInterval) {
            refreshData();
        }
    }, 5000); // Verificar cada 5 segundos

    showAlert('success', '✅ Sistema rápido activado - Actualizaciones cada 15 segundos');
}

function stopMonitoring() {
    if (monitoringInterval) {
        clearInterval(monitoringInterval);
        monitoringInterval = null;
    }
    document.getElementById('startMonitoring').disabled = false;
    document.getElementById('stopMonitoring').disabled = true;
    showAlert('info', 'Sistema de monitoreo pausado');
}

function refreshData() {
    console.time('DataRefresh');
    lastUpdateTime = Date.now();

    // Carga paralela de datos
    Promise.all([
        loadEarthquakeData(),
        loadWeatherData(),
        loadConredData()
    ]).then(() => {
        updateDashboard();
        updateStats();
        updateLastUpdateTime();
        console.timeEnd('DataRefresh');

        // Métricas de rendimiento
        systemMetrics.responseTime = Date.now() - lastUpdateTime;
        document.getElementById('responseTime').textContent = systemMetrics.responseTime + 'ms';
    }).catch(error => {
        console.error('Error en carga de datos:', error);
    });
}

// Carga optimizada de datos sísmicos
async function loadEarthquakeData() {
    const cacheKey = 'earthquakes_' + Math.floor(Date.now() / 60000); // Cache por minuto

    try {
        const data = await fetchWithCache(
            'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_hour.geojson',
            cacheKey,
            30000 // 30 segundos de cache
        );

        if (data && data.features) {
            updateEarthquakeList(data.features);
            systemMetrics.apiCalls++;
        }
    } catch (error) {
        console.log('Usando datos cacheados para sismos');
        // Datos de ejemplo para demo
        const mockData = {
            features: [
                {
                    properties: {
                        mag: 4.2,
                        place: "Cerca de San Marcos, Guatemala",
                        time: Date.now()
                    },
                    geometry: { coordinates: [-91.8, 14.9, 10] }
                },
                {
                    properties: {
                        mag: 3.7,
                        place: "Frontera México-Guatemala",
                        time: Date.now() - 3600000
                    },
                    geometry: { coordinates: [-92.1, 15.1, 15] }
                }
            ]
        };
        updateEarthquakeList(mockData.features);
    }
}

function updateEarthquakeList(earthquakes) {
    const list = document.getElementById('earthquakeList');
    const badge = document.getElementById('earthquakeBadge');
    let significantCount = 0;

    // Limpiar solo si hay cambios significativos
    if (earthquakes.length > 0) {
        list.innerHTML = '';

        earthquakes.slice(0, 8).forEach(quake => {
            if (quake.properties.mag >= 3.5) {
                significantCount++;
                const item = createEarthquakeItem(quake);
                list.appendChild(item);
            }
        });

        if (significantCount === 0) {
            list.innerHTML = '<li class="event-item event-earthquake">No hay sismos significativos</li>';
        }
    }

    badge.textContent = significantCount;
    systemMetrics.totalAlerts += significantCount;
}

function createEarthquakeItem(quake) {
    const li = document.createElement('li');
    const magnitude = quake.properties.mag;
    const isCritical = magnitude >= 5.0;
    const isHigh = magnitude >= 4.0;

    li.className = `event-item event-earthquake ${isCritical ? 'critical' : isHigh ? 'high' : ''}`;
    li.innerHTML = `
        <span class="status-indicator ${isCritical ? 'status-warning' : 'status-active'}"></span>
        ${quake.properties.place}
        <span class="event-magnitude">M ${magnitude}</span>
        <span class="event-details">Profundidad: ${quake.geometry.coordinates[2].toFixed(1)}km</span>
        <span class="event-time">${formatTime(new Date(quake.properties.time))}</span>
    `;

    // Agregar marcador rápido
    if (magnitude >= 4.0) {
        addQuickMarker('earthquake',
            quake.geometry.coordinates[1],
            quake.geometry.coordinates[0],
            quake.properties,
            isCritical ? 'critical' : 'high'
        );
    }

    return li;
}

// Sistema de marcadores optimizado
function addQuickMarker(type, lat, lng, data, severity = 'medium') {
    const existingMarker = markers.find(m =>
        m._latlng.lat === lat &&
        m._latlng.lng === lng &&
        m.options.type === type
    );

    if (existingMarker) {
        // Actualizar marcador existente
        existingMarker.setPopupContent(createPopupContent(type, data, severity));
        return existingMarker;
    }

    const icon = L.divIcon({
        html: `<div style="background: ${getColorBySeverity(severity)}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ${getColorBySeverity(severity)};"></div>`,
        className: 'quick-marker',
        iconSize: [20, 20]
    });

    const marker = L.marker([lat, lng], {
        icon: icon,
        type: type,
        severity: severity
    }).addTo(map).bindPopup(createPopupContent(type, data, severity));

    markers.push(marker);
    return marker;
}

function getColorBySeverity(severity) {
    const colors = {
        critical: '#e74c3c',
        high: '#f39c12',
        medium: '#3498db',
        low: '#2ecc71'
    };
    return colors[severity] || '#3498db';
}

function createPopupContent(type, data, severity) {
    const titles = {
        earthquake: '🌋 Sismo Detectado',
        volcano: '🏔️ Actividad Volcánica',
        flood: '💧 Alerta de Inundación',
        landslide: '⛰️ Riesgo de Deslizamiento'
    };

    return `
        <div style="min-width: 200px; font-size: 14px;">
            <h4 style="margin: 0 0 10px 0; color: ${getColorBySeverity(severity)};">
                ${titles[type]}
            </h4>
            <p><strong>Ubicación:</strong> ${data.place || data.location || 'Desconocido'}</p>
            ${data.mag ? `<p><strong>Magnitud:</strong> M ${data.mag}</p>` : ''}
            <p><strong>Severidad:</strong> <span style="color: ${getColorBySeverity(severity)}">${severity.toUpperCase()}</span></p>
            <p><strong>Actualizado:</strong> ${new Date().toLocaleTimeString()}</p>
        </div>
    `;
}

// Funciones de APIs (simuladas para demo)
async function fetchWithCache(url, cacheKey, ttl = 30000) {
    const cached = apiCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < ttl) {
        return cached.data;
    }

    try {
        // Simular API call
        const response = await fetch(url);
        if (!response.ok) throw new Error('API no disponible');

        const data = await response.json();

        apiCache.set(cacheKey, {
            data: data,
            timestamp: Date.now()
        });

        return data;
    } catch (error) {
        console.error('API Error:', error);
        return cached ? cached.data : null;
    }
}

async function loadWeatherData() {
    // Simular datos de clima
    await new Promise(resolve => setTimeout(resolve, 150));

    // Actualizar información del clima
    const weatherText = document.getElementById('weather-text');
    const chatWeatherText = document.getElementById('chat-weather-text');

    const weatherConditions = [
        "Despejado 🌞", "Parcialmente nublado ⛅", "Nublado ☁️",
        "Lluvia ligera 🌦️", "Tormenta eléctrica ⛈️"
    ];

    const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];

    if (weatherText) weatherText.textContent = randomWeather;
    if (chatWeatherText) chatWeatherText.textContent = randomWeather;
}

async function loadConredData() {
    // Simular datos de CONRED
    await new Promise(resolve => setTimeout(resolve, 100));
}

function updateDashboard() {
    // Actualizar otros paneles del dashboard
    updateVolcanoData();
    updateFloodData();
    updateLandslideData();
}

function updateVolcanoData() {
    // Datos simulados de volcanes
    const volcanoBadge = document.getElementById('volcanoBadge');
    if (volcanoBadge) volcanoBadge.textContent = '2'; // Volcán de Fuego y Pacaya activos
}

function updateFloodData() {
    const floodBadge = document.getElementById('floodBadge');
    const floodList = document.getElementById('floodList');

    if (floodBadge) floodBadge.textContent = '0';
    if (floodList) {
        floodList.innerHTML = `
            <li class="event-item event-flood">
                <span class="status-indicator status-active"></span>
                No hay alertas de inundaciones activas
                <span class="event-details">Monitoreo continuo de cuencas</span>
            </li>
        `;
    }
}

function updateLandslideData() {
    const landslideBadge = document.getElementById('landslideBadge');
    const landslideList = document.getElementById('landslideList');

    if (landslideBadge) landslideBadge.textContent = '0';
    if (landslideList) {
        landslideList.innerHTML = `
            <li class="event-item event-landslide">
                <span class="status-indicator status-active"></span>
                No hay alertas de deslizamientos
                <span class="event-details">Estabilidad normal en laderas</span>
            </li>
        `;
    }
}

// ===============================
// SISTEMA DE NOTIFICACIONES
// ===============================

function initNotifications() {
    updateNotificationStatus();
}

// Solicitar permiso para notificaciones
function requestNotificationPermission() {
    if (!("Notification" in window)) {
        alert("Este navegador no soporta notificaciones del sistema");
        return;
    }

    if (Notification.permission === "granted") {
        enableNotifications();
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                enableNotifications();
            } else {
                alert("Las notificaciones han sido bloqueadas. Puede activarlas manualmente en la configuración de su navegador.");
            }
        });
    } else {
        alert("Las notificaciones han sido bloqueadas. Puede activarlas manualmente en la configuración de su navegador.");
    }
}

// Activar notificaciones
function enableNotifications() {
    notificationSettings.enabled = true;
    updateNotificationStatus();
    showAlert('success', '🔔 Notificaciones activadas - Recibirá alertas en su dispositivo');
}

// Desactivar notificaciones
function disableNotifications() {
    notificationSettings.enabled = false;
    updateNotificationStatus();
    showAlert('info', '🔕 Notificaciones desactivadas');
}

// Actualizar estado de notificaciones en la UI
function updateNotificationStatus() {
    const statusText = document.getElementById('notificationStatusText');
    const statusDot = document.getElementById('notificationStatusDot');

    if (notificationSettings.enabled) {
        statusText.textContent = 'Activadas';
        statusDot.className = 'notification-dot notification-enabled';
    } else {
        statusText.textContent = 'Desactivadas';
        statusDot.className = 'notification-dot notification-disabled';
    }
}

// Alternar opción de notificación
function toggleNotificationOption(element, type) {
    element.classList.toggle('active');
    notificationSettings[type] = !notificationSettings[type];
}

// Enviar notificación al dispositivo
function sendDeviceNotification(title, message, type = 'info') {
    if (!notificationSettings.enabled) return;

    // Verificar configuraciones específicas por tipo
    if ((type === 'critical' && !notificationSettings.critical) ||
        (type === 'high' && !notificationSettings.high) ||
        (type === 'earthquake' && !notificationSettings.earthquake) ||
        (type === 'volcano' && !notificationSettings.volcano) ||
        (type === 'flood' && !notificationSettings.flood) ||
        (type === 'landslide' && !notificationSettings.landslide)) {
        return;
    }

    // Crear notificación del sistema
    const notification = new Notification(title, {
        body: message,
        icon: getNotificationIcon(type),
        tag: 'alerta-desastre', // Agrupar notificaciones similares
        requireInteraction: type === 'critical', // Mantener visible si es crítica
        vibrate: type === 'critical' ? [200, 100, 200] : [200] // Vibración diferente para críticas
    });

    // Acción al hacer clic en la notificación
    notification.onclick = function() {
        window.focus();
        // Aquí podrías navegar a una sección específica de la página
        if (type === 'earthquake') {
            document.getElementById('earthquakeList').scrollIntoView({ behavior: 'smooth' });
        } else if (type === 'volcano') {
            document.getElementById('volcanoList').scrollIntoView({ behavior: 'smooth' });
        }
        notification.close();
    };

    // Cerrar automáticamente después de un tiempo (excepto críticas)
    if (type !== 'critical') {
        setTimeout(() => {
            notification.close();
        }, 7000);
    }
}

// Obtener icono para la notificación según el tipo
function getNotificationIcon(type) {
    const icons = {
        critical: '🔴',
        high: '🟠',
        earthquake: '🌋',
        volcano: '🏔️',
        flood: '💧',
        landslide: '⛰️',
        info: 'ℹ️'
    };
    return icons[type] || icons.info;
}

// Probar notificación del dispositivo
function testDeviceNotification() {
    if (!notificationSettings.enabled) {
        alert("Primero debe activar las notificaciones");
        return;
    }

    sendDeviceNotification(
        '⚠️ Prueba de Alerta del Sistema',
        'Esta es una notificación de prueba del Sistema de Alertas de Desastres de Guatemala',
        'info'
    );
}

// ===============================
// SISTEMA DE ALERTAS Y EMERGENCIAS
// ===============================

function triggerAlert(type, location, severity) {
    const alertBanner = document.getElementById('alertBanner');
    const alertMessage = document.getElementById('alertMessage');

    alertMessage.textContent = `🚨 ${type.toUpperCase()}: ${location} - ${severity}`;
    alertBanner.className = `alert-banner ${type}-alert`;
    alertBanner.classList.remove('hidden');

    // Agregar al historial
    alertHistory.unshift({
        type: type,
        message: `${location} - ${severity}`,
        timestamp: new Date(),
        severity: severity.includes('CRÍTICO') ? 'critical' : 'high'
    });

    updateAlertTimeline();

    // Notificación del sistema
    if (notificationSettings.enabled) {
        const isCritical = severity.includes('CRÍTICO');
        const isHigh = severity.includes('ALTO');

        sendDeviceNotification(
            `⚠️ Alerta de ${type.toUpperCase()}`,
            `${location} - ${severity}`,
            isCritical ? 'critical' : isHigh ? 'high' : type
        );
    }

    setTimeout(() => {
        if (!alertBanner.classList.contains('hidden')) {
            closeAlert();
        }
    }, 8000);
}

function closeAlert() {
    document.getElementById('alertBanner').classList.add('hidden');
}

function updateAlertTimeline() {
    const timeline = document.getElementById('alertTimeline');
    timeline.innerHTML = '';

    alertHistory.slice(0, 6).forEach(alert => {
        const item = document.createElement('div');
        item.className = `timeline-item event-${alert.type} ${alert.severity}`;
        item.innerHTML = `
            <span>${alert.message}</span>
            <span class="timeline-time">${formatTime(new Date(alert.timestamp))}</span>
        `;
        timeline.appendChild(item);
    });
}

function showEmergencyInfo(type) {
    const info = {
        conred: { number: '1566', name: 'CONRED', description: 'Coordinadora para la Reducción de Desastres' },
        bomberos: { number: '122/123', name: 'Bomberos', description: 'Bomberos Municipales y Voluntarios' },
        policia: { number: '110', name: 'Policía Nacional', description: 'Policía Nacional Civil' },
        'cruz-roja': { number: '125', name: 'Cruz Roja', description: 'Cruz Roja Guatemalteca' }
    };

    const service = info[type];
    if (service) {
        alert(`🚨 ${service.name}\n📞 ${service.number}\n${service.description}\n\n¿Desea llamar ahora?`);
    }
}

// ===============================
// PANEL DE ADMINISTRACIÓN
// ===============================

function toggleAdminPanel() {
    const panel = document.getElementById('adminPanel');
    const isVisible = panel.style.display !== 'none';
    panel.style.display = isVisible ? 'none' : 'block';

    if (!isVisible) {
        updateAdminMetrics();
    }
}

function updateAdminMetrics() {
    document.getElementById('adminTotalAlerts').textContent = systemMetrics.totalAlerts;
    document.getElementById('adminResponseTime').textContent = systemMetrics.responseTime + 'ms';
    document.getElementById('adminResources').textContent = '12';
    document.getElementById('adminReports').textContent = '15';
}

function simulateCriticalEvent() {
    // Simular evento crítico
    const criticalEvent = {
        type: 'earthquake',
        location: 'Falla de Motagua',
        magnitude: 6.2,
        timestamp: new Date()
    };

    triggerAlert('earthquake', criticalEvent.location, `M ${criticalEvent.magnitude} - CRÍTICO`);

    // Enviar notificación al dispositivo
    sendDeviceNotification(
        '🚨 ALERTA CRÍTICA - SISMO',
        `Sismo de magnitud ${criticalEvent.magnitude} detectado en ${criticalEvent.location}. Tome medidas de seguridad inmediatas.`,
        'critical'
    );

    showAlert('critical', '🚨 EVENTO CRÍTICO SIMULADO - Sistema en máxima alerta');

    // Actualizar métricas
    systemMetrics.criticalAlerts++;
    updateStats();
}

function generateReport() {
    showAlert('success', '📊 Reporte generado y enviado');
}

function exportData() {
    showAlert('success', '💾 Datos exportados correctamente');
}

function sendMassAlert() {
    showAlert('warning', '📢 Alerta masiva enviada a todas las zonas');
}

// ===============================
// SISTEMA DE FILTROS
// ===============================

function applyFilters() {
    // Implementar lógica de filtrado
    const earthquakeChecked = document.getElementById('filterEarthquakes').checked;
    const volcanoChecked = document.getElementById('filterVolcanoes').checked;
    const floodChecked = document.getElementById('filterFloods').checked;
    const landslideChecked = document.getElementById('filterLandslides').checked;

    const severity = document.getElementById('severityFilter').value;
    const time = document.getElementById('timeFilter').value;

    console.log('Aplicando filtros:', {
        earthquake: earthquakeChecked,
        volcano: volcanoChecked,
        flood: floodChecked,
        landslide: landslideChecked,
        severity: severity,
        time: time
    });

    showAlert('info', 'Filtros aplicados correctamente');
}

// ===============================
// CHATBOT
// ===============================

function initChatbot() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatContainer = document.getElementById('chat-container');
    const sendButton = document.getElementById('send-message');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    // Chatbot toggle
    chatToggle.addEventListener('click', function() {
        chatContainer.classList.toggle('visible');
    });

    // Envío de mensajes del chatbot
    function addMessage(text, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    sendButton.addEventListener('click', async function () {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, true);
            chatInput.value = '';

            let sessionId = sessionStorage.getItem('sessionId');
            if (!sessionId) {
                sessionId = crypto.randomUUID();
                sessionStorage.setItem('sessionId', sessionId);
            }

            const res = await fetch("http://localhost:3000/chat", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({sessionId, message})
            });
            const data = await res.json();
            addMessage(data.response, false);
        }
    });

    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });
}


// ===============================
// SISTEMA DE REPORTES
// ===============================

function openReportModal() {
    document.getElementById('reportModal').style.display = 'block';
}

function closeReportModal() {
    document.getElementById('reportModal').style.display = 'none';
}

// Configurar el formulario de reportes
document.addEventListener('DOMContentLoaded', function() {
    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        reportForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const incidentType = document.getElementById('incidentType').value;
            const location = document.getElementById('location').value;
            const description = document.getElementById('description').value;

            // Simular envío de reporte
            console.log('Reporte enviado:', { incidentType, location, description });

            showAlert('success', '✅ Reporte enviado a las autoridades');
            closeReportModal();
            this.reset();

            // Simular que se activa una alerta basada en el reporte
            if (incidentType === 'earthquake') {
                setTimeout(() => {
                    triggerAlert('earthquake', location, 'REPORTE CIUDADANO - Verificando');
                }, 2000);
            }
        });
    }
});

// ===============================
// FUNCIONES UTILITARIAS
// ===============================

function formatTime(date) {
    return date.toLocaleTimeString('es-GT', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

function updateStats() {
    document.getElementById('criticalAlerts').textContent = systemMetrics.criticalAlerts;
    document.getElementById('highRiskAlerts').textContent = systemMetrics.highAlerts;
    document.getElementById('totalAlerts').textContent = systemMetrics.totalAlerts;
}

function updateLastUpdateTime() {
    const now = new Date();
    document.getElementById('updateTime').textContent =
        now.toLocaleTimeString('es-GT') + ' • ' +
        now.toLocaleDateString('es-GT');
}

function showAlert(type, message) {
    console.log(`[${type}] ${message}`);

    // Podrías implementar un sistema de notificaciones toast aquí
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        z-index: 10000;
        background: ${type === 'success' ? '#27ae60' : type === 'warning' ? '#f39c12' : type === 'error' ? '#e74c3c' : '#3498db'};
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 4000);
}