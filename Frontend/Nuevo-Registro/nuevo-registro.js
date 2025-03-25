document.addEventListener('DOMContentLoaded', function() { 
  // ===============================
  // Selección Inicial: Cliente o Registro
  // ===============================
  const btnSi = document.querySelector('.btn-si');
  const btnNo = document.querySelector('.btn-no');
  const cuerpo = document.querySelector('.cuerpo'); // Sección de búsqueda de cliente
  const formContainer = document.querySelector('.form-container'); // Formulario de registro de cliente
  const formContainerr = document.querySelector('.form-containerr'); // Formulario de registro de equipo

  // Ocultamos inicialmente ambas secciones
  cuerpo.style.display = 'none';
  formContainer.style.display = 'none';
  
  btnSi.addEventListener('click', function() {
    cuerpo.style.display = 'block';
    formContainer.style.display = 'none';
  });

  btnNo.addEventListener('click', function() {
    formContainer.style.display = 'block';
    cuerpo.style.display = 'none';
  });

  // ===============================
  // Variables para guardar la información seleccionada
  // ===============================
  let selectedCustomer = null;
  let selectedEmployee = null;
  let selectedEquipment = null; // Para almacenar el equipo guardado

  // Función que verifica si ambos registros están seleccionados y muestra el formulario de equipo
  const checkIfBothSelected = () => {
    if (selectedCustomer && selectedEmployee) {
      formContainerr.style.display = "block";
      // Autocompletar el ID del cliente en el formulario de equipo
      const idCustomerInputEquip = formContainerr.querySelector('#id_customer');
      if(idCustomerInputEquip && selectedCustomer.id_customer){
        idCustomerInputEquip.value = selectedCustomer.id_customer;
      }
    }
  };

  // ===============================
  // Sección Cliente (Búsqueda y selección)
  // ===============================
  const customerSection = document.querySelector("div.cuerpo");
  const customerSearchForm = customerSection.querySelector("#CampoBuscar1");
  const customerInputField = customerSection.querySelector(".CampoBuscar input");
  const customerResultContainer = customerSection.querySelector(".result-container");
  const btnIDCustomer = customerSection.querySelector("#btnID");
  const btnCedulaCustomer = customerSection.querySelector("#btnCedula");

  // Elementos para ocultar la búsqueda una vez se seleccione
  const clientQuestion = document.querySelector(".pregunta-cliente");
  const clientResponseButtons = document.querySelector(".botones-respuesta");
  const clientFind = document.querySelector(".BotonesPrincipales");
  const clientFindBuscar = document.querySelector(".CampoBuscar");
  const clientTituloo = document.querySelector(".titulo-cliente");

  // Formulario de registro de cliente (nuevo cliente)
  const customerCreationForm = formContainer.querySelector("form");
  // Nota: ya se tiene el formulario de equipo en formContainerr
  const mensaje = document.getElementById('mensaje');

  // Función para limpiar el área de búsqueda del cliente
  const clearCustomerData = () => {
    customerInputField.value = "";
    customerResultContainer.innerHTML = "";
  };

  // Función para guardar la información final del cliente (seleccionado desde la búsqueda)
  const displaySelectedCustomer = (customer) => {
    selectedCustomer = customer;
    checkIfBothSelected(); // Verifica si ya se seleccionó el empleado
    // Autocompletar el campo de id en el formulario de equipo
    const idCustomerInputEquip = formContainerr.querySelector('#id_customer');
    if(idCustomerInputEquip){
      idCustomerInputEquip.value = customer.id_customer;
    }
  };

  // Función para mostrar el resultado de búsqueda de cliente con opción “Seleccionar”
  const showCustomerResult = (customer) => {
    if (!customer || Object.keys(customer).length === 0) {
      customerResultContainer.innerHTML = `<p style="color: red;">No se encontró información.</p>`;
      return;
    }
    customerResultContainer.innerHTML = `
      <div class="customer" style="background: #fff; padding: 10px; border-radius: 4px; width: 90%; border: 1px solid #f3f3f3;">
        <p><strong>Cliente</strong></p>
        <p><strong>ID:</strong> <input type="text" id="editId" value="${customer.id_customer || ''}" readonly></p>
        <p><strong>Nombre:</strong> <input type="text" id="editName" value="${customer.name || ''}"></p>
        <p><strong>Identificación:</strong> <input type="text" id="editCard" value="${customer.cardIdentifi || ''}"></p>
        <p><strong>Teléfono:</strong> <input type="text" id="editPhone" value="${customer.phone || ''}"></p>
        <p><strong>Correo:</strong> <input type="text" id="editMail" value="${customer.mail || ''}"></p>
      </div>
      <button class="btn-si" id="btnSeleccionar">Seleccionar</button>
    `;
    document.getElementById("btnSeleccionar").addEventListener("click", () => {
      displaySelectedCustomer(customer);
      document.getElementById("btnSeleccionar").remove();
      clientQuestion.style.display = "none";
      clientResponseButtons.style.display = "none";
      clientFind.style.display = "none";
      clientFindBuscar.style.display = "none";
      clientTituloo.style.display ="none";
      // Se muestra la sección de empleado
      employeeSection.style.display = "block";
    });
  };

  // Función para mostrar errores en la búsqueda de cliente
  const showCustomerError = (error) => {
    customerResultContainer.innerHTML = `<p style="color: red;">Error: ${error}</p>`;
  };

  // Eventos para elegir el tipo de búsqueda del cliente (ID o Cédula)
  btnIDCustomer.addEventListener("click", () => {
    btnIDCustomer.classList.add("active");
    btnCedulaCustomer.classList.remove("active");
    clearCustomerData();
  });
  btnCedulaCustomer.addEventListener("click", () => {
    btnCedulaCustomer.classList.add("active");
    btnIDCustomer.classList.remove("active");
    clearCustomerData();
  });

  // Evento submit para la búsqueda de cliente
  customerSearchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!btnIDCustomer.classList.contains("active") && !btnCedulaCustomer.classList.contains("active")) {
      showCustomerError("Por favor, selecciona una opción de búsqueda (ID o Cédula)");
      return;
    }
    const valor = customerInputField.value.trim();
    if (valor === "") {
      showCustomerError("Por favor ingresa un valor para la búsqueda");
      return;
    }
    const url = btnIDCustomer.classList.contains("active")
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
        showCustomerResult(data);
      })
      .catch(error => {
        showCustomerError(error.message);
      });
  });

  // ===============================
  // Sección Empleado (Búsqueda y selección)
  // ===============================
  const employeeSection = document.querySelector("main.cuerpo");
  employeeSection.style.display = "none"; // Se oculta hasta que se seleccione el cliente

  const employeeCampoBuscar = employeeSection.querySelector(".CampoBuscar");
  const employeeSearchForm = employeeSection.querySelector("#CampoBuscar1");
  const employeeInputField = employeeSection.querySelector(".CampoBuscar input");
  const employeeResultContainer = employeeSection.querySelector(".result-container");
  const employeebotones = employeeSection.querySelector(".Titulo_Empleado");
  const employeebotoness = employeeSection.querySelector(".BotonesPrincipales");
  const btnIDEmployee = employeeSection.querySelector("#btnID");
  const btnCedulaEmployee = employeeSection.querySelector("#btnCedula");
  const employee_titulo = employeeSection.querySelector(".t_general_Empleado");
  // Función para limpiar el área de búsqueda del empleado
  const clearEmployeeData = () => {
    employeeInputField.value = "";
    employeeResultContainer.innerHTML = "";
  };

  // Función para guardar la información final del empleado
  const displaySelectedEmployee = (employee) => {
    selectedEmployee = employee;
    checkIfBothSelected(); // Verifica si ya se seleccionó el cliente
  };

  // Función que retorna el HTML con la información del empleado
  const getEmployeeHTML = (employee) => {
    return `
      <div class="employee" style="background: #fff; padding: 10px; border-radius: 4px; width: 100%; border: 1px solid #f3f3f3;">
        <p><strong>Empleado</strong> </p>
        <p><strong>ID:</strong> <input type="text" id="editIdEmployee" value="${employee.idEmployee || ''}" readonly></p>
        <p><strong>Nombre:</strong> <input type="text" id="editNameEmployee" value="${employee.nameEmployee || ''}"></p>
        <p><strong>Cargo:</strong> <input type="text" id="editPositionEmployee" value="${employee.positionEmployee || ''}"></p>
        <p><strong>Cédula:</strong> <input type="text" id="editCedulaEmployee" value="${employee.cedEmployee || ''}"></p>
        <p><strong>Dirección:</strong> <input type="text" id="editDirEmployee" value="${employee.dirEmployee || ''}"></p>
        <p><strong>Teléfono:</strong> <input type="text" id="editPhoneEmployee" value="${employee.telEmpployee || ''}"></p>
      </div>
    `;
  };

  // Función para mostrar el resultado de búsqueda del empleado con opción “Seleccionar”
  const showEmployeeResult = (employee) => {
    if (!employee || Object.keys(employee).length === 0) {
      employeeResultContainer.innerHTML = `<p style="color: red;">No se encontró información.</p>`;
      return;
    }
    if (selectedEmployee) {
      employeeResultContainer.innerHTML = getEmployeeHTML(employee);
      return;
    }
    employeeResultContainer.innerHTML = `
      ${getEmployeeHTML(employee)}
      <button class="btn-si" id="btnSeleccionarEmployee">Seleccionar</button>
    `;
    document.getElementById("btnSeleccionarEmployee").addEventListener("click", () => {
      displaySelectedEmployee(employee);
      employeeResultContainer.innerHTML = getEmployeeHTML(employee);
      
      const btnSelectCustomer = document.getElementById("btnSeleccionar");
      if(btnSelectCustomer){
        btnSelectCustomer.style.display = "none";
      }
      
      // Si ya ambos registros están seleccionados, ocultamos controles de búsqueda (opcional)
      if (selectedCustomer && selectedEmployee) {
        employeeSearchForm.style.display = "none";
        employeebotones.style.display = "none";
        employeebotoness.style.display = "none";
        employee_titulo.style.display="none";
      }
    });
  };

  // Función para mostrar errores en la búsqueda del empleado
  const showEmployeeError = (error) => {
    employeeResultContainer.innerHTML = `<p style="color: red;">Error: ${error}</p>`;
  };

  // Eventos para elegir el tipo de búsqueda en empleado (ID o Cédula)
  btnIDEmployee.addEventListener("click", () => {
    btnIDEmployee.classList.add("active");
    btnCedulaEmployee.classList.remove("active");
    clearEmployeeData();
  });
  btnCedulaEmployee.addEventListener("click", () => {
    btnCedulaEmployee.classList.add("active");
    btnIDEmployee.classList.remove("active");
    clearEmployeeData();
  });

  // Evento submit para la búsqueda de empleado
  employeeSearchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!btnIDEmployee.classList.contains("active") && !btnCedulaEmployee.classList.contains("active")) {
      showEmployeeError("Por favor, selecciona una opción de búsqueda (ID o Cédula)");
      return;
    }
    const valor = employeeInputField.value.trim();
    if (valor === "") {
      showEmployeeError("Por favor ingresa un valor para la búsqueda");
      return;
    }
    const url = btnIDEmployee.classList.contains("active")
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
        showEmployeeResult(data);
      })
      .catch(error => {
        showEmployeeError(error.message);
      });
  });
  
  // ===============================
  // Creación de Cliente (Formulario Nuevo Cliente)
  // ===============================
  customerCreationForm.addEventListener('submit', async (e) => {
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
        mensaje.textContent = 'La identificación ya está registrada.';
        mensaje.style.color = 'red';
        return;
      } else if (checkResponse.status === 404) {
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
        customerCreationForm.reset();
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
  
  // ===============================
  // Registro de Equipo (Formulario de Equipos)
  // ===============================
  const equipoForm = formContainerr.querySelector('#equipo-form');
  const buscarClienteBtnEquip = equipoForm.querySelector('#buscar_cliente');
  const idCustomerInputEquip = equipoForm.querySelector('#id_customer');
  const clienteBuscadoContainer = equipoForm.querySelector('.cliente_buscado');
  const mensajeEquip = formContainerr.querySelector('#mensaje');

  // Aseguramos que el contenedor para la Orden de Pago permanezca oculto inicialmente
  const formContainerrr = document.querySelector('.form-containerrr');
  formContainerrr.style.display = 'none';

  // Aseguramos que el contenedor para el Pago permanezca oculto inicialmente
  const formPago = document.querySelector('.formPago');
  formPago.style.display = 'none';

  // Función para mostrar datos del cliente en el formulario de equipo
  const mostrarClienteEquip = (cliente) => {
    if (!cliente || Object.keys(cliente).length === 0) {
      clienteBuscadoContainer.innerHTML = `<p style="color: red;">No se encontró información.</p>`;
      return;
    }
    clienteBuscadoContainer.innerHTML = `
      <div class="cliente">
        <p><strong>ID:</strong> ${cliente.id_customer || ''}</p>
        <p><strong>Nombre:</strong> ${cliente.name || ''}</p>
        <p><strong>Identificación:</strong> ${cliente.cardIdentifi || ''}</p>
        <p><strong>Teléfono:</strong> ${cliente.phone || ''}</p>
        <p><strong>Correo:</strong> ${cliente.mail || ''}</p>
      </div>
    `;
  };

  // Función para mostrar errores en la búsqueda de cliente en el formulario de equipo
  const mostrarErrorEquip = (errorMsg) => {
    clienteBuscadoContainer.innerHTML = `<p style="color: red;">Error: ${errorMsg}</p>`;
  };

  // Evento click para el botón "Buscar" del cliente en el formulario de equipo
  buscarClienteBtnEquip.addEventListener("click", (e) => {
    e.preventDefault();
    const idValue = idCustomerInputEquip.value.trim();
    if (idValue === "") {
      mostrarErrorEquip("Ingrese un ID válido.");
      return;
    }
    const url = `http://localhost:8084/api/customer/find/${idValue}`;
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error("No se encontró el cliente");
        }
        return response.json();
      })
      .then(data => {
        mostrarClienteEquip(data);
      })
      .catch(error => {
        mostrarErrorEquip(error.message);
      });
  });

  // Evento submit para guardar el equipo
  equipoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const model_equip = document.getElementById("model_equip").value.trim();
    const brand_equip = document.getElementById("brand_equip").value.trim();
    const color_equip = document.getElementById("color_equip").value.trim();
    const state_equip = document.getElementById("state_equip").value.trim();
    const pass_equip = document.getElementById("pass_equip").value.trim();
    const anti_equip = document.getElementById("anti_equip").value.trim();
    const accessor_equip = document.getElementById("accessor_equip").value.trim();
    const reported_equip = document.getElementById("reported_equip").value.trim();
    const detail_phy_equip = document.getElementById("detail_phy_equip").value.trim();
    const temp_equip = document.getElementById("temp_equip").value.trim();
    const on_off_equip = document.getElementById("on_off_equip").value === "true";
    const cau_dam_equip = document.getElementById("cau_dam_equip").value.trim();
    const condEquip = document.getElementById("condEquip").value;
    const id_customer = parseInt(document.getElementById("id_customer").value);

    const payload = {
      model_equip,
      brand_equip,
      color_equip,
      state_equip,
      pass_equip,
      anti_equip,
      accessor_equip,
      reported_equip,
      detail_phy_equip,
      temp_equip,
      on_off_equip,
      cau_dam_equip,
      condEquip,
      id_customer
    };

    const url = "http://localhost:8084/api/equipment/save";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
      })
      .then(data => {
        // Mensaje inicial de éxito
        mensajeEquip.innerHTML = `<p style="color: green;">Equipo guardado con éxito, ID: ${data.id}</p>`;
        equipoForm.reset();

        // Ocultamos el formulario de Equipo
        formContainerr.style.display = 'none';

        // Mostramos el contenedor de Orden de Pago
        formContainerrr.style.display = 'block';
        const resultContainerrr = document.querySelector('.result-containerrr');

        // Realizamos una nueva solicitud para obtener los datos completos del equipo guardado
        fetch(`http://localhost:8084/api/equipment/find/${data.id}`)
          .then(response => {
            if (!response.ok) {
              throw new Error("Error al obtener los detalles del equipo");
            }
            return response.json();
          })
          .then(equipoData => {
            selectedEquipment = equipoData; // Guardamos el equipo para usarlo en la orden
            resultContainerrr.innerHTML = `
              <div class="team-result" style="background: #fff; padding: 10px; border-radius: 4px; width: 90%; border: 1px solid #f3f3f3; margin-bottom: 10px;">
                <p><strong>Equipo</strong></p>
                <p><strong>ID del Equipo:</strong> ${equipoData.id_equip}</p>
                <p><strong>Modelo:</strong> ${equipoData.model_equip}</p>
                <p><strong>Marca:</strong> ${equipoData.brand_equip}</p>
                <p><strong>Contraseña:</strong> ${equipoData.pass_equip}</p>
                <p><strong>Encendido:</strong> ${equipoData.on_off_equip ? "Encendido" : "Apagado"}</p>
              </div>
            `;
            // Si ya están seleccionados cliente y empleado, actualizamos los campos de la orden de pago
            if(selectedCustomer){
              const idClienteInput = document.getElementById("idCliente");
              if(idClienteInput) idClienteInput.value = selectedCustomer.id_customer;
            }
            if(selectedEmployee){
              const idEmpleadoInput = document.getElementById("idEmpleado");
              if(idEmpleadoInput) idEmpleadoInput.value = selectedEmployee.idEmployee;
            }
            if(selectedEquipment){
              const idEquipoInput = document.getElementById("idEquipo");
              if(idEquipoInput) idEquipoInput.value = selectedEquipment.id_equip;
            }
          })
          .catch(error => {
            mensajeEquip.innerHTML = `<p style="color: red;">Error al obtener el equipo: ${error.message}</p>`;
          });
      })
      .catch(error => {
        mensajeEquip.innerHTML = `<p style="color: red;">Error al guardar el equipo: ${error.message}</p>`;
      });
  });
  
  // ===============================
  // Registro de Orden de Pago (Formulario de Orden de Pago)
  // ===============================
  const orderFormContainer = document.querySelector('.form-containerrr');
  if (orderFormContainer) {
    const orderForm = orderFormContainer.querySelector("form");
    const orderMensajeDiv = orderFormContainer.querySelector("#mensaje");

    // Autocompletar los IDs en el formulario de orden de pago si están disponibles
    if(selectedCustomer){
      const idClienteInput = document.getElementById("idCliente");
      if(idClienteInput) idClienteInput.value = selectedCustomer.id_customer;
    }
    if(selectedEmployee){
      const idEmpleadoInput = document.getElementById("idEmpleado");
      if(idEmpleadoInput) idEmpleadoInput.value = selectedEmployee.idEmployee;
    }
    if(selectedEquipment){
      const idEquipoInput = document.getElementById("idEquipo");
      if(idEquipoInput) idEquipoInput.value = selectedEquipment.id_equip;
    }

    orderForm.addEventListener("submit", (event) => {
      event.preventDefault();

      // Obtener los valores de los inputs del formulario de orden de pago
      const create_date = document.getElementById("fechaRecepcion").value;
      const deadline = document.getElementById("fechaEntrega").value;
      const tot_pay = parseFloat(document.getElementById("totalPago").value);
      const addit_details = document.getElementById("detalles").value;
      const id_customer = parseInt(document.getElementById("idCliente").value);
      const id_equip = parseInt(document.getElementById("idEquipo").value);
      const idEmployee = parseInt(document.getElementById("idEmpleado").value);

      // Crear el objeto con la estructura JSON requerida
      const ordenData = {
        create_date,
        deadline,
        tot_pay,
        addit_details,
        customer: { id_customer },
        equipment: { id_equip },
        employee: { idEmployee }
      };

      fetch("http://localhost:8084/api/ord_rep/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(ordenData)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Error en la respuesta del servidor");
          }
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            return response.json();
          } else {
            return response.text().then(text => {
              const match = text.match(/(?:id_order|id):\s*(\d+)/i);
              return { id: match ? parseInt(match[1], 10) : null };
            });
          }
        })
        .then(data => {
          // Se intenta extraer el ID en diferentes formatos
          const orderId = data.id_order || data.id || (data.order && data.order.id) || 
                          (typeof data === 'number' ? data : "ID no encontrado");
          console.log("Orden guardada:", data);
          orderMensajeDiv.innerText = "Orden guardada correctamente";
      
          // Autocompletar el ID de la orden en el formulario de pago
          const idOrderInput = document.getElementById("idOrder");
          if(idOrderInput) idOrderInput.value = orderId;
      
          // Ocultamos el contenedor de Orden de Pago
          orderFormContainer.style.display = 'none';
          formPago.style.display = 'block';
      
          // Actualizar el contenedor con la información de la orden
          const resultContainerrr = document.querySelector('.result-containerrrr');
          resultContainerrr.innerHTML = `
            <div class="order-result" style="background: #fff; padding: 10px; border-radius: 4px; width: 90%; border: 1px solid #f3f3f3; margin-bottom: 10px;">
              <p><strong>Orden de Pago</strong></p>
              <p><strong>ID de la Orden:</strong> ${orderId}</p>
              <p><strong>Fecha de Recepción:</strong> ${create_date}</p>
              <p><strong>Fecha de Entrega:</strong> ${deadline}</p>
              <p><strong>Total de Pago:</strong> ${tot_pay}</p>
              <p><strong>Detalles Adicionales:</strong> ${addit_details}</p>
              <p><strong>ID Cliente:</strong> ${id_customer}</p>
              <p><strong>ID Equipo:</strong> ${id_equip}</p>
              <p><strong>ID Empleado:</strong> ${idEmployee}</p>
            </div>
          `;
        })
        .catch(error => {
          console.error("Error al guardar la orden:", error);
          orderMensajeDiv.innerText = "Error al guardar la orden, revise los ID";
        });
      
    });
  }

  // ===============================
  // Formulario de Pago (Registro de Pago)
  // ===============================
  document.querySelector('.formPago form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    
    // Obtener los valores de los campos del formulario
    const fechaPago = document.getElementById('fechaPago').value;
    const saldo = parseFloat(document.getElementById('saldo').value);
    const abono = parseFloat(document.getElementById('abono').value);
    const idOrder = document.getElementById('idOrder').value;
    
    // Validación simple
    if (!fechaPago || isNaN(saldo) || isNaN(abono) || !idOrder) {
      document.getElementById('TEXTT').textContent = 'Por favor, rellene todos los campos correctamente.';
      document.getElementById('TEXTT').style.color = 'red';
      return;
    }
    
    // Crear el objeto JSON con los datos del pago
    const paymentData = {
      date_pay: fechaPago,
      money_pay: saldo,
      money_b_pay: abono,
      order_id: parseInt(idOrder)
    };
    
    // Enviar los datos usando fetch
    fetch('http://localhost:8084/api/payments/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al guardar el pago');
      }
      return response.json();
    })
    .then(data => {
      // Se supone que la respuesta contiene el id del pago guardado
      const paymentId = data.id_pay;
      console.log("Pago guardado:", data);
      
      // Mostrar mensaje de éxito
      document.getElementById('TEXTT').textContent = 'Pago guardado exitosamente.';
      document.getElementById('TEXTT').style.color = 'green';
      
      // Ocultar el contenedor del formulario de pago
      document.querySelector('.formPago').style.display = 'none';
      
      // Mostrar el contenedor final
      const contenedorFinal = document.querySelector('.contenedor-final');
      contenedorFinal.style.display = 'block';
      
      // Consultar los datos del pago recién guardado usando la URL correcta
      fetch(`http://localhost:8084/api/payments/find/${paymentId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al obtener los datos del pago');
          }
          return response.json();
        })
        .then(paymentData => {
          // Construir el contenido HTML con los datos obtenidos
          contenedorFinal.innerHTML = `
            <div class="payment-result" style="background: #fff; padding: 10px; border-radius: 4px; width: 90%; border: 1px solid #f3f3f3; margin-bottom: 10px;">
              <p><strong>Pago Guardado</strong></p>
              <p><strong>ID del Pago:</strong> ${paymentData.id_pay}</p>
              <p><strong>Fecha del Pago:</strong> ${paymentData.date_pay}</p>
              <p><strong>Saldo:</strong> ${paymentData.money_pay}</p>
              <p><strong>Abono:</strong> ${paymentData.money_b_pay}</p>
              <p><strong>ID Orden:</strong> ${paymentData.order_id}</p>
              <p><strong>Total de Pago de la Orden:</strong> ${paymentData.order_tot_pay}</p>
            </div>
          `;
        })
        .catch(error => {
          console.error("Error al obtener los datos del pago:", error);
          document.getElementById('TEXTT').textContent = 'Hubo un error al obtener los datos del pago.';
          document.getElementById('TEXTT').style.color = 'red';
        });
    })
    .catch(error => {
      document.getElementById('TEXTT').textContent = 'Hubo un error al guardar el pago: ' + error.message;
      document.getElementById('TEXTT').style.color = 'red';
    });
  });
  
});
