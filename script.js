const form = document.getElementById('registration-form');
const confirmation = document.getElementById('confirmation');
const submitBtn = document.getElementById('submit-btn');

// Form fields
const nombre = document.getElementById('nombre');
const email = document.getElementById('email');
const fechaNacimiento = document.getElementById('fecha-nacimiento');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');
const privacyPolicy = document.getElementById('privacy-policy');

// Error messages
const nombreError = document.getElementById('nombre-error');
const emailError = document.getElementById('email-error');
const fechaNacimientoError = document.getElementById('fecha-nacimiento-error');
const passwordError = document.getElementById('password-error');
const confirmPasswordError = document.getElementById('confirm-password-error');
const privacyPolicyError = document.getElementById('privacy-policy-error');

// Set min/max dates for date input
const today = new Date();
const minDate = new Date(today.getFullYear() - 90, today.getMonth(), today.getDate());
const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

fechaNacimiento.setAttribute('min', minDate.toISOString().split('T')[0]);
fechaNacimiento.setAttribute('max', maxDate.toISOString().split('T')[0]);

// Variable para controlar si el formulario ha sido enviado al menos una vez
let formSubmitted = false;

// Función para mostrar y ocultar errores
function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';  // Se hace visible
    element.classList.add('visible'); // Agrega la clase 'visible'
}

function hideError(element) {
    element.style.display = 'none';   // Se oculta completamente
    element.classList.remove('visible'); // Elimina la clase 'visible'
}

// Función para calcular la edad
function calculateAge(birthdate) {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

// Función para alternar la visibilidad de la contraseña
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const type = field.getAttribute('type') === 'password' ? 'text' : 'password';
    field.setAttribute('type', type);
}

// Función para validar el formulario
function validateForm() {
    let isValid = true;

    if (formSubmitted) {
        if (!nombre.value.trim()) {
            showError(nombreError, 'El nombre es obligatorio');
            nombre.classList.add('error');
            isValid = false;
        } else {
            hideError(nombreError);
            nombre.classList.remove('error');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
            showError(emailError, 'Por favor, introduce un email válido');
            email.classList.add('error');
            isValid = false;
        } else {
            hideError(emailError);
            email.classList.remove('error');
        }

        if (!fechaNacimiento.value) {
            showError(fechaNacimientoError, 'Este campo es obligatorio');
            fechaNacimiento.classList.add('error');
            isValid = false;
        } else {
            const age = calculateAge(fechaNacimiento.value);
            if (age < 18 || age > 90) {
                showError(fechaNacimientoError, 'Debes tener entre 18 y 90 años');
                fechaNacimiento.classList.add('error');
                isValid = false;
            } else {
                hideError(fechaNacimientoError);
                fechaNacimiento.classList.remove('error');
            }
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!password.value || !passwordRegex.test(password.value)) {
            showError(passwordError, 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos');
            password.classList.add('error');
            isValid = false;
        } else {
            hideError(passwordError);
            password.classList.remove('error');
        }

        if (password.value !== confirmPassword.value) {
            showError(confirmPasswordError, 'Las contraseñas no coinciden');
            confirmPassword.classList.add('error');
            isValid = false;
        } else {
            hideError(confirmPasswordError);
            confirmPassword.classList.remove('error');
        }

        if (!privacyPolicy.checked) {
            showError(privacyPolicyError, 'Debes aceptar la política de privacidad');
            isValid = false;
        } else {
            hideError(privacyPolicyError);
        }
    }

    return isValid;
}

// Manejo del envío del formulario
submitBtn.addEventListener('click', function (e) {
    e.preventDefault();
    formSubmitted = true;

    if (validateForm()) {
        form.style.display = 'none';
        confirmation.style.display = 'block';

        document.getElementById('welcome-name').textContent = nombre.value;
        document.getElementById('confirm-nombre').textContent = nombre.value;
        document.getElementById('confirm-email').textContent = email.value;
        document.getElementById('confirm-fecha').textContent = new Date(fechaNacimiento.value).toLocaleDateString('es-ES');
        document.getElementById('confirm-edad').textContent = calculateAge(fechaNacimiento.value);
    }
});

// Botón de continuar en la página de confirmación
document.getElementById('continue-btn').addEventListener('click', function () {
    window.location.href = 'bienvenido.html';
});

// Validación en tiempo real de las contraseñas
confirmPassword.addEventListener('input', function () {
    if (password.value && password.value !== confirmPassword.value) {
        showError(confirmPasswordError, 'Las contraseñas no coinciden');
        confirmPassword.classList.add('error');
    } else {
        hideError(confirmPasswordError);
        confirmPassword.classList.remove('error');
    }
});

// Validación inicial
validateForm();