// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const correoInput = document.getElementById('correo');
    const contrasenaInput = document.getElementById('contraseña');
    const mensajeDiv = document.getElementById('mensaje');

    form.addEventListener('submit', event => {
        event.preventDefault(); // Evita el envío tradicional del formulario

        // Construye el objeto JSON con los datos del formulario
        const data = {
            email: correoInput.value,
            password: contrasenaInput.value
        };

        // Realiza la solicitud POST al endpoint api/login/register
        fetch('http://localhost:8084/api/login/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.status);
            }
            return response.json();
        })
        .then(responseData => {
            // Muestra el mensaje de éxito con el id del usuario registrado
            mensajeDiv.innerHTML = `Usuario registrado exitosamente. ID: ${responseData.id} - Email: ${responseData.email}`;
            // Puedes limpiar el formulario o agregar otras acciones aquí si es necesario
            form.reset();
        })
        .catch(error => {
            console.error('Error en la solicitud Fetch:', error);
            mensajeDiv.innerHTML = 'Error al registrar usuario: ' + error.message;
        });
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
