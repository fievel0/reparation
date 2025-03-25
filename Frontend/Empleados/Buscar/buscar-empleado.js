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

    // Variable para almacenar el ID pendiente de borrado
    let pendingDeleteId = null;

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
        // Se muestran los datos en campos de entrada para poder editarlos (el ID se marca como readonly)
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

    // Evento para el botón Borrar: se muestra el modal de confirmación
    btnBorrar.addEventListener("click", () => {
        if (!btnID.classList.contains("active")) {
            showError("Para borrar, selecciona la opción ID");
            return;
        }
        const valor = inputField.value.trim();
        if (valor === "") {
            showError("Por favor ingresa el ID para borrar");
            return;
        }
        // Almacena el ID pendiente de borrado y muestra el modal
        pendingDeleteId = valor;
        modalConfirm.classList.remove("hidden");
    });

    // Evento para confirmar la eliminación (botón Sí)
    confirmYes.addEventListener("click", () => {
        if (!pendingDeleteId) return;
        
        const url = `http://localhost:8084/api/employee/delete/${pendingDeleteId}`;
        
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

    // Evento para cancelar la eliminación (botón Cancelar)
    confirmNo.addEventListener("click", () => {
        pendingDeleteId = null;
        modalConfirm.classList.add("hidden");
    });

    // Evento para el botón Actualizar
    btnActualizar.addEventListener("click", () => {
        if (!btnID.classList.contains("active")) {
            showError("Para actualizar, selecciona la opción ID");
            return;
        }
        const idField = document.getElementById("editId");
        if (!idField) {
            showError("No hay registro para actualizar. Realiza una búsqueda primero.");
            return;
        }
        const idEmployee = idField.value.trim();
        const nameEmployee = document.getElementById("editName").value.trim();
        const positionEmployee = document.getElementById("editPosition").value.trim();
        const cedEmployee = document.getElementById("editCedula").value.trim();
        const dirEmployee = document.getElementById("editDir").value.trim();
        const telEmpployee = document.getElementById("editPhone").value.trim();
        
        const payload = { idEmployee, nameEmployee, positionEmployee, cedEmployee, dirEmployee, telEmpployee };
        const url = `http://localhost:8084/api/employee/update/${idEmployee}`;

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
});
