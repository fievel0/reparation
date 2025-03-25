// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    const contenedorDatos = document.getElementById('contenedorDatos');
    const paginationContainer = document.getElementById('pagination');
    const mostrarOpciones = document.getElementById('mostrarOpciones'); // Elemento select para elegir la vista
    const itemsPerPage = 12;
    let currentPage = 1;
    let customers = [];
  
    // Realiza la solicitud GET usando Fetch de forma automática
    fetch('http://localhost:8084/api/customer/findAll')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la solicitud: ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        customers = data;
        // Según la opción seleccionada, se muestra la vista correspondiente
        if (mostrarOpciones && mostrarOpciones.value === 'todos') {
          showAllCustomers();
        } else {
          currentPage = 1; // Se reinicia la página
          showPaginatedCustomers();
        }
      })
      .catch(error => {
        console.error('Hubo un problema con la solicitud Fetch:', error);
      });
  
    // Escucha cambios en el select para elegir la vista
    if (mostrarOpciones) {
      mostrarOpciones.addEventListener('change', (event) => {
        if (event.target.value === 'todos') {
          showAllCustomers();
        } else {
          currentPage = 1;
          showPaginatedCustomers();
        }
      });
    }
  
    // Función para mostrar todos los clientes
    function showAllCustomers() {
      contenedorDatos.innerHTML = '';
      customers.forEach(customer => {
        const customerDiv = document.createElement('div');
        customerDiv.classList.add('customer');
        customerDiv.innerHTML = `
          <p><strong>ID:</strong> ${customer.id_customer}</p>
          <p><strong>Nombre:</strong> ${customer.name}</p>
          <p><strong>Identificación:</strong> ${customer.cardIdentifi}</p>
          <p><strong>Teléfono:</strong> ${customer.phone}</p>
          <p><strong>Correo:</strong> ${customer.mail}</p>
        `;
        contenedorDatos.appendChild(customerDiv);
      });
      // Limpia los controles de paginación
      paginationContainer.innerHTML = '';
    }
  
    // Función para mostrar clientes por páginas
    function showPaginatedCustomers() {
      renderPage();
      renderPaginationControls();
    }
  
    // Función para mostrar los clientes de la página actual
    function renderPage() {
      contenedorDatos.innerHTML = '';
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const pageCustomers = customers.slice(startIndex, endIndex);
  
      pageCustomers.forEach(customer => {
        const customerDiv = document.createElement('div');
        customerDiv.classList.add('customer');
        customerDiv.innerHTML = `
          <p><strong>ID:</strong> ${customer.id_customer}</p>
          <p><strong>Nombre:</strong> ${customer.name}</p>
          <p><strong>Identificación:</strong> ${customer.cardIdentifi}</p>
          <p><strong>Teléfono:</strong> ${customer.phone}</p>
          <p><strong>Correo:</strong> ${customer.mail}</p>
        `;
        contenedorDatos.appendChild(customerDiv);
      });
    }
  
    // Función para generar los controles de paginación
    function renderPaginationControls() {
      paginationContainer.innerHTML = '';
      const totalPages = Math.ceil(customers.length / itemsPerPage);
      if (totalPages <= 1) return;
  
      // Botón "Anterior" (solo si no es la primera página)
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
          pageButton.disabled = true; // Indica la página actual
        }
        pageButton.addEventListener('click', () => {
          currentPage = i;
          renderPage();
          renderPaginationControls();
        });
        paginationContainer.appendChild(pageButton);
      }
  
      // Botón "Siguiente" (solo si no es la última página)
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
  