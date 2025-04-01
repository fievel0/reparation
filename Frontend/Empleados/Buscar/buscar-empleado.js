document.addEventListener("DOMContentLoaded", () => { 
    // Referencias a elementos del DOM
    const btnID = document.getElementById("btnID");
    const btnCedula = document.getElementById("btnCedula");
    const inputField = document.querySelector(".CampoBuscar input");
    const resultContainer = document.querySelector(".result-container");
    const form = document.getElementById("CampoBuscar1");
    const btnBorrar = document.getElementById("btnBorrar");
    const btnActualizar = document.getElementById("btnActualizar");

    // Referencias a elementos del modal
    const modalConfirm = document.getElementById("modalConfirm");
    const confirmYes = document.getElementById("confirmYes");
    const confirmNo = document.getElementById("confirmNo");

    // Variable para almacenar el valor pendiente de borrado
    let pendingDeleteValue = null;
    let deleteEndpoint = "";

    // Función para quitar la clase "active" de ambos botones
    const clearSelected = () => {
        btnID.classList.remove("active");
        btnCedula.classList.remove("active");
    };

    // Función para limpiar campo de entrada y resultados
    const clearData = () => {
        inputField.value = "";
        resultContainer.innerHTML = "";
    };

    // Función para mostrar el resultado formateado en inputs para edición
    const showResult = (employee) => {
        if (!employee || Object.keys(employee).length === 0) {
            resultContainer.innerHTML = `<p style="color: red;">No se encontró información.</p>`;
            return;
        }
        // Se muestran los datos en campos de entrada para poder editarlos
        resultContainer.innerHTML = `
            <div class="employee"> 
                <p><strong>ID:</strong> <input type="text" id="editId" value="${employee.idEmployee || ''}" readonly></p>
                <p><strong>Nombre:</strong> <input type="text" id="editName" value="${employee.nameEmployee || ''}"></p>
                <p><strong>Cargo:</strong> <input type="text" id="editPosition" value="${employee.positionEmployee || ''}"></p>
                <p><strong>Cédula:</strong> <input type="text" id="editCedula" value="${employee.cedEmployee || ''}"></p>
                <p><strong>Dirección:</strong> <input type="text" id="editDir" value="${employee.dirEmployee || ''}"></p>
                <p><strong>Teléfono:</strong> <input type="text" id="editPhone" value="${employee.telEmpployee || ''}"></p>
            </div>
        `;
    };

    // Función para mostrar errores
    const showError = (error) => {
        resultContainer.innerHTML = `<p style="color: red;">Error: ${error}</p>`;
    };

    // Eventos para seleccionar el tipo de búsqueda
    btnID.addEventListener("click", () => {
        clearSelected();
        btnID.classList.add("active");
        clearData();
    });

    btnCedula.addEventListener("click", () => {
        clearSelected();
        btnCedula.classList.add("active");
        clearData();
    });

    // Evento submit del formulario: realiza la búsqueda según el botón activo
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!btnID.classList.contains("active") && !btnCedula.classList.contains("active")) {
            showError("Por favor, selecciona una opción de búsqueda (ID o Cédula)");
            return;
        }
        const valor = inputField.value.trim();
        if (valor === "") {
            showError("Por favor ingresa un valor para la búsqueda");
            return;
        }
        // Selecciona el endpoint de búsqueda según la opción activa
        const url = btnID.classList.contains("active")
            ? `http://localhost:8084/api/employee/find/${valor}`
            : `http://localhost:8084/api/employee/cedula/${valor}`;
        
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

    // Evento para el botón Borrar: muestra el modal de confirmación y selecciona el endpoint según la opción activa
    btnBorrar.addEventListener("click", () => {
        const valor = inputField.value.trim();
        if (valor === "") {
            showError("Por favor ingresa un valor para borrar");
            return;
        }
        // Selecciona el endpoint según la opción activa
        if (btnID.classList.contains("active")) {
            pendingDeleteValue = valor;
            deleteEndpoint = `http://localhost:8084/api/employee/delete/${valor}`;
        } else if (btnCedula.classList.contains("active")) {
            pendingDeleteValue = valor;
            deleteEndpoint = `http://localhost:8084/api/employee/deletee/${valor}`;
        } else {
            showError("Por favor, selecciona una opción de búsqueda");
            return;
        }
        // Muestra el modal de confirmación
        modalConfirm.classList.remove("hidden");
    });

    // Evento para confirmar la eliminación (botón Sí)
    confirmYes.addEventListener("click", () => {
        if (!pendingDeleteValue || deleteEndpoint === "") return;
        
        fetch(deleteEndpoint, { method: "DELETE" })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al borrar el registro");
                }
                return response.text();
            })
            .then(() => {
                inputField.value = "";
                resultContainer.innerHTML = `<p style="color: green;">Registro Eliminado</p>`;
                pendingDeleteValue = null;
                deleteEndpoint = "";
                modalConfirm.classList.add("hidden");
            })
            .catch(error => {
                showError(error.message);
                pendingDeleteValue = null;
                deleteEndpoint = "";
                modalConfirm.classList.add("hidden");
            });
    });

    // Evento para cancelar la eliminación (botón Cancelar)
    confirmNo.addEventListener("click", () => {
        pendingDeleteValue = null;
        deleteEndpoint = "";
        modalConfirm.classList.add("hidden");
    });

    // Evento para el botón Actualizar: utiliza el endpoint según la opción activa
    btnActualizar.addEventListener("click", () => {
        // Se asume que ya se realizó una búsqueda y se muestran los campos editables
        const nameField = document.getElementById("editName");
        if (!nameField) {
            showError("No hay registro para actualizar. Realiza una búsqueda primero.");
            return;
        }
        const nameEmployee = nameField.value.trim();
        const positionEmployee = document.getElementById("editPosition").value.trim();
        const cedEmployee = document.getElementById("editCedula").value.trim();
        const dirEmployee = document.getElementById("editDir").value.trim();
        const telEmpployee = document.getElementById("editPhone").value.trim();

        const payload = { nameEmployee, positionEmployee, cedEmployee, dirEmployee, telEmpployee };
        let url = "";
        if (btnID.classList.contains("active")) {
            const idEmployee = document.getElementById("editId").value.trim();
            url = `http://localhost:8084/api/employee/update/${idEmployee}`;
            // Se incluye el id en el payload si fuera necesario
            payload.idEmployee = idEmployee;
        } else if (btnCedula.classList.contains("active")) {
            // Actualiza utilizando la cédula como identificador
            url = `http://localhost:8084/api/employee/updatee/${cedEmployee}`;
        } else {
            showError("Por favor, selecciona una opción de búsqueda");
            return;
        }

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
