document.addEventListener("DOMContentLoaded", () => {
    // Referencias a elementos del DOM
    const btnID = document.getElementById("btnID");
    const inputField = document.querySelector(".CampoBuscar input");
    const resultContainer = document.querySelector(".result-container");
    const form = document.getElementById("CampoBuscar1");
    const btnBorrar = document.getElementById("btnBorrar");
    const btnActualizar = document.getElementById("btnActualizar");
  
    // Referencias a elementos del modal de confirmación
    const modalConfirm = document.getElementById("modalConfirm");
    const confirmYes = document.getElementById("confirmYes");
    const confirmNo = document.getElementById("confirmNo");
  
    let pendingDeleteId = null;
    let searchedId = null; // Variable para guardar el número ingresado en la búsqueda
  
    // Función para quitar la clase "active" (en este caso solo btnID)
    const clearSelected = () => {
      btnID.classList.remove("active");
    };
  
    // Función para limpiar el campo de entrada y resultados
    const clearData = () => {
      inputField.value = "";
      resultContainer.innerHTML = "";
      searchedId = null;
    };
  
    // Función para mostrar el resultado formateado en inputs para edición
    const showResult = (order) => {
      if (!order || Object.keys(order).length === 0) {
        resultContainer.innerHTML = `<p style="color: red;">No se encontró información.</p>`;
        return;
      }
      // Para payments, se mostrará el primero si existe
      const payment = order.payments && order.payments.length > 0 ? order.payments[0] : {};
  
      resultContainer.innerHTML = `
        <div class="order">
          <h3>Datos de la Orden</h3>
          <p><strong>ID Orden:</strong> <input type="text" id="editId" value="${order.id_order || ''}" readonly></p>
          <p><strong>Fecha de Creación:</strong> <input type="text" id="editCreateDate" value="${order.create_date || ''}"></p>
          <p><strong>Fecha Límite:</strong> <input type="text" id="editDeadline" value="${order.deadline || ''}"></p>
          <p><strong>Total a Pagar:</strong> <input type="text" id="editTotPay" value="${order.tot_pay || ''}"></p>
          <p><strong>Detalles Adicionales:</strong> <input type="text" id="editAdditDetails" value="${order.addit_details || ''}"></p>
          
          <h3>Datos del Cliente</h3>
          <p><strong>ID Cliente:</strong> <input type="text" id="editCustomerId" value="${order.customer?.id_customer || ''}" readonly></p>
          <p><strong>Nombre:</strong> <input type="text" id="editCustomerName" value="${order.customer?.name || ''}"></p>
          <p><strong>Cédula:</strong> <input type="text" id="editCardIdentifi" value="${order.customer?.cardIdentifi || ''}"></p>
          <p><strong>Teléfono:</strong> <input type="text" id="editCustomerPhone" value="${order.customer?.phone || ''}"></p>
          <p><strong>Correo:</strong> <input type="text" id="editCustomerMail" value="${order.customer?.mail || ''}"></p>
          
          <h3>Datos del Equipo</h3>
          <p><strong>ID Equipo:</strong> <input type="text" id="editEquipId" value="${order.equipment?.id_equip || ''}" readonly></p>
          <p><strong>Modelo:</strong> <input type="text" id="editModelEquip" value="${order.equipment?.model_equip || ''}"></p>
          <p><strong>Marca:</strong> <input type="text" id="editBrandEquip" value="${order.equipment?.brand_equip || ''}"></p>
          <p><strong>Color:</strong> <input type="text" id="editColorEquip" value="${order.equipment?.color_equip || ''}"></p>
          <p><strong>Estado:</strong> <input type="text" id="editStateEquip" value="${order.equipment?.state_equip || ''}"></p>
          <p><strong>Contraseña:</strong> <input type="text" id="contraseña" value="${order.equipment?.pass_equip || ''}"></p>
          <p><strong>Antivirus:</strong> <input type="text" id="editAntiEquip" value="${order.equipment?.anti_equip || ''}"></p>
          <p><strong>Accesorios:</strong> <input type="text" id="editAccessorEquip" value="${order.equipment?.accessor_equip || ''}"></p>
          <p><strong>Detalles Físicos:</strong> <input type="text" id="editOtherEquip" value="${order.equipment?.detail_phy_equip || ''}"></p>
          <p><strong>Temperatura:</strong> <input type="text" id="editTempEquip" value="${order.equipment?.temp_equip || ''}"></p>
          <p><strong>Encendido/Apagado:</strong> <input type="text" id="editOnOffEquip" value="${order.equipment?.on_off_equip ? 'Encendido' : 'Apagado'}"></p>
          <p><strong>Causa del daño:</strong> <input type="text" id="editCauDamEquip" value="${order.equipment?.cau_dam_equip || ''}"></p>
          <p><strong>Condición del Equipo:</strong> <input type="text" id="editCondEquip" value="${order.equipment?.condEquip || ''}"></p>
          
          <h3>Datos del Pago (primer pago)</h3>
          <p><strong>ID Pago:</strong> <input type="text" id="editPayId" value="${payment.id_pay || ''}" readonly></p>
          <p><strong>Fecha Pago:</strong> <input type="text" id="editDatePay" value="${payment.date_pay || ''}"></p>
          <p><strong>Monto Pagado:</strong> <input type="text" id="editMoneyPay" value="${payment.money_pay || ''}"></p>
          <p><strong>Monto Banco:</strong> <input type="text" id="editMoneyBPay" value="${payment.money_b_pay || ''}"></p>
          
          <h3>Datos del Empleado</h3>
          <p><strong>ID Empleado:</strong> <input type="text" id="editEmployeeId" value="${order.employee?.idEmployee || ''}" readonly></p>
          <p><strong>Nombre Empleado:</strong> <input type="text" id="editEmployeeName" value="${order.employee?.nameEmployee || ''}"></p>
        </div>
      `;
    };
  
    // Función para mostrar errores
    const showError = (error) => {
      resultContainer.innerHTML = `<p style="color: red;">Error: ${error}</p>`;
    };
  
    // Activar la búsqueda por ID
    btnID.addEventListener("click", () => {
      clearSelected();
      btnID.classList.add("active");
      clearData();
    });
  
    // Evento submit del formulario: realiza la búsqueda por ID
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!btnID.classList.contains("active")) {
        showError("Por favor, selecciona la opción de búsqueda por ID");
        return;
      }
      const valor = inputField.value.trim();
      if (valor === "") {
        showError("Por favor ingresa un valor para la búsqueda");
        return;
      }
      // Se asigna el número buscado a la variable global searchedId
      searchedId = valor;
      const url = `http://localhost:8084/api/ord_rep/find/${valor}`;
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
      pendingDeleteId = valor;
      modalConfirm.classList.remove("hidden");
    });
  
    // Evento para confirmar el borrado
    confirmYes.addEventListener("click", () => {
      if (!pendingDeleteId) return;
      const url = `http://localhost:8084/api/ord_rep/delete/${pendingDeleteId}`;
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
  
    // Evento para cancelar el borrado
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
      // Verificar que se haya realizado una búsqueda previa
      if (!searchedId) {
        showError("No hay registro para actualizar. Realiza una búsqueda primero.");
        return;
      }
  
      // Se recogen los valores actualizados de los campos de la orden
      const create_date = document.getElementById("editCreateDate").value.trim();
      const deadline = document.getElementById("editDeadline").value.trim();
      const tot_pay = document.getElementById("editTotPay").value.trim();
      const addit_details = document.getElementById("editAdditDetails").value.trim();
  
      // Datos del cliente
      const customer = {
        name: document.getElementById("editCustomerName").value.trim(),
        cardIdentifi: document.getElementById("editCardIdentifi").value.trim(),
        phone: document.getElementById("editCustomerPhone").value.trim(),
        mail: document.getElementById("editCustomerMail").value.trim()
      };
  
      // Datos del equipo
      const equipment = {
        model_equip: document.getElementById("editModelEquip").value.trim(),
        brand_equip: document.getElementById("editBrandEquip").value.trim(),
        color_equip: document.getElementById("editColorEquip").value.trim(),
        state_equip: document.getElementById("editStateEquip").value.trim(),
        pass_equip: document.getElementById("contraseña").value.trim(),
        anti_equip: document.getElementById("editAntiEquip").value.trim(),
        accessor_equip: document.getElementById("editAccessorEquip").value.trim(),
        detail_phy_equip: document.getElementById("editOtherEquip").value.trim(),
        temp_equip: document.getElementById("editTempEquip").value.trim(),
        on_off_equip: document.getElementById("editOnOffEquip").value.trim() === "Encendido",
        cau_dam_equip: document.getElementById("editCauDamEquip").value.trim(),
        condEquip: document.getElementById("editCondEquip").value.trim()
      };
  
      // Datos del pago (actualizando el primer pago)
      const payment = {
        date_pay: document.getElementById("editDatePay").value.trim(),
        money_pay: document.getElementById("editMoneyPay").value.trim(),
        money_b_pay: document.getElementById("editMoneyBPay").value.trim()
      };
  
      // Datos del empleado
      const employee = {
        nameEmployee: document.getElementById("editEmployeeName").value.trim()
      };
  
      // Construcción del payload con los datos actualizados
      const payload = { create_date, deadline, tot_pay, addit_details, customer, equipment, payment, employee };
  
      // Construir la URL de actualización utilizando el número buscado
      const url = `http://localhost:8084/api/ord_rep/update/${searchedId}`;
  
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
  