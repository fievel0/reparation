document.addEventListener("DOMContentLoaded", () => {
    // Referencias a elementos del DOM para búsqueda y acciones
    const btnID = document.getElementById("btnID");
    const inputField = document.querySelector(".CampoBuscar input");
    const resultContainer = document.querySelector(".result-container");
    const form = document.getElementById("CampoBuscar1");
    const btnBorrar = document.getElementById("btnBorrar");
    const btnActualizar = document.getElementById("btnActualizar");

    // Referencias a elementos del modal
    const modalConfirm = document.getElementById("modalConfirm");
    const confirmYes = document.getElementById("confirmYes");
    const confirmNo = document.getElementById("confirmNo");

    let pendingDeleteId = null;

    // Al ser la única opción, activamos el botón de ID por defecto
    btnID.classList.add("active");

    // Función para limpiar campo de entrada y resultados
    const clearData = () => {
        inputField.value = "";
        resultContainer.innerHTML = "";
    };

    // Función para mostrar el resultado formateado (sólo ID y Nombre)
    const showResult = (user) => {
        if (!user || Object.keys(user).length === 0) {
            resultContainer.innerHTML = `<p style="color: red;">No se encontró información.</p>`;
            return;
        }
        resultContainer.innerHTML = `
            <div class="customer">
                <p><strong>ID:</strong> <input type="text" id="editId" value="${user.id || ''}" readonly></p>
                <p><strong>Nombre:</strong> <input type="text" id="editName" value="${user.email || ''}"></p>
            </div>
        `;
    };

    // Función para mostrar errores
    const showError = (error) => {
        resultContainer.innerHTML = `<p style="color: red;">Error: ${error}</p>`;
    };

    // Evento submit del formulario: realiza la búsqueda por ID
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const valor = inputField.value.trim();
        if (valor === "") {
            showError("Por favor ingresa un valor para la búsqueda");
            return;
        }
        const url = `http://localhost:8084/api/login/findd/${valor}`;
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("La información no existe");
                }
                return response.json();
            })
            .then(data => {
                showResult(data);
            })
            .catch(error => {
                showError(error.message);
            });
    });

    // Evento para el botón Borrar: muestra el modal de confirmación
    btnBorrar.addEventListener("click", () => {
        const valor = inputField.value.trim();
        if (valor === "") {
            showError("Por favor ingresa el ID para borrar");
            return;
        }
        pendingDeleteId = valor;
        modalConfirm.classList.remove("hidden");
    });

    // Evento para el botón de confirmación "Sí" en el modal
    confirmYes.addEventListener("click", () => {
        if (!pendingDeleteId) return;
        const url = `http://localhost:8084/api/login/deletee/${pendingDeleteId}`;
        fetch(url, { method: "DELETE" })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al borrar el registro");
                }
                return response.text();
            })
            .then(() => {
                inputField.value = "";
                resultContainer.innerHTML = `<p style="color: green;">Registro Eliminado</p>`;
                pendingDeleteId = null;
                modalConfirm.classList.add("hidden");
            })
            .catch(error => {
                showError(error.message);
                pendingDeleteId = null;
                modalConfirm.classList.add("hidden");
            });
    });

    // Evento para el botón "Cancelar" en el modal
    confirmNo.addEventListener("click", () => {
        pendingDeleteId = null;
        modalConfirm.classList.add("hidden");
    });

    // Evento para el botón Actualizar: solo actualiza el nombre del usuario
    btnActualizar.addEventListener("click", () => {
        const idField = document.getElementById("editId");
        if (!idField) {
            showError("No hay registro para actualizar. Realiza una búsqueda primero.");
            return;
        }
        const id = idField.value.trim();
        const name = document.getElementById("editName").value.trim();

        const payload = { name };
        const url = `http://localhost:8084/api/customer/update/${id}`;

        fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al actualizar el registro");
                }
                return response.text();
            })
            .then(() => {
                resultContainer.innerHTML = `<p style="color: green;">Registro Actualizado</p>`;
                setTimeout(() => {
                    clearData();
                }, 3000);
            })
            .catch(error => {
                showError(error.message);
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
