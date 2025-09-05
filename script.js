// ¡IMPORTANTE! Reemplaza 'TU_APPS_SCRIPT_WEB_APP_URL' con la URL que obtuviste al desplegar Apps Script
const APPS_SCRIPT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbylOSk_NM5XmnT7fBdiw6szRzL9-jnZUFtUc8uinOlXwR9MI0Wry1wNeT1vPl2N6NVdMw/exec';

// Credenciales de acceso
const VALID_USERNAME = 'SURAGUA';
const VALID_PASSWORD = 'Broncel3876';

let loggedInUser = ''; // Variable para almacenar el usuario logeado

// Elementos del DOM
const loginScreen = document.getElementById('loginScreen');
const optionsScreen = document.getElementById('optionsScreen');
const bidonesScreen = document.getElementById('bidonesScreen');
const mantenimientoScreen = document.getElementById('mantenimientoScreen');

const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

const btnBidones = document.getElementById('btnBidones');
const btnMantenimiento = document.getElementById('btnMantenimiento');
const btnLogout = document.getElementById('btnLogout');

const bidonesForm = document.getElementById('bidonesForm');
const bidonesMessage = document.getElementById('bidonesMessage');
const backToOptionsFromBidones = document.getElementById('backToOptionsFromBidones');

const mantenimientoForm = document.getElementById('mantenimientoForm');
const mantenimientoMessage = document.getElementById('mantenimientoMessage');
const backToOptionsFromMantenimiento = document.getElementById('backToOptionsFromMantenimiento');

// --- Funciones para mostrar pantallas ---
function showScreen(screenToShow) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
    screenToShow.classList.add('active');
}

// --- Manejo del Login ---
loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita que el formulario se envíe de la forma tradicional

    const username = usernameInput.value;
    const password = passwordInput.value;

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        loggedInUser = username; // Guarda el usuario logeado
        loginMessage.textContent = '';
        usernameInput.value = '';
        passwordInput.value = '';
        showScreen(optionsScreen);
    } else {
        loginMessage.textContent = 'Usuario o contraseña incorrectos.';
    }
});

btnLogout.addEventListener('click', () => {
    loggedInUser = ''; // Limpia el usuario logeado
    showScreen(loginScreen);
});

// --- Navegación entre opciones ---
btnBidones.addEventListener('click', () => {
    showScreen(bidonesScreen);
    bidonesMessage.textContent = ''; // Limpia mensajes anteriores
    bidonesForm.reset(); // Limpia el formulario
});

btnMantenimiento.addEventListener('click', () => {
    showScreen(mantenimientoScreen);
    mantenimientoMessage.textContent = ''; // Limpia mensajes anteriores
    mantenimientoForm.reset(); // Limpia el formulario
    // Establecer la fecha actual por defecto en el campo de mantenimiento
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Enero es 0
    const dd = String(today.getDate()).padStart(2, '0');
    document.getElementById('fechaMantenimiento').value = `${yyyy}-${mm}-${dd}`;
});

backToOptionsFromBidones.addEventListener('click', () => {
    showScreen(optionsScreen);
});

backToOptionsFromMantenimiento.addEventListener('click', () => {
    showScreen(optionsScreen);
});

// --- Envío de datos de Bidones ---
bidonesForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('sheet', 'Entregas');
    formData.append('usuario', loggedInUser); // Agrega el usuario logeado
    formData.append('cantidadEntregados', document.getElementById('cantidadEntregados').value);
    formData.append('vaciosRetirados', document.getElementById('vaciosRetirados').value);
    formData.append('lugar', document.getElementById('lugar').value);
    formData.append('sector', document.getElementById('sector').value);
    formData.append('observaciones', document.getElementById('observacionesBidones').value);

    try {
        const response = await fetch(APPS_SCRIPT_WEB_APP_URL, {
            method: 'POST',
            body: formData
        });
        const result = await response.text();
        bidonesMessage.textContent = '¡Datos de bidones guardados con éxito!';
        bidonesMessage.classList.remove('error-message');
        bidonesMessage.classList.add('success-message');
        bidonesForm.reset(); // Limpia el formulario después de guardar
    } catch (error) {
        console.error('Error al enviar datos de bidones:', error);
        bidonesMessage.textContent = 'Error al guardar datos. Intenta de nuevo.';
        bidonesMessage.classList.remove('success-message');
        bidonesMessage.classList.add('error-message');
    }
});

// --- Envío de datos de Mantenimiento ---
mantenimientoForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('sheet', 'Mantenimiento');
    formData.append('usuario', loggedInUser); // Agrega el usuario logeado
    formData.append('fechaMantenimiento', document.getElementById('fechaMantenimiento').value);
    formData.append('lugarDispenser', document.getElementById('lugarDispenser').value);
    formData.append('sectorDispenser', document.getElementById('sectorDispenser').value);
    formData.append('observacionesMantenimiento', document.getElementById('observacionesMantenimiento').value);

    try {
        const response = await fetch(APPS_SCRIPT_WEB_APP_URL, {
            method: 'POST',
            body: formData
        });
        const result = await response.text();
        mantenimientoMessage.textContent = '¡Datos de mantenimiento guardados con éxito!';
        mantenimientoMessage.classList.remove('error-message');
        mantenimientoMessage.classList.add('success-message');
        mantenimientoForm.reset(); // Limpia el formulario
        // Establecer la fecha actual de nuevo después de guardar
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        document.getElementById('fechaMantenimiento').value = `${yyyy}-${mm}-${dd}`;
    } catch (error) {
        console.error('Error al enviar datos de mantenimiento:', error);
        mantenimientoMessage.textContent = 'Error al guardar datos. Intenta de nuevo.';
        mantenimientoMessage.classList.remove('success-message');
        mantenimientoMessage.classList.add('error-message');
    }
});

// Inicializa mostrando la pantalla de login
showScreen(loginScreen);