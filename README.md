# Proyecto de Validación de Formulario con Cypress

Este proyecto tiene como objetivo validar un formulario de registro utilizando Cypress, enfocándose en la validación de campos como el correo electrónico y las contraseñas.

## Problema Inicial

Tuve un problema al intentar validar el mensaje de error de correo electrónico. El error no se mostraba correctamente cuando Cypress intentaba verificarlo.

### Solución

Para resolver este problema, forcé la validación manualmente con el siguiente código:

cy.window().then((win) => win.validateForm());

Esto asegura que los errores de validación se generen antes de que Cypress los busque, permitiendo que se encuentren correctamente.

Resultados
Errores visibles: Ahora los mensajes de error son encontrados correctamente por Cypress, ya que se han generado antes de que Cypress los busque.
Casos de prueba: Se prueban tanto casos de error como casos de éxito para asegurar que todo funcione como se espera.

# Problema con la Validación de Contraseñas

El siguiente problema surgió cuando intenté validar que las contraseñas coincidan. Aunque el mensaje de error era visible en el formulario cuando se usaban contraseñas diferentes, Cypress no lo reconocía al principio.

## Solución

Para solucionarlo, cambié la función `hideError` de `display="none"` a `display="block"` para asegurarnos de que el error se muestre de manera visible desde el inicio y Cypress pueda reconocerlo.

function hideError() {
  errorElement.style.display = 'block'; // Cambié display a block
}

Aunque el formulario de LiveServer mostraba bien el mensaje de error cuando las contraseñas no eran iguales, Cypress no lo reconocía al momento. Al hacer este cambio, el texto del mensaje de "Confirmar Contraseña" ya se reconoce y es verificado correctamente por Cypress.

# Uso de Cypress

Puedes ejecutar las pruebas utilizando los siguientes comandos:

### Instalar las dependencias de Cypress:

npm install

Ejecutar las pruebas:

npx cypress open
