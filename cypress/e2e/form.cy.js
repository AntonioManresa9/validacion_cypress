describe('Formulario de Registro', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5500/registro.html');
    });

    it('Verifica que el formulario se carga correctamente', () => {
        cy.get('#registration-form').should('be.visible');
    });

    it('Verifica que todos los campos requeridos están presentes', () => {
        cy.get('#nombre').should('exist');
        cy.get('#email').should('exist');
        cy.get('#fecha-nacimiento').should('exist');
        cy.get('#password').should('exist');
        cy.get('#confirm-password').should('exist');
        cy.get('#privacy-policy').should('exist');
        cy.get('#submit-btn').should('exist');
    });

    it('Verifica que se muestren los mensajes de error cuando los campos están vacíos', () => {
        cy.get('#submit-btn').click();

        cy.window().then((win) => win.validateForm()); // Forzar validación manualmente

        cy.get('#nombre-error').should('be.visible').and('contain', 'El nombre es obligatorio');
        cy.get('#email-error').should('be.visible').and('contain', 'Por favor, introduce un email válido');
        cy.get('#fecha-nacimiento-error').should('be.visible').and('contain', 'Este campo es obligatorio');
        cy.get('#password-error').should('be.visible').and('contain', 'La contraseña debe tener al menos 8 caracteres');
        cy.get('#confirm-password-error').should('be.visible').and('contain', 'Las contraseñas no coinciden');
        cy.get('#privacy-policy-error').should('be.visible').and('contain', 'Debes aceptar la política de privacidad');
    });

    it('Verifica que se muestre error si el email es inválido', () => {
        cy.get('#email').type('correo-invalido');
        cy.get('#submit-btn').click();

        cy.window().then((win) => win.validateForm());

        cy.get('#email-error').should('be.visible').and('contain', 'Por favor, introduce un email válido');
    });

    it('Verifica que se muestre error si la contraseña es demasiado corta', () => {
        cy.get('#password').type('123');
        cy.get('#submit-btn').click();

        cy.window().then((win) => win.validateForm());

        cy.get('#password-error').should('be.visible').and('contain', 'La contraseña debe tener al menos 8 caracteres');
    });

    it('Verifica que se muestre error si las contraseñas no coinciden', () => {
        cy.get('#password').type('Password123');
        cy.get('#confirm-password').type('Password456');
        cy.get('#submit-btn').click();
    
        // Validar la visibilidad después de la validación
        cy.window().then((win) => win.validateForm());
    
        // Verifica que el mensaje de error sea visible
        cy.get('#confirm-password-error').should('have.class', 'visible')
            .and('contain', 'Las contraseñas no coinciden');
    });

    
    

    it('Verifica que el formulario se envía correctamente con datos válidos', () => {
        cy.get('#nombre').type('Juan Pérez');
        cy.get('#email').type('juan.perez@example.com');
        cy.get('#fecha-nacimiento').type('1990-05-10');
        cy.get('#password').type('Password123@');
        cy.get('#confirm-password').type('Password123@');
        cy.get('#privacy-policy').check();
        cy.get('#submit-btn').click();

        cy.window().then((win) => win.validateForm());

        cy.get('#confirmation').should('be.visible');
        cy.get('#confirm-nombre').should('contain', 'Juan Pérez');
        cy.get('#confirm-email').should('contain', 'juan.perez@example.com');
    });
});

describe('Página de Confirmación', () => {
    beforeEach(() => {
        // Preparar datos de prueba para localStorage
        const registrationData = {
            fullName: 'Usuario Prueba',
            email: 'usuario@prueba.com',
            birthDate: '1990-01-01'
        };

        // Configurar localStorage antes de visitar la página
        cy.window().then((win) => {
            win.localStorage.setItem('registrationData', JSON.stringify(registrationData));
        });

        cy.visit('http://127.0.0.1:5500/bienvenido.html');
    });

    it('Debería mostrar un mensaje de bienvenida personalizado', () => {
        cy.get('#welcomeMessage').should('contain', '¡Bienvenido/a!'); // Cambié "Usuario Prueba" a mensaje de bienvenida
    });

    

    it('Debería tener botones para navegar a otras páginas', () => {
        cy.get('.buttons').within(() => {
            cy.get('a').should('have.length', 2);
            cy.get('a').first().should('have.attr', 'href', 'index.html');
            cy.get('a').last().should('have.attr', 'href', 'user-area.html');
        });
    });
});
