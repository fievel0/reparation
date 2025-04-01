document.addEventListener("DOMContentLoaded", () => {
    // Referencias a elementos del DOM
    const btnID = document.getElementById("btnID");
    // Se eliminó el btnCedula ya que solo se usa búsqueda por ID
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

    // Función para limpiar campo de entrada y resultados
    const clearData = () => {
        inputField.value = "";
        resultContainer.innerHTML = "";
    };

    // Función para mostrar el resultado formateado en inputs para edición
    // Mostramos id_pay, order_id, date_pay, money_pay y money_b_pay
    const showResult = (payment) => {
        if (!payment || Object.keys(payment).length === 0) {
            resultContainer.innerHTML = `<p style="color: red;">No se encontró información.</p>`;
            return;
        }
        resultContainer.innerHTML = `
            <div class="payment"> 
                <p><strong>Pago ID:</strong> <input type="text" id="editPaymentId" value="${payment.id_pay || ''}" readonly></p>
                <p><strong>Fecha de Pago:</strong> <input type="text" id="editDatePay" value="${payment.date_pay || ''}"></p>
                <p><strong>Saldo:</strong> <input type="text" id="editMoneyPay" value="${payment.money_pay || ''}"></p>
                <p><strong>Abono:</strong> <input type="text" id="editMoneyBPay" value="${payment.money_b_pay || ''}"></p>
                <p><strong>Order ID:</strong> <input type="text" id="editOrderId" value="${payment.order_id || ''}" readonly></p>            
            </div>
        `;
    };

    // Función para mostrar errores
    const showError = (error) => {
        resultContainer.innerHTML = `<p style="color: red;">Error: ${error}</p>`;
    };

    // --- Evento para búsqueda ---
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const valor = inputField.value.trim();
        if (valor === "") {
            showError("Por favor ingresa un valor para la búsqueda");
            return;
        }
        const url = `http://localhost:8084/api/payments/find/${valor}`;
        
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

    // --- Evento para borrar ---
    btnBorrar.addEventListener("click", () => {
        const valor = inputField.value.trim();
        if (valor === "") {
            showError("Por favor ingresa el Order ID para borrar");
            return;
        }
        
        // Asigna el order_id pendiente de borrado y muestra el modal
        pendingDeleteId = valor;
        modalConfirm.classList.remove("hidden");
    });

    // Evento para el botón de confirmación "Sí" en el modal
    confirmYes.addEventListener("click", () => {
        if (!pendingDeleteId) return;
        
        const url = `http://localhost:8084/api/payments/delete/${pendingDeleteId}`;
        
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

    // --- Evento para actualizar ---
    btnActualizar.addEventListener("click", () => {
        // Se usa el valor ingresado para la búsqueda como identificador del registro
        const valor = inputField.value.trim();
        if (valor === "") {
            showError("Por favor ingresa el Order ID para actualizar");
            return;
        }
        // Se leen los valores modificables de los inputs mostrados en el resultado
        const date_payElem = document.getElementById("editDatePay");
        const money_payElem = document.getElementById("editMoneyPay");
        const money_b_payElem = document.getElementById("editMoneyBPay");

        if (!date_payElem || !money_payElem || !money_b_payElem) {
            showError("No hay registro para actualizar. Realiza una búsqueda primero.");
            return;
        }

        const date_pay = date_payElem.value.trim();
        const money_pay = money_payElem.value.trim();
        const money_b_pay = money_b_payElem.value.trim();
        
        // Se arma el payload con el nuevo dato y el identificador
        const payload = {
            order_id: parseInt(valor), // se asume que el valor es numérico
            date_pay,
            money_pay,
            money_b_pay
        };

        // La URL de actualización incluye el valor ingresado (ej. 13)
        const url = `http://localhost:8084/api/payments/update/${valor}`;

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
            }, 2000);
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
