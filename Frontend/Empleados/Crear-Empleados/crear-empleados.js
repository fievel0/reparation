document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const mensaje = document.getElementById('mensaje');

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita el envío tradicional del formulario

        // Obtener valores de los campos y eliminar espacios en blanco
        const nameEmployee = document.getElementById('nameEmployee').value.trim();
        const positionEmployee = document.getElementById('positionEmployee').value.trim();
        const cedEmployee = document.getElementById('cedEmployee').value.trim();
        const dirEmployee = document.getElementById('dirEmployee').value.trim();
        const telEmpployee = document.getElementById('telEmpployee').value.trim();

        // Expresión regular para validar 10 dígitos
        const regex10Digitos = /^\d{10}$/;

        // Validar que la identificación tenga exactamente 10 dígitos
        if (!regex10Digitos.test(cedEmployee)) {
            mensaje.textContent = 'La identificación debe contener exactamente 10 dígitos.';
            mensaje.style.color = 'red';
            return;
        }

        // Validar que el teléfono tenga exactamente 10 dígitos
        if (!regex10Digitos.test(telEmpployee)) {
            mensaje.textContent = 'El teléfono debe contener exactamente 10 dígitos.';
            mensaje.style.color = 'red';
            return;
        }

        try {
            // Consultar si la identificación ya está registrada
            const checkResponse = await fetch(`http://localhost:8084/api/employee/find/${cedEmployee}`);

            if (checkResponse.ok) {
                // Si la respuesta es 200 OK, significa que la identificación ya existe
                mensaje.textContent = 'La identificación ya está registrada.';
                mensaje.style.color = 'red';
                return;
            } else if (checkResponse.status === 404) {
                // Si la respuesta es 404 Not Found, significa que no está registrada y se puede proceder con el registro
                console.log('Identificación no encontrada, procediendo con el registro.');
            } else {
                mensaje.textContent = 'Error al validar la identificación.';
                mensaje.style.color = 'red';
                return;
            }
        } catch (error) {
            console.error('Error al conectar con la API de validación:', error);
            mensaje.textContent = 'Error en la conexión con la API de validación.';
            mensaje.style.color = 'red';
            return;
        }

        // Si pasó todas las validaciones, proceder con el registro
        const payload = {
            nameEmployee,
            positionEmployee,
            cedEmployee,
            dirEmployee,
            telEmpployee
        };

        try {
            const response = await fetch('http://localhost:8084/api/employee/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                mensaje.textContent = 'Empleado agregado exitosamente.';
                mensaje.style.color = 'green';
                form.reset(); // Reinicia el formulario tras el guardado
            } else {
                mensaje.textContent = 'Error al guardar el empleado. Intenta nuevamente.';
                mensaje.style.color = 'red';
            }
        } catch (error) {
            console.error('Error al conectar con la API:', error);
            mensaje.textContent = 'Error en la conexión con la API.';
            mensaje.style.color = 'red';
        }
    });
    const btnDarkMode = document.getElementById("btn-dark-mode");

    // Aplicar el modo oscuro si estaba activado
    if (localStorage.getItem("dark-mode") === "enabled") {
        document.body.classList.add("dark-mode");
        if (btnDarkMode) btnDarkMode.textContent = "☀️";
    }

    if (btnDarkMode) {
        btnDarkMode.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");

            if (document.body.classList.contains("dark-mode")) {
                localStorage.setItem("dark-mode", "enabled");
                btnDarkMode.textContent = "☀️";
            } else {
                localStorage.setItem("dark-mode", "disabled");
                btnDarkMode.textContent = "🌑";
            }
        });
    }
});
