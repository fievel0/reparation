document.addEventListener('DOMContentLoaded', function() { 
  
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
  let selectedOrden = null;

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
      <div class="customer" style="padding: 10px; border-radius: 4px; width: 90%; border: 1px solid #f3f3f3;">
        <p><strong>Cliente</strong></p>
        <p><strong>ID:</strong> <input type="text" id="editId" value="${customer.id_customer || ''}"readonly></p>
        <p><strong>Nombre:</strong> <input type="text" id="editName" value="${customer.name || ''}"readonly></p>
        <p><strong>Identificación:</strong> <input type="text" id="editCard" value="${customer.cardIdentifi || ''}"readonly></p>
        <p><strong>Teléfono:</strong> <input type="text" id="editPhone" value="${customer.phone || ''}"readonly></p>
        <p><strong>Correo:</strong> <input type="text" id="editMail" value="${customer.mail || ''}"readonly></p>
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
        <p><strong>Nombre:</strong> <input type="text" id="editNameEmployee" value="${employee.nameEmployee || ''}"readonly></p>
        <p><strong>Cargo:</strong> <input type="text" id="editPositionEmployee" value="${employee.positionEmployee || ''}"readonly></p>
        <p><strong>Cédula:</strong> <input type="text" id="editCedulaEmployee" value="${employee.cedEmployee || ''}"readonly></p>
        <p><strong>Dirección:</strong> <input type="text" id="editDirEmployee" value="${employee.dirEmployee || ''}"readonly></p>
        <p><strong>Teléfono:</strong> <input type="text" id="editPhoneEmployee" value="${employee.telEmpployee || ''}"readonly></p>
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
        
          // Obtén los demás valores del formulario (o desde data, según corresponda)
          const create_date = document.getElementById("fechaRecepcion").value;
          const deadline = document.getElementById("fechaEntrega").value;
          const tot_pay = parseFloat(document.getElementById("totalPago").value);
          const addit_details = document.getElementById("detalles").value;
          const id_customer = parseInt(document.getElementById("idCliente").value);
          const id_equip = parseInt(document.getElementById("idEquipo").value);
          const idEmployee = parseInt(document.getElementById("idEmpleado").value);
        
          console.log("Orden guardada:", data);
          orderMensajeDiv.innerText = "Orden guardada correctamente";
        
          // Asignar todos los valores a selectedOrden
          selectedOrden = { 
            orderId, 
            create_date, 
            deadline, 
            tot_pay, 
            addit_details,
            id_customer,
            id_equip,
            idEmployee
          };
        
          // Autocompletar el ID de la orden en el formulario de pago
          const idOrderInput = document.getElementById("idOrder");
          if (idOrderInput) idOrderInput.value = orderId;
        
          // Ocultar el contenedor de Orden de Pago y mostrar el de Pago
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
  // Declara la variable global para almacenar los datos del pago
  let selectedPayment = null;
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
      return fetch(`http://localhost:8084/api/payments/find/${paymentId}`);
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al obtener los datos del pago');
      }
      return response.json();
    })
    .then(paymentData => {
      // Almacenar todos los valores del pago en la variable global selectedPayment
      selectedPayment = {
        id_pay: paymentData.id_pay,
        date_pay: paymentData.date_pay,
        money_pay: paymentData.money_pay,
        money_b_pay: paymentData.money_b_pay,
        order_id: paymentData.order_id,
        order_tot_pay: paymentData.order_tot_pay
      };
  
      // Actualizar el contenedor final con la información del pago
      const contenedorFinal = document.querySelector('.contenedor-final');
      contenedorFinal.innerHTML = `
        <div class="payment-result" style="background: #fff; padding: 10px; border-radius: 4px; width: 90%; border: 1px solid #f3f3f3; margin-bottom: 10px;">
          <p><strong>Pago Guardado</strong></p>
          <p><strong>ID del Pago:</strong> ${selectedPayment.id_pay}</p>
          <p><strong>Fecha del Pago:</strong> ${selectedPayment.date_pay}</p>
          <p><strong>Saldo:</strong> ${selectedPayment.money_pay}</p>
          <p><strong>Abono:</strong> ${selectedPayment.money_b_pay}</p>
          <p><strong>ID Orden:</strong> ${selectedPayment.order_id}</p>
          <p><strong>Total de Pago de la Orden:</strong> ${selectedPayment.order_tot_pay}</p>
        </div>
      `;
      
      // Mostrar botones o elementos adicionales, por ejemplo:
      document.getElementById('generarDocBtn').style.display = 'block';
      document.getElementById('Logo_Doc').style.display = 'block';
    })
    .catch(error => {
      console.error("Error:", error);
      document.getElementById('TEXTT').textContent = 'Hubo un error: ' + error.message;
      document.getElementById('TEXTT').style.color = 'red';
    });
  });
  function generarWord() {
    // Usar variables globales para rellenar el contenido
    const fechaOrden = new Date().toLocaleDateString();
    const idCliente = selectedCustomer ? selectedCustomer.id_customer : "__________________";
    const nombreCliente = selectedCustomer ? selectedCustomer.name : "__________________";
    const telefono = selectedCustomer ? selectedCustomer.phone : "__________________";
    const identificacion = selectedCustomer ? selectedCustomer.cardIdentifi : "__________________";
    const mail = selectedCustomer ? selectedCustomer.mail : "__________________";
    
    //Variables para Empleado
    const idEmpleado = selectedEmployee ? selectedEmployee.idEmployee : "__________________";
    const nombreEmpleado = selectedEmployee ? selectedEmployee.nameEmployee : "__________________";
    const positionEmployee = selectedEmployee ? selectedEmployee.positionEmployee : "__________________";
    const cedEmployee  = selectedEmployee ? selectedEmployee. cedEmployee: "__________________";
    const telEmpployee  = selectedEmployee ? selectedEmployee.telEmpployee : "__________________";
    const dirEmpployee  = selectedEmployee ? selectedEmployee.dirEmployee : "__________________";


    // Variables para el equipo
    //Variables fuera de la tabla
    const IDEquipo = selectedEquipment ? selectedEquipment.id_equip : "__________________";
    const modeloEquipo = selectedEquipment ? selectedEquipment.model_equip : "__________________";
    const MarcaEquipo = selectedEquipment ? selectedEquipment.brand_equip : "__________________";
    const detalleEquipo = selectedEquipment ? selectedEquipment.detail_phy_equip : "__________________";
    const estadoEquipo = selectedEquipment ? selectedEquipment.state_equip : "__________________";
    //Variables dentro de la tabla sobre el equipo
    const encendido = selectedEquipment ? (selectedEquipment.on_off_equip ? "Encendido" : "Apagado") : "__________________";
    const color = selectedEquipment ? selectedEquipment.color_equip : "__________________";
    const contraseña = selectedEquipment ? selectedEquipment.pass_equip : "__________________";
    const antiguedad = selectedEquipment ? selectedEquipment.anti_equip : "__________________";
    const accesorios = selectedEquipment ? selectedEquipment.accessor_equip : "__________________";
    const Reporte = selectedEquipment ? selectedEquipment.reported_equip : "__________________";
    const temperatura = selectedEquipment ? selectedEquipment.temp_equip : "__________________";
    const daño_causado = selectedEquipment ? selectedEquipment.cau_dam_equip : "__________________";
    const condicion = selectedEquipment ? selectedEquipment.condEquip : "__________________";

    //Variables para la orden de pago 
    const idOrden = selectedOrden ? selectedOrden.orderId : "Valor por defecto";
    const fechaRecepcion = selectedOrden ? selectedOrden.create_date : "Valor por defecto";
    const fechaEntrega = selectedOrden ? selectedOrden.deadline : "Valor por defecto";
    const totalPagoo = selectedOrden ? selectedOrden.tot_pay : "Valor por defecto";
    const DetallesAdicionales = selectedOrden ? selectedOrden.addit_details : "Valor por defecto";

    //Variables para el pago
    const idPago = selectedPayment ? selectedPayment.id_pay : "Valor por defecto";
    const fechaDelPago = selectedPayment ? selectedPayment.date_pay : "Valor por defecto";
    const saldoDelPago = selectedPayment ? selectedPayment.money_pay : "Valor por defecto";
    const abonoDelPago = selectedPayment ? selectedPayment.money_b_pay : "Valor por defecto";
    const TotaldePagooo = Number(selectedPayment.order_tot_pay) - Number(selectedPayment.money_b_pay);



 


    
    
    // Contenido HTML del Word con estilos y la información combinada
  // Contenido HTML del Word con estilos y la información combinada
  const contenido = `
  <html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word" 
      xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta charset="utf-8">
    <style>
      @page { margin: 10mm; }
      body { 
        font-family: Arial, sans-serif; 
        padding: 10px; 
        font-size: 9px;
        line-height: 1.2;
      }
      hr {
        border: none;
        border-top: 1px solid #000;
        margin: 5px 0;
      }
      /* Reducimos ligeramente el margen superior para datos en la misma fila */
      .datos-row {
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
      .datos-col {
        width: 48%;
      }
      table {
        border-collapse: collapse;
        margin-top: 5px;
        font-size: 10px; /* Tamaño de letra aumentado */
        width: 100%;     /* Ocupa el 100% del ancho */
      }
      th, td {
        border: 1px solid black;
        padding: 3px;
        text-align: left;
      }
      th {
        background-color: #f2f2f2;
      }
      .separador {
        margin-top: 5px; /* Se reduce el espacio superior para unir secciones */
      }
      .info-final {
        margin-top: 10px;
        width: 100%;
        display: table;
      }
      .info-final > div {
        display: table-cell;
        vertical-align: top;
      }
      .info-final .izq { text-align: left; }
      .info-final .der { text-align: right; margin-top: -5px; }
      .alerta {
        background-color: #d3d3d3;
        padding: 5px;
        margin-top: 5px;
        font-size: 8px;
      }
      .tablas-lado {
        display: flex;
        justify-content: space-between;
        gap: 10px;
      }
      .tabla-pequena {
        flex: 1;
        max-width: 48%;
      }
      .tabla-pequena table {
        width: auto;
      }
      .tabla-pequena p {
        text-align: center;
        margin: 0 0 5px;
      }
      .encabezadoo{
        text-align: center;
        margin-bottom: 5px;
      }
      /* Se agrega una clase para “ID Equipo” y se reduce el margen superior */
      .info-equipo-inicial {
        margin-top: -5px;
      }
      /* Para la cabecera de la tabla “Información del Equipo” */
      .titulo-info-equipo {
        margin-bottom: 2px;
        font-weight: bold;
      }
      /* Para subir el bloque de Observaciones junto al título */
      .observaciones {
        margin-top: 0;
      }
      /* Estilo para el logo */
      .Logo {
        height: 50px; /* Ajusta la altura según lo pequeño que necesites */
        width: auto;
      }
      /* Contenedor del logo y encabezado */
      .header-container {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
      }
      .header-text {
        flex: 1;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="header-container">
      <div class="logo-container">
        <img class="Logo" src="/Imagenes/logoo.png" alt="LOGO-INT">
      </div>
      <div class="header-text">
        <h3 style="margin: 2px;">Orden de Trabajo</h3>
        <h4 style="margin: 2px;">INT-SOLUTIONS</h4>
        <h6 style="margin: 2px;">PIO XII Y AMALIA URÍGÜEN, DIAGONAL A LA ESCUELA DE MONJAS ELENA ENRÍQUEZ</h6>
      </div>
    </div>
    <hr>
  
    <div class="info-equipo-inicial">
      ID Orden de Pago: ${idOrden} <br>
      FECHA: ${fechaOrden}
    </div>
    
    <p>
      <strong>ID Equipo:</strong> ${IDEquipo}  <br>
      <strong>Modelo:</strong> ${modeloEquipo}  <br>
      <strong>Marca:</strong> ${MarcaEquipo}  <br>
      <strong>Detalle:</strong> ${detalleEquipo}  <br>
      <strong>Estado:</strong> ${estadoEquipo}  
    </p>
  
    <!-- Datos del Cliente y Empleado en la misma fila -->
    <div class="datos-row">
      <div class="datos-col">
        <strong>Datos Cliente</strong> <br>
        <strong>Cliente:</strong> <strong>ID:</strong> ${idCliente} | <strong>Nombre:</strong> ${nombreCliente} <br>
        <strong>Identificación:</strong> ${identificacion}<br>
        <strong>Teléfono:</strong> ${telefono}<br>
        <strong>Correo:</strong> ${mail}<br>
      </div>
      <div class="datos-col">
        <strong>Datos Empleado</strong><br>
        <strong>Empleado:</strong> <strong>ID:</strong> ${idEmpleado} | <strong>Nombre:</strong> ${nombreEmpleado} <br>
        <strong>Teléfono:</strong> ${telEmpployee}<br>
      </div>
    </div>
  
    <!-- Sección de Información del Equipo con título más cerca de la tabla -->
    <div class="titulo-info-equipo">
      <p class="titulo-info-equipo">Información del Equipo</p>
      <table>
        <tr>
          <td><strong>Encendido/Apagado</strong></td>
          <td>${encendido}</td>
        </tr>
        <tr>
          <td><strong>Color</strong></td>
          <td>${color}</td>
        </tr>
        <tr>
          <td><strong>Contraseña</strong></td>
          <td>${contraseña}</td>
        </tr>
        <tr>
          <td><strong>Antigüedad</strong></td>
          <td>${antiguedad}</td>
        </tr>
        <tr>
          <td><strong>Accesorios</strong></td>
          <td>${accesorios}</td>
        </tr>
        <tr>
          <td><strong>Reporte</strong></td>
          <td>${Reporte}</td>
        </tr>
        <tr>
          <td><strong>Temperatura</strong></td>
          <td>${temperatura}</td>
        </tr>
        <tr>
          <td><strong>Daño</strong></td>
          <td>${daño_causado}</td>
        </tr>
        <tr>
          <td><strong>Condición</strong></td>
          <td>${condicion}</td>
        </tr>
      </table>
    </div>
    <br> 
  
    <strong>Orden de Pago</strong> <br>
    <strong>Fecha de Recepción: </strong>${fechaRecepcion}  <br>
    <strong>Fecha de Entrega: </strong>${fechaEntrega}  <br>
    <strong>Detalles Adicionales: </strong>${DetallesAdicionales}  <br>
    <strong>Total de Pago: </strong>${totalPagoo}  <br>
    <br>
  
    <strong>Información de Pago</strong> <br>
    <strong>Fecha del Pago: </strong>${fechaDelPago}  <br>
    <strong>Saldo del Pago: </strong>${saldoDelPago}  <br>
    <strong>Abono del Pago: </strong>${abonoDelPago}  <br>
    <strong>Total del Pago: </strong>${TotaldePagooo}  <br>
    <br>
  
    <div class="seccion-info">
      <p>
        <strong>Fabián Paucar</strong><br>
        TÉCNICO<br>
        Telf: 0984523160
      </p>
    </div>
  
    <div class="seccion-info">
      <p>
        <strong>Cliente</strong><br>
        CI: ${identificacion}
      </p>
    </div>
  
    <!-- Sección de Observaciones con ajuste para el texto "No se da garantía" -->
    <div class="separador observaciones">
      
      <p>
      <strong>OBSERVACIONES:</strong> <br>
        No se da garantía de ningún tipo cuando se reciben los equipos apagados.<br>
        Todo equipo se toma con riesgo, puesto que por una pieza reparada se puede dañar otra por la manipulación o por el daño obtenido del uso.<br>
        No hay garantía de displays. Es responsabilidad del cliente comprobar la mercadería, puesto que una vez salida del establecimiento, el cliente puede ocasionar algún daño.<br>
        El establecimiento no se responsabiliza por equipos reportados o robados. En caso de que vengan las autoridades y sean confiscados, NO HAY GARANTÍA DE NINGÚN TIPO EN EQUIPOS MOJADOS, TORCIDOS O FISURADOS. Cualquier dispositivo con estas características será recibido bajo el riesgo del cliente.<br>
        Al firmar este documento, el cliente acepta todas las condiciones y observaciones que se estipulan en el mismo.<br>
        Se cobrará 5 dólares por la revisión, sirva o no el dispositivo.
      </p>
      <div class="alerta">
        PASADO 3 MESES DESDE LA RECEPCIÓN DEL EQUIPO, SI NO ES RETIRADO, SE PROCEDERÁ A REMATAR EL DISPOSITIVO SIN OPCIÓN A RECLAMOS.
      </div>
    </div>
  </body>
</html>

  `;
  


    // Generación del archivo Word
    const blob = new Blob([contenido], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "OrdenDeTrabajo.doc";
    a.click();
    URL.revokeObjectURL(url);


  }
  
  // Asignar el evento al botón (asegúrate de que el elemento con id "generarDocBtn" exista)
  document.getElementById("generarDocBtn").addEventListener("click", generarWord);
  
});
