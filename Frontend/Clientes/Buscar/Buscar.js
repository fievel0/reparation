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
    const showResult = (customer) => {
        if (!customer || Object.keys(customer).length === 0) {
            resultContainer.innerHTML = `<p style="color: red;">No se encontró información.</p>`;
            return;
        }
        resultContainer.innerHTML = `
            <div class="customer"> 
                <p><strong>ID:</strong> <input type="text" id="editId" value="${customer.id_customer || ''}" readonly></p>
                <p><strong>Nombre:</strong> <input type="text" id="editName" value="${customer.name || ''}"></p>
                <p><strong>Identificación:</strong> <input type="text" id="editCard" value="${customer.cardIdentifi || ''}"></p>
                <p><strong>Teléfono:</strong> <input type="text" id="editPhone" value="${customer.phone || ''}"></p>
                <p><strong>Correo:</strong> <input type="text" id="editMail" value="${customer.mail || ''}"></p>
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
            ? `http://localhost:8084/api/customer/find/${valor}`
            : `http://localhost:8084/api/customer/cedula/${valor}`;
        
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
        if (!btnID.classList.contains("active")) {
            showError("Para borrar, selecciona la opción ID");
            return;
        }
        const valor = inputField.value.trim();
        if (valor === "") {
            showError("Por favor ingresa el ID para borrar");
            return;
        }
        
        // Asigna el ID pendiente de borrado y muestra el modal
        pendingDeleteId = valor;
        modalConfirm.classList.remove("hidden");
    });
  
    // Evento para el botón de confirmación "Sí" en el modal
    confirmYes.addEventListener("click", () => {
        if (!pendingDeleteId) return;
        
        const url = `http://localhost:8084/api/customer/delete/${pendingDeleteId}`;
        
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
        const id = idField.value.trim();
        const name = document.getElementById("editName").value.trim();
        const cardIdentifi = document.getElementById("editCard").value.trim();
        const phone = document.getElementById("editPhone").value.trim();
        const mail = document.getElementById("editMail").value.trim();
        
        const payload = { name, cardIdentifi, phone, mail };
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
  });
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const mensaje = document.getElementById('mensaje');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); // Evita el envío tradicional del formulario
  
      // Obtener valores de los campos
      const name = document.getElementById('nombre').value.trim();
      const cardIdentifi = document.getElementById('identificacion').value.trim();
      const phone = document.getElementById('telefono').value.trim();
      const mail = document.getElementById('correo').value.trim();
  
      // Expresión regular para validar 10 dígitos
      const regex10Digitos = /^\d{10}$/;
  
      // Validar que la identificación tenga exactamente 10 dígitos
      if (!regex10Digitos.test(cardIdentifi)) {
        mensaje.textContent = 'La identificación debe contener exactamente 10 dígitos.';
        mensaje.style.color = 'red';
        return;
      }
  
      // Validar que el teléfono tenga exactamente 10 dígitos
      if (!regex10Digitos.test(phone)) {
        mensaje.textContent = 'El teléfono debe contener exactamente 10 dígitos.';
        mensaje.style.color = 'red';
        return;
      }
  
      try {
        // Consultar si la identificación ya está registrada
        const checkResponse = await fetch(`http://localhost:8084/api/customer/find/${cardIdentifi}`);
  
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
        name,
        cardIdentifi,
        mail,
        phone
      };
  
      try {
        const response = await fetch('http://localhost:8084/api/customer/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
  
        if (response.ok) {
          mensaje.textContent = 'Cliente agregado correctamente.';
          mensaje.style.color = 'green';
          form.reset(); // Reinicia el formulario tras el guardado
        } else {
          mensaje.textContent = 'El cliente ya existe.';
          mensaje.style.color = 'red';
        }
      } catch (error) {
        console.error('Error al conectar con la API:', error);
        mensaje.textContent = 'Error en la conexión con la API.';
        mensaje.style.color = 'red';
      }
    });
  });
  