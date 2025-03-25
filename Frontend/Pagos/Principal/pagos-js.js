// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  const contenedorDatos = document.getElementById('contenedorDatos');
  const paginationContainer = document.getElementById('pagination');
  const mostrarOpciones = document.getElementById('mostrarOpciones'); // Elemento select para elegir la vista
  const itemsPerPage = 12;
  let currentPage = 1;
  let payments = [];

  // Realiza la solicitud GET usando Fetch de forma automática
  fetch('http://localhost:8084/api/payments/findAll')
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la solicitud: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      payments = data;
      if (mostrarOpciones && mostrarOpciones.value === 'todos') {
        showAllPayments();
      } else {
        currentPage = 1;
        showPaginatedPayments();
      }
    })
    .catch(error => {
      console.error('Hubo un problema con la solicitud Fetch:', error);
    });

  // Escucha cambios en el select para elegir la vista
  if (mostrarOpciones) {
    mostrarOpciones.addEventListener('change', (event) => {
      if (event.target.value === 'todos') {
        showAllPayments();
      } else {
        currentPage = 1;
        showPaginatedPayments();
      }
    });
  }

  // Función para mostrar todos los pagos
  function showAllPayments() {
    contenedorDatos.innerHTML = '';
    payments.forEach(payment => {
      const paymentDiv = document.createElement('div');
      // Se utiliza la clase 'customer' para mantener el mismo fondo y estilo
      paymentDiv.classList.add('customer');
      paymentDiv.innerHTML = `
        <p><strong>Fecha de Pago:</strong> ${payment.date_pay}</p>
        <p><strong>Monto Pagado:</strong> ${payment.money_pay}</p>
        <p><strong>Monto Pendiente:</strong> ${payment.money_b_pay}</p>
        <p><strong>ID Orden:</strong> ${payment.order_id}</p>
      `;
      contenedorDatos.appendChild(paymentDiv);
    });
    paginationContainer.innerHTML = '';
  }

  // Función para mostrar pagos por páginas
  function showPaginatedPayments() {
    renderPage();
    renderPaginationControls();
  }

  // Función para mostrar los pagos de la página actual
  function renderPage() {
    contenedorDatos.innerHTML = '';
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pagePayments = payments.slice(startIndex, endIndex);

    pagePayments.forEach(payment => {
      const paymentDiv = document.createElement('div');
      // Se utiliza la clase 'customer' para mantener el estilo del fondo
      paymentDiv.classList.add('customer');
      paymentDiv.innerHTML = `
        <p><strong>ID Pago:</strong> ${payment.id_pay}</p>
        <p><strong>Fecha de Pago:</strong> ${payment.date_pay}</p>
        <p><strong>Monto Pagado:</strong> ${payment.money_pay}</p>
        <p><strong>Monto Pendiente:</strong> ${payment.money_b_pay}</p>
        <p><strong>ID Orden:</strong> ${payment.order_id}</p>
      `;
      contenedorDatos.appendChild(paymentDiv);
    });
  }

  // Función para generar los controles de paginación
  function renderPaginationControls() {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(payments.length / itemsPerPage);
    if (totalPages <= 1) return;

    // Botón "Anterior"
    if (currentPage > 1) {
      const prevButton = document.createElement('button');
      prevButton.textContent = 'Anterior';
      prevButton.addEventListener('click', () => {
        currentPage--;
        renderPage();
        renderPaginationControls();
      });
      paginationContainer.appendChild(prevButton);
    }

    // Determina el rango de botones numéricos a mostrar (máximo 3)
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

    // Crea los botones de número de página
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
      });
      paginationContainer.appendChild(nextButton);
    }
  }
});
