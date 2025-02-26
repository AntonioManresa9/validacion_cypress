describe('Formulario de Registro', () => {
  beforeEach(() => {
    // Visita la página del formulario antes de cada test
    cy.visit('http://127.0.0.1:5500/registro.html'); // Asegúrate de que la ruta sea correcta
  });

  it('Verificar que el formulario se carga correctamente', () => {
    // Verifica que el formulario esté visible
    cy.get('#registration-form').should('be.visible');
  });

  it('Comprobar que todos los campos requeridos están presentes', () => {
    // Verifica que el campo de nombre esté presente
    cy.get('#nombre').should('exist');

    // Verifica que el campo de email esté presente
    cy.get('#email').should('exist');

    // Verifica que el campo de fecha de nacimiento esté presente
    cy.get('#fecha-nacimiento').should('exist');

    // Verifica que el campo de contraseña esté presente
    cy.get('#password').should('exist');

    // Verifica que el campo de confirmación de contraseña esté presente
    cy.get('#confirm-password').should('exist');

    // Verifica que el checkbox de política de privacidad esté presente
    cy.get('#privacy-policy').should('exist');

    // Verifica que el botón de envío esté presente
    cy.get('#submit-btn').should('exist');
  });

  it('Comprobar que aparecen mensajes de error al dejar campos obligatorios vacíos', () => {
    cy.get('#submit-btn').click({ force: true });
    cy.get('#nombre-error').should('be.visible');
    cy.get('#email-error').should('be.visible');
    cy.get('#password-error').should('be.visible');
    cy.get('#confirm-password-error').should('be.visible');
    cy.get('#privacy-policy-error').should('be.visible');
  });

  it('Verificar la validación de formato de correo electrónico', () => {
    cy.get('#email').type('correo-invalido');
    cy.get('#email').blur();
    cy.wait(500); // Espera 500ms para dar tiempo a que aparezca el mensaje de error
    cy.get('#email-error').should('be.visible').and('contain', 'formato válido');
  
    cy.get('#email').clear().type('correo@valido.com');
    cy.get('#email').blur();
    cy.get('#email-error').should('not.be.visible');
  });

  it('Probar requisitos de contraseña (longitud y complejidad)', () => {
    cy.get('#password').type('abc123');
    cy.get('#password').blur();
    cy.get('#password-error').should('be.visible');

    cy.get('#password').clear().type('Abc12345');
    cy.get('#password').blur();
    cy.get('#password-error').should('not.be.visible');
  });

  it('Verificar coincidencia de contraseñas', () => {
    cy.get('#password').type('Abc12345');
    cy.get('#confirm-password').type('Abc123456');
    cy.get('#confirm-password').blur();
    cy.get('#confirm-password-error').should('be.visible');

    cy.get('#confirm-password').clear().type('Abc12345');
    cy.get('#confirm-password').blur();
    cy.get('#confirm-password-error').should('not.be.visible');
  });

  it('Completar todo el formulario correctamente y verificar redirección', () => {
    cy.get('#nombre').type('Juan Pérez');
    cy.get('#email').type('juan@example.com');
    cy.get('#password').type('Password123');
    cy.get('#confirm-password').type('Password123');
    cy.get('#fecha-nacimiento').type('1990-01-01');
    cy.get('#privacy-policy').check();

    cy.get('#submit-btn').click();

    // Verificar redirección a página de confirmación
    cy.url().should('include', '/confirmacion.html');

    // Verificar contenido de la página de confirmación
    cy.get('h1').should('contain', 'Bienvenido');
    cy.get('.user-info').should('contain', 'Juan Pérez');
    cy.get('.user-info').should('contain', 'juan@example.com');
  });

  it('Probar valores límite para cada campo', () => {
    // Aquí puedes agregar pruebas para valores límite específicos de cada campo
  });

  it('Intentar inyección de scripts (básico)', () => {
    cy.get('#nombre').type('<script>alert("XSS")</script>');
    cy.get('#submit-btn').click();
    cy.on('window:alert', (str) => {
      expect(str).to.equal('XSS');
    });
  });

  it('Probar caracteres especiales en los campos', () => {
    cy.get('#nombre').type('!@#$%^&*()_+');
    cy.get('#email').type('test+special@example.com');
    cy.get('#password').type('P@ssw0rd!');
    cy.get('#confirm-password').type('P@ssw0rd!');
    cy.get('#fecha-nacimiento').type('1990-01-01');
    cy.get('#privacy-policy').check();

    cy.get('#submit-btn').click();

    // Verificar redirección a página de confirmación
    cy.url().should('include', '/confirmacion.html');

    // Verificar contenido de la página de confirmación
    cy.get('h1').should('contain', 'Bienvenido');
    cy.get('.user-info').should('contain', '!@#$%^&*()_+');
    cy.get('.user-info').should('contain', 'test+special@example.com');
  });
});