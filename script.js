// Datos de clientes de ejemplo
const clientes = {
    'CL-2023-001': { 
        password: 'cliente123', 
        nombre: 'María González',
        negocio: 'Moda Express',
        avatar: 'M'
    },
    'CL-2023-002': { 
        password: 'cliente123', 
        nombre: 'Carlos Rodríguez',
        negocio: 'Cosméticos Naturales',
        avatar: 'C'
    },
    'CL-2023-003': { 
        password: 'cliente123', 
        nombre: 'Ana Martínez',
        negocio: 'Accesorios Mascotas',
        avatar: 'A'
    }
};

// Funciones generales para toda la página
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle (solo en index.html)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            document.getElementById('main-nav').classList.toggle('active');
        });
    }

    // Header scroll effect (solo en index.html)
    if (document.getElementById('main-header')) {
        window.addEventListener('scroll', function() {
            const header = document.getElementById('main-header');
            if (window.scrollY > 100) {
                header.style.padding = '0.5rem 1rem';
                header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
            } else {
                header.style.padding = '1rem';
                header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            }
        });
    }

    // Smooth scrolling for anchor links (solo en index.html)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu after clicking a link
                const mainNav = document.getElementById('main-nav');
                if (mainNav) {
                    mainNav.classList.remove('active');
                }
            }
        });
    });

    // Funcionalidad del login (solo en login.html)
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        initializeLogin();
    }
});

// Funciones específicas para el login
function initializeLogin() {
    const loginForm = document.getElementById('login-form');
    const clientCodeInput = document.getElementById('client-code');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('remember-me');
    const loginButton = document.getElementById('login-button');
    const loginSpinner = document.getElementById('login-spinner');
    const loginText = document.getElementById('login-text');
    const errorAlert = document.getElementById('error-alert');
    const successAlert = document.getElementById('success-alert');
    const errorMessage = document.getElementById('error-message');

    // Cargar datos guardados si "Recordar mis datos" estaba activado
    const savedClientCode = localStorage.getItem('chaskyClientCode');
    const savedRememberMe = localStorage.getItem('chaskyRememberMe');
    
    if (savedClientCode && savedRememberMe === 'true') {
        clientCodeInput.value = savedClientCode;
        rememberMeCheckbox.checked = true;
    }

    // Manejo del envío del formulario
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const clientCode = clientCodeInput.value.trim();
        const password = passwordInput.value;
        const rememberMe = rememberMeCheckbox.checked;
        
        // Validaciones básicas
        if (!clientCode) {
            showError('Por favor, ingresa tu código de cliente');
            clientCodeInput.focus();
            return;
        }
        
        if (!password) {
            showError('Por favor, ingresa tu contraseña');
            passwordInput.focus();
            return;
        }
        
        // Mostrar estado de carga
        loginButton.classList.add('btn-loading');
        loginText.textContent = 'Verificando...';
        hideAlerts();
        
        // Simular verificación (en un sistema real sería una llamada al servidor)
        setTimeout(function() {
            // Verificar credenciales
            if (clientes[clientCode] && clientes[clientCode].password === password) {
                // Login exitoso
                if (rememberMe) {
                    localStorage.setItem('chaskyClientCode', clientCode);
                    localStorage.setItem('chaskyRememberMe', 'true');
                } else {
                    localStorage.removeItem('chaskyClientCode');
                    localStorage.removeItem('chaskyRememberMe');
                }
                
                // Guardar datos de sesión
                sessionStorage.setItem('chaskyLoggedIn', 'true');
                sessionStorage.setItem('chaskyClientCode', clientCode);
                sessionStorage.setItem('chaskyClientName', clientes[clientCode].nombre);
                sessionStorage.setItem('chaskyClientBusiness', clientes[clientCode].negocio);
                sessionStorage.setItem('chaskyClientAvatar', clientes[clientCode].avatar);
                
                showSuccess('¡Inicio de sesión exitoso! Redirigiendo a tu panel...');
                
                // Redirigir al panel del cliente después de un breve delay
                setTimeout(function() {
                    window.location.href = 'panel-cliente.html';
                }, 1500);
                
            } else {
                // Login fallido
                showError('Código de cliente o contraseña incorrectos');
                loginButton.classList.remove('btn-loading');
                loginText.textContent = 'Iniciar Sesión';
            }
        }, 1500); // Simular delay de red

        function showError(message) {
            errorMessage.textContent = message;
            errorAlert.style.display = 'block';
            successAlert.style.display = 'none';
        }

        function showSuccess(message) {
            errorAlert.style.display = 'none';
            successAlert.style.display = 'block';
        }

        function hideAlerts() {
            errorAlert.style.display = 'none';
            successAlert.style.display = 'none';
        }
    });

    // Manejo del botón "Recordar mis datos"
    rememberMeCheckbox.addEventListener('change', function() {
        if (!this.checked) {
            localStorage.removeItem('chaskyClientCode');
            localStorage.removeItem('chaskyRememberMe');
        }
    });

    // Manejo del enlace "¿Olvidaste tu contraseña?"
    document.querySelector('.forgot-password').addEventListener('click', function(e) {
        e.preventDefault();
        const clientCode = clientCodeInput.value.trim();
        
        if (!clientCode) {
            showError('Por favor, ingresa tu código de cliente para recuperar tu contraseña');
            clientCodeInput.focus();
            return;
        }
        
        // Simular proceso de recuperación
        showSuccess('Se ha enviado un enlace de recuperación a tu correo electrónico registrado');
    });

    // Manejo de botones de redes sociales (simulación)
    document.querySelectorAll('.social-btn').forEach(button => {
        button.addEventListener('click', function() {
            showError('Inicio de sesión con redes sociales temporalmente no disponible. Usa tu código de cliente y contraseña.');
        });
    });
}

// ===== FUNCIONALIDAD DEL PANEL DEL CLIENTE =====

// Inicializar el panel cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si estamos en el panel del cliente
    if (document.querySelector('.panel-container')) {
        initializeClientPanel();
    }
});

function initializeClientPanel() {
    // Cargar información del cliente desde sessionStorage
    loadClientInfo();
    
    // Inicializar navegación del sidebar
    initializeSidebarNavigation();
    
    // Inicializar formulario de nuevo pedido
    initializeNewOrderForm();
    
    // Inicializar funcionalidad de seguimiento
    initializeTracking();
}

// Cargar información del cliente
function loadClientInfo() {
    const clientName = sessionStorage.getItem('chaskyClientName');
    const clientBusiness = sessionStorage.getItem('chaskyClientBusiness');
    const clientAvatar = sessionStorage.getItem('chaskyClientAvatar');
    const clientCode = sessionStorage.getItem('chaskyClientCode');
    
    // Verificar si el usuario está logueado
    if (!clientCode) {
        window.location.href = 'login.html';
        return;
    }
    
    // Actualizar la interfaz con la información del cliente
    if (clientName) {
        document.getElementById('client-name').textContent = clientName;
    }
    
    if (clientBusiness) {
        document.getElementById('client-business').textContent = clientBusiness;
    }
    
    if (clientAvatar) {
        document.getElementById('client-avatar').textContent = clientAvatar;
    }
}

// Navegación del sidebar
function initializeSidebarNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover clase active de todos los links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Agregar clase active al link clickeado
            this.classList.add('active');
            
            // Ocultar todos los contenidos
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Mostrar el contenido correspondiente
            const targetId = this.getAttribute('href').substring(1);
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Formulario de nuevo pedido
function initializeNewOrderForm() {
    const newOrderForm = document.getElementById('nuevo-pedido-form');
    
    if (newOrderForm) {
        newOrderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener datos del formulario
            const formData = {
                tipoServicio: document.getElementById('tipo-servicio').value,
                fechaRecojo: document.getElementById('fecha-recojo').value,
                productos: document.getElementById('productos').value,
                direccionRecojo: document.getElementById('direccion-recojo').value,
                direccionEntrega: document.getElementById('direccion-entrega').value,
                instrucciones: document.getElementById('instrucciones').value
            };
            
            // Validar formulario
            if (validateOrderForm(formData)) {
                // Simular envío del pedido
                submitOrder(formData);
            }
        });
    }
}

// Validar formulario de pedido
function validateOrderForm(data) {
    if (!data.tipoServicio) {
        alert('Por favor, selecciona un tipo de servicio');
        return false;
    }
    
    if (!data.fechaRecojo) {
        alert('Por favor, selecciona una fecha de recojo');
        return false;
    }
    
    if (!data.productos.trim()) {
        alert('Por favor, describe los productos');
        return false;
    }
    
    if (!data.direccionRecojo.trim()) {
        alert('Por favor, ingresa la dirección de recojo');
        return false;
    }
    
    if (!data.direccionEntrega.trim()) {
        alert('Por favor, ingresa la dirección de entrega');
        return false;
    }
    
    return true;
}

// Enviar pedido (simulación)
function submitOrder(orderData) {
    // Mostrar loading
    const submitBtn = document.querySelector('#nuevo-pedido-form button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    // Simular delay de envío
    setTimeout(() => {
        // Generar ID de pedido simulado
        const orderId = 'CH-' + new Date().getFullYear() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
        
        // Mostrar mensaje de éxito
        alert(`¡Pedido enviado exitosamente!\n\nID de Pedido: ${orderId}\n\nTe contactaremos pronto para confirmar los detalles.`);
        
        // Resetear formulario
        document.getElementById('nuevo-pedido-form').reset();
        
        // Restaurar botón
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Redirigir a la sección de mis pedidos
        document.querySelector('a[href="#mis-pedidos"]').click();
        
    }, 2000);
}

// Funcionalidad de seguimiento
function initializeTracking() {
    const trackBtn = document.getElementById('track-btn');
    const trackingInput = document.getElementById('tracking-id');
    
    if (trackBtn && trackingInput) {
        trackBtn.addEventListener('click', function() {
            const trackingId = trackingInput.value.trim().toUpperCase();
            
            if (!trackingId) {
                alert('Por favor, ingresa un ID de pedido');
                return;
            }
            
            // Simular búsqueda de seguimiento
            simulateTracking(trackingId);
        });
        
        // Permitir buscar con Enter
        trackingInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                trackBtn.click();
            }
        });
    }
}

// Simular búsqueda de seguimiento
function simulateTracking(trackingId) {
    // Mostrar loading
    const trackBtn = document.getElementById('track-btn');
    const originalText = trackBtn.innerHTML;
    trackBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
    trackBtn.disabled = true;
    
    // Simular delay de búsqueda
    setTimeout(() => {
        // Datos de seguimiento simulados
        const trackingData = {
            'CH-2023-015': {
                exists: true,
                status: 'shipped',
                steps: [
                    { stage: 'Pedido Recibido', date: '20/11/2023 - 09:30 AM', completed: true },
                    { stage: 'En Proceso', date: '20/11/2023 - 10:15 AM', completed: true },
                    { stage: 'En Camino', date: '20/11/2023 - 02:30 PM', completed: false, active: true, detail: 'Repartidor: Juan Pérez - Contacto: 999 888 777' },
                    { stage: 'Entregado', date: 'Estimado: 20/11/2023 - 05:00 PM', completed: false }
                ]
            },
            'CH-2023-014': {
                exists: true,
                status: 'processing',
                steps: [
                    { stage: 'Pedido Recibido', date: '19/11/2023 - 11:20 AM', completed: true },
                    { stage: 'En Proceso', date: '19/11/2023 - 03:45 PM', completed: false, active: true },
                    { stage: 'En Camino', date: 'Próximamente', completed: false },
                    { stage: 'Entregado', date: 'Estimado: 21/11/2023', completed: false }
                ]
            }
        };
        
        const result = trackingData[trackingId];
        
        if (result && result.exists) {
            displayTrackingResult(trackingId, result);
        } else {
            alert('No se encontró ningún pedido con ese ID. Por favor, verifica el número e intenta nuevamente.');
        }
        
        // Restaurar botón
        trackBtn.innerHTML = originalText;
        trackBtn.disabled = false;
        
    }, 1500);
}

// Mostrar resultado de seguimiento
function displayTrackingResult(orderId, data) {
    const trackingResult = document.getElementById('tracking-result');
    
    let stepsHTML = '';
    data.steps.forEach((step, index) => {
        const stepClass = step.completed ? 'completed' : (step.active ? 'active' : '');
        const detailHTML = step.detail ? `<p class="step-detail">${step.detail}</p>` : '';
        
        stepsHTML += `
            <div class="tracking-step ${stepClass}">
                <div class="step-marker"></div>
                <div class="step-info">
                    <h5>${step.stage}</h5>
                    <p>${step.date}</p>
                    ${detailHTML}
                </div>
            </div>
        `;
    });
    
    trackingResult.innerHTML = `
        <div class="tracking-info">
            <h4>Pedido ${orderId}</h4>
            <div class="tracking-steps">
                ${stepsHTML}
            </div>
        </div>
    `;
}

// Cerrar sesión
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.querySelector('.btn-danger');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                // Limpiar sessionStorage
                sessionStorage.removeItem('chaskyLoggedIn');
                sessionStorage.removeItem('chaskyClientCode');
                sessionStorage.removeItem('chaskyClientName');
                sessionStorage.removeItem('chaskyClientBusiness');
                sessionStorage.removeItem('chaskyClientAvatar');
                
                // Redirigir al inicio
                window.location.href = 'index.html';
            }
        });
    }
});

// Funcionalidad del registro (solo en registro.html)
if (document.getElementById('registro-form')) {
    const registroForm = document.getElementById('registro-form');
    const errorAlert = document.getElementById('error-alert');
    const successAlert = document.getElementById('success-alert');
    const errorMessage = document.getElementById('error-message');
    const registroButton = document.getElementById('registro-button');
    const registroSpinner = document.getElementById('registro-spinner');

    // Ocultar alertas al inicio
    errorAlert.style.display = 'none';
    successAlert.style.display = 'none';

    registroForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Mostrar spinner y deshabilitar botón
        registroButton.disabled = true;
        registroSpinner.style.display = 'inline-block';
        
        // Obtener valores del formulario
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;
        const tipoNegocio = document.getElementById('tipo-negocio').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const terminos = document.getElementById('terminos').checked;
        
        // Validaciones básicas
        if (!nombre || !email || !telefono || !tipoNegocio || !password || !confirmPassword) {
            mostrarError('Por favor, completa todos los campos');
            return;
        }
        
        if (password !== confirmPassword) {
            mostrarError('Las contraseñas no coinciden');
            return;
        }
        
        if (!terminos) {
            mostrarError('Debes aceptar los términos y condiciones');
            return;
        }
        
        // Simulación de registro exitoso (en un caso real, aquí iría la llamada al servidor)
        setTimeout(function() {
            // Ocultar spinner
            registroSpinner.style.display = 'none';
            
            // Mostrar mensaje de éxito
            successAlert.style.display = 'flex';
            
            // Redireccionar después de 2 segundos
            setTimeout(function() {
                window.location.href = 'login.html';
            }, 2000);
        }, 1500);
    });
    
    function mostrarError(mensaje) {
        // Ocultar spinner y habilitar botón
        registroButton.disabled = false;
        registroSpinner.style.display = 'none';
        
        // Mostrar mensaje de error
        errorMessage.textContent = mensaje;
        errorAlert.style.display = 'flex';
        
        // Ocultar mensaje después de 3 segundos
        setTimeout(function() {
            errorAlert.style.display = 'none';
        }, 3000);
    }
}