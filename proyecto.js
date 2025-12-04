// Datos del usuario registrado
let usuarioRegistrado = null;
// Datos temporales de valoración del menú
let valoracionesMenuTemporal = null;
// Datos temporales de servicio y mantenimiento
let valoracionesServicioTemporal = null;

// Platillos disponibles en la valoración del menú
const menuPlatillos = [
    { id: 'torta', nombre: 'Torta Cubana' },
    { id: 'tacos', nombre: 'Tacos de carne' },
    { id: 'ensalada', nombre: 'Ensalada' },
    { id: 'chilaquiles', nombre: 'Chilaquiles' },
];

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si hay un usuario registrado en localStorage
    const usuarioGuardado = localStorage.getItem('usuarioCBTIS199');
    if (usuarioGuardado) {
        usuarioRegistrado = JSON.parse(usuarioGuardado);
        mostrarValoracion();
    } else {
        mostrarRegistro();
    }

    // Event listeners
    document.getElementById('registro-form').addEventListener('submit', manejarRegistro);
    document.getElementById('valoracion-form').addEventListener('submit', manejarValoracion);
    document.getElementById('servicio-form').addEventListener('submit', manejarServicio);
    document.getElementById('resena-form').addEventListener('submit', manejarResena);
    document.getElementById('volver-registro').addEventListener('click', volverRegistro);
    document.getElementById('volver-menu').addEventListener('click', volverMenu);
    document.getElementById('volver-servicio').addEventListener('click', volverServicio);
    document.getElementById('nueva-valoracion').addEventListener('click', nuevaValoracion);

    // Inicializar sistema de estrellas
    inicializarEstrellas();
});

// Función para mostrar la página de registro
function mostrarRegistro() {
    ocultarTodasLasPaginas();
    document.getElementById('registro-page').classList.add('active');
}

// Función para mostrar la página de valoración
function mostrarValoracion() {
    ocultarTodasLasPaginas();
    document.getElementById('valoracion-page').classList.add('active');
    
    if (usuarioRegistrado) {
        document.getElementById('usuario-info').textContent = 
            `Usuario: ${usuarioRegistrado.nombre} - ${usuarioRegistrado.grupo} - ${usuarioRegistrado.especialidad}`;
    }
}

// Función para mostrar la página de servicio y mantenimiento
function mostrarServicio() {
    ocultarTodasLasPaginas();
    document.getElementById('servicio-page').classList.add('active');
    
    if (usuarioRegistrado) {
        document.getElementById('usuario-info-servicio').textContent = 
            `Usuario: ${usuarioRegistrado.nombre} - ${usuarioRegistrado.grupo} - ${usuarioRegistrado.especialidad}`;
    }
}

// Función para mostrar la página de reseña
function mostrarResena() {
    ocultarTodasLasPaginas();
    document.getElementById('resena-page').classList.add('active');
    
    if (usuarioRegistrado) {
        document.getElementById('usuario-info-resena').textContent = 
            `Usuario: ${usuarioRegistrado.nombre} - ${usuarioRegistrado.grupo} - ${usuarioRegistrado.especialidad}`;
    }
}

// Función para mostrar la página de confirmación
function mostrarConfirmacion() {
    ocultarTodasLasPaginas();
    document.getElementById('confirmacion-page').classList.add('active');
}

// Función para ocultar todas las páginas
function ocultarTodasLasPaginas() {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
}

// Manejar el formulario de registro
function manejarRegistro(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value.trim();
    const grupo = document.getElementById('grupo').value.trim();
    const especialidad = document.getElementById('especialidad').value;

    if (!nombre || !grupo || !especialidad) {
        alert('Por favor, completa todos los campos');
        return;
    }

    // Guardar datos del usuario
    usuarioRegistrado = {
        nombre: nombre,
        grupo: grupo,
        especialidad: especialidad,
        fechaRegistro: new Date().toISOString()
    };

    localStorage.setItem('usuarioCBTIS199', JSON.stringify(usuarioRegistrado));

    // Mostrar página de valoración
    mostrarValoracion();
}

// Manejar el formulario de valoración del menú
function manejarValoracion(e) {
    e.preventDefault();

    // Obtener todas las calificaciones del menú
    const valoracionesMenu = menuPlatillos.map(item => {
        return {
            id: item.id,
            nombre: item.nombre,
            frecuencia: parseInt(document.getElementById(`${item.id}-frecuencia`).value),
            calidad: parseInt(document.getElementById(`${item.id}-calidad`).value)
        };
    });

    // Validar que cada platillo tenga ambas calificaciones
    const platillosIncompletos = valoracionesMenu.filter(val => val.frecuencia === 0 || val.calidad === 0);

    if (platillosIncompletos.length > 0) {
        alert('Por favor, califica frecuencia y valoración para cada platillo del menú.');
        return;
    }

    // Guardar temporalmente las valoraciones del menú
    valoracionesMenuTemporal = valoracionesMenu;

    // Mostrar página de servicio y mantenimiento
    mostrarServicio();
}

// Manejar el formulario de servicio y mantenimiento
function manejarServicio(e) {
    e.preventDefault();

    // Obtener calificaciones de servicio
    const servicioAtencion = parseInt(document.getElementById('servicio-atencion').value);
    const servicioVelocidad = parseInt(document.getElementById('servicio-velocidad').value);
    
    // Obtener calificaciones de mantenimiento
    const mantenimientoLimpieza = parseInt(document.getElementById('mantenimiento-limpieza').value);
    const mantenimientoInstalaciones = parseInt(document.getElementById('mantenimiento-instalaciones').value);

    // Validar que todas las categorías estén calificadas
    if (servicioAtencion === 0 || servicioVelocidad === 0 || mantenimientoLimpieza === 0 || mantenimientoInstalaciones === 0) {
        alert('Por favor, califica todas las categorías antes de enviar.');
        return;
    }

    const comentariosServicio = document.getElementById('comentarios-servicio').value.trim();

    // Calcular promedios
    const promedioServicio = (servicioAtencion + servicioVelocidad) / 2;
    const promedioMantenimiento = (mantenimientoLimpieza + mantenimientoInstalaciones) / 2;

    // Guardar temporalmente las valoraciones de servicio y mantenimiento
    valoracionesServicioTemporal = {
        servicio: {
            atencion: servicioAtencion,
            velocidad: servicioVelocidad,
            promedio: promedioServicio.toFixed(2)
        },
        mantenimiento: {
            limpieza: mantenimientoLimpieza,
            instalaciones: mantenimientoInstalaciones,
            promedio: promedioMantenimiento.toFixed(2)
        },
        comentarios: comentariosServicio
    };

    // Mostrar página de reseña general
    mostrarResena();
}

// Manejar el formulario de reseña general
function manejarResena(e) {
    e.preventDefault();

    const tituloResena = document.getElementById('titulo-resena').value.trim();
    const resenaTexto = document.getElementById('resena-texto').value.trim();
    const calificacionGeneral = parseInt(document.getElementById('calificacion-general').value);
    const recomendar = document.getElementById('recomendar').checked;

    // Validar que la reseña tenga al menos 50 caracteres
    if (resenaTexto.length < 50) {
        alert('Por favor, escribe una reseña de al menos 50 caracteres.');
        return;
    }

    // Validar que haya una calificación general
    if (calificacionGeneral === 0) {
        alert('Por favor, califica la cafetería en general.');
        return;
    }

    // Calcular promedios finales
    const promedioFrecuencia = valoracionesMenuTemporal.reduce((sum, val) => sum + val.frecuencia, 0) / valoracionesMenuTemporal.length;
    const promedioCalidad = valoracionesMenuTemporal.reduce((sum, val) => sum + val.calidad, 0) / valoracionesMenuTemporal.length;
    const promedioServicio = parseFloat(valoracionesServicioTemporal.servicio.promedio);
    const promedioMantenimiento = parseFloat(valoracionesServicioTemporal.mantenimiento.promedio);

    // Crear objeto completo de valoración
    const valoracionCompleta = {
        usuario: usuarioRegistrado,
        menu: valoracionesMenuTemporal,
        servicio: valoracionesServicioTemporal.servicio,
        mantenimiento: valoracionesServicioTemporal.mantenimiento,
        resena: {
            titulo: tituloResena || null,
            texto: resenaTexto,
            calificacionGeneral: calificacionGeneral,
            recomendar: recomendar
        },
        promedios: {
            frecuencia: promedioFrecuencia.toFixed(2),
            calidad: promedioCalidad.toFixed(2),
            servicio: promedioServicio.toFixed(2),
            mantenimiento: promedioMantenimiento.toFixed(2),
            general: calificacionGeneral
        },
        comentarios: valoracionesServicioTemporal.comentarios,
        fecha: new Date().toISOString()
    };

    // Guardar valoración en localStorage
    let valoracionesGuardadas = JSON.parse(localStorage.getItem('valoracionesCBTIS199') || '[]');
    valoracionesGuardadas.push(valoracionCompleta);
    localStorage.setItem('valoracionesCBTIS199', JSON.stringify(valoracionesGuardadas));

    // Limpiar datos temporales
    valoracionesMenuTemporal = null;
    valoracionesServicioTemporal = null;

    // Mostrar confirmación
    mostrarConfirmacion();
}

// Volver al registro
function volverRegistro() {
    localStorage.removeItem('usuarioCBTIS199');
    usuarioRegistrado = null;
    valoracionesMenuTemporal = null;
    valoracionesServicioTemporal = null;
    document.getElementById('registro-form').reset();
    document.getElementById('valoracion-form').reset();
    document.getElementById('servicio-form').reset();
    document.getElementById('resena-form').reset();
    resetearEstrellas();
    mostrarRegistro();
}

// Volver al menú
function volverMenu() {
    document.getElementById('servicio-form').reset();
    resetearEstrellas();
    mostrarValoracion();
}

// Volver a servicio
function volverServicio() {
    document.getElementById('resena-form').reset();
    resetearEstrellas();
    mostrarServicio();
}

// Nueva valoración
function nuevaValoracion() {
    valoracionesMenuTemporal = null;
    valoracionesServicioTemporal = null;
    document.getElementById('valoracion-form').reset();
    document.getElementById('servicio-form').reset();
    document.getElementById('resena-form').reset();
    resetearEstrellas();
    mostrarValoracion();
}

// Inicializar sistema de estrellas
function inicializarEstrellas() {
    const gruposEstrellas = document.querySelectorAll('.stars');
    
    gruposEstrellas.forEach(grupo => {
        const ratingId = grupo.getAttribute('data-rating');
        const estrellas = grupo.querySelectorAll('.star');
        const inputHidden = document.getElementById(ratingId);
        const textoRating = document.getElementById(ratingId + '-text');

        estrellas.forEach((estrella, index) => {
            estrella.addEventListener('click', () => {
                const valor = index + 1;
                inputHidden.value = valor;
                actualizarEstrellas(estrellas, valor);
                actualizarTextoRating(textoRating, valor);
            });

            estrella.addEventListener('mouseenter', () => {
                const valor = index + 1;
                resaltarEstrellas(estrellas, valor);
            });
        });

        grupo.addEventListener('mouseleave', () => {
            const valorActual = parseInt(inputHidden.value) || 0;
            actualizarEstrellas(estrellas, valorActual);
        });
    });
}

// Actualizar estrellas visualmente
function actualizarEstrellas(estrellas, valor) {
    estrellas.forEach((estrella, index) => {
        if (index < valor) {
            estrella.classList.add('active');
            estrella.classList.remove('hover');
        } else {
            estrella.classList.remove('active');
            estrella.classList.remove('hover');
        }
    });
}

// Resaltar estrellas al pasar el mouse
function resaltarEstrellas(estrellas, valor) {
    estrellas.forEach((estrella, index) => {
        if (index < valor) {
            estrella.classList.add('hover');
        } else {
            estrella.classList.remove('hover');
        }
    });
}

// Actualizar texto de rating
function actualizarTextoRating(elemento, valor) {
    if (!elemento || !valor) {
        return;
    }
    const textos = {
        1: 'Muy Malo',
        2: 'Malo',
        3: 'Regular',
        4: 'Bueno',
        5: 'Excelente'
    };
    elemento.textContent = `${valor} estrella(s) - ${textos[valor]}`;
}

// Resetear estrellas
function resetearEstrellas() {
    document.querySelectorAll('.star').forEach(estrella => {
        estrella.classList.remove('active', 'hover');
    });

    document.querySelectorAll('.stars').forEach(grupo => {
        const ratingId = grupo.getAttribute('data-rating');
        const inputHidden = document.getElementById(ratingId);
        if (inputHidden) {
            inputHidden.value = '0';
        }
    });

    document.querySelectorAll('.rating-text').forEach(texto => {
        texto.textContent = 'No calificado';
    });
}