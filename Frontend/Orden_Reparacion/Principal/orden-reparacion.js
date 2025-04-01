// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  const contenedorDatos = document.getElementById('contenedorDatos');
  const paginationContainer = document.getElementById('pagination');
  const mostrarOpciones = document.getElementById('mostrarOpciones'); // Elemento select para elegir la vista
  const itemsPerPage = 12;
  let currentPage = 1;
  let orders = [];

  // Realiza la solicitud GET a la API de órdenes de reparación
  fetch('http://localhost:8084/api/ord_rep/findAll')
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la solicitud: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      orders = data;
      // Según la opción seleccionada se muestra la vista completa o paginada
      if (mostrarOpciones && mostrarOpciones.value === 'todos') {
        showAllOrders();
      } else {
        currentPage = 1;
        showPaginatedOrders();
      }
    })
    .catch(error => {
      console.error('Hubo un problema con la solicitud Fetch:', error);
    });

  // Escucha cambios en el select para elegir la vista
  if (mostrarOpciones) {
    mostrarOpciones.addEventListener('change', (event) => {
      if (event.target.value === 'todos') {
        showAllOrders();
      } else {
        currentPage = 1;
        showPaginatedOrders();
      }
    });
  }

  // Función para mostrar todas las órdenes sin paginación
  function showAllOrders() {
    contenedorDatos.innerHTML = '';
    orders.forEach(order => {
      const orderDiv = document.createElement('div');
      orderDiv.classList.add('customer');
      // Se obtiene el primer pago (si existe)
      const payment = order.payments && order.payments.length > 0 ? order.payments[0] : {};
      orderDiv.innerHTML = `
        <p><strong>ID Orden: </strong>${order.id_order}</p>
        <p><strong>Fecha de Recepción: </strong>${order.create_date}</p>
        <p><strong>Fecha de Entrega: </strong>${order.deadline}</p>
        <p><strong>Total de pago: </strong>${order.tot_pay}</p>
        <p><strong>Detalles Adicionales: </strong>${order.addit_details}</p>
        <p><strong>Cliente: </strong> ID ${order.customer.id_customer} |  Nombre:  ${order.customer.name} </p>
        <p><strong>Equipo: </strong> ID ${order.equipment.id_equip} |  Modelo:  ${order.equipment.model_equip} |  Estado: ${order.equipment.on_off_equip ? 'Encendido' : 'Apagado'}</p>
        <p><strong>Pago:</strong> ID ${payment.id_pay} | Fecha del pago: ${payment.date_pay}</p>
        <p><strong>Empleado: </strong> ID ${order.employee.idEmployee} |  Nombre:  ${order.employee.nameEmployee} </p>
      `;
      contenedorDatos.appendChild(orderDiv);
    });
    // Limpia los controles de paginación
    paginationContainer.innerHTML = '';
  }

  // Función para mostrar las órdenes con paginación
  function showPaginatedOrders() {
    renderPage();
    renderPaginationControls();
  }

  // Función para mostrar la página actual de órdenes
  function renderPage() {
    contenedorDatos.innerHTML = '';
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageOrders = orders.slice(startIndex, endIndex);

    pageOrders.forEach(order => {
      const orderDiv = document.createElement('div');
      orderDiv.classList.add('customer');
      const payment = order.payments && order.payments.length > 0 ? order.payments[0] : {};
      orderDiv.innerHTML = `
        <p><strong>ID Orden: </strong>${order.id_order}</p>
        <p><strong>Fecha de Recepción: </strong>${order.create_date}</p>
        <p><strong>Fecha de Entrega: </strong>${order.deadline}</p>
        <p><strong>Total de pago: </strong>${order.tot_pay}</p>
        <p><strong>Detalles Adicionales: </strong>${order.addit_details}</p>
        <p><strong>Cliente: </strong> ID ${order.customer.id_customer} |  Nombre:  ${order.customer.name} </p>
        <p><strong>Equipo: </strong> ID ${order.equipment.id_equip} |  Modelo:  ${order.equipment.model_equip} |  Estado: ${order.equipment.on_off_equip ? 'Encendido' : 'Apagado'}</p>
        <p><strong>Empleado: </strong> ID ${order.employee.idEmployee} |  Nombre:  ${order.employee.nameEmployee} </p>
      `;
      contenedorDatos.appendChild(orderDiv);
    });
  }

  // Función para generar los controles de paginación
  function renderPaginationControls() {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(orders.length / itemsPerPage);
    if (totalPages <= 1) return;

    // Botón "Anterior"
    if (currentPage > 1) {
      const prevButton = document.createElement('button');
      prevButton.textContent = 'Anterior';
      prevButton.addEventListener('click', () => {
        currentPage--;
        renderPage();
        renderPaginationControls();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      paginationContainer.appendChild(prevButton);
    }

    // Rango de botones numéricos (máximo 3)
    let startPage, endPage;
    if (totalPages <= 3) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage === 1) {
        startPage = 1;
        endPage = 3;
      } else if (currentPage === totalPages) {
        startPage = totalPages - 2;
        endPage = totalPages;
      } else {
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      const pageButton = document.createElement('button');
      pageButton.textContent = i;
      if (i === currentPage) {
        pageButton.disabled = true;
      }
      pageButton.addEventListener('click', () => {
        currentPage = i;
        renderPage();
        renderPaginationControls();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      paginationContainer.appendChild(pageButton);
    }

    // Botón "Siguiente"
    if (currentPage < totalPages) {
      const nextButton = document.createElement('button');
      nextButton.textContent = 'Siguiente';
      nextButton.addEventListener('click', () => {
        currentPage++;
        renderPage();
        renderPaginationControls();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      paginationContainer.appendChild(nextButton);
    }
  }
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
