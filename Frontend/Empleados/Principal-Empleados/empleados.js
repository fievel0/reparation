// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  const contenedorDatos = document.getElementById('contenedorDatos');
  const paginationContainer = document.getElementById('pagination');
  const mostrarOpciones = document.getElementById('mostrarOpciones'); // Elemento select para elegir la vista
  const itemsPerPage = 12;
  let currentPage = 1;
  let employees = [];

  // Realiza la solicitud GET usando Fetch de forma automática
  fetch('http://localhost:8084/api/employee/findAll')
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la solicitud: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      employees = data;
      // Según la opción seleccionada, se muestra la vista correspondiente
      if (mostrarOpciones && mostrarOpciones.value === 'todos') {
        showAllEmployees();
      } else {
        currentPage = 1; // Se reinicia la página
        showPaginatedEmployees();
      }
    })
    .catch(error => {
      console.error('Hubo un problema con la solicitud Fetch:', error);
    });

  // Escucha cambios en el select para elegir la vista
  if (mostrarOpciones) {
    mostrarOpciones.addEventListener('change', (event) => {
      if (event.target.value === 'todos') {
        showAllEmployees();
      } else {
        currentPage = 1;
        showPaginatedEmployees();
      }
    });
  }

  // Función para mostrar todos los empleados
  function showAllEmployees() {
    contenedorDatos.innerHTML = '';
    employees.forEach(employee => {
      const employeeDiv = document.createElement('div');
      employeeDiv.classList.add('customer'); // No se cambia la clase para mantener el estilo
      employeeDiv.innerHTML = `
        <p><strong>ID:</strong> ${employee.idEmployee}</p>
        <p><strong>Nombre:</strong> ${employee.nameEmployee}</p>
        <p><strong>Cargo:</strong> ${employee.positionEmployee}</p>
        <p><strong>Cédula:</strong> ${employee.cedEmployee}</p>
        <p><strong>Dirección:</strong> ${employee.dirEmployee}</p>
        <p><strong>Teléfono:</strong> ${employee.telEmpployee}</p>
      `;
      contenedorDatos.appendChild(employeeDiv);
    });
    // Limpia los controles de paginación
    paginationContainer.innerHTML = '';
  }

  // Función para mostrar empleados por páginas
  function showPaginatedEmployees() {
    renderPage();
    renderPaginationControls();
  }

  // Función para mostrar los empleados de la página actual
  function renderPage() {
    contenedorDatos.innerHTML = '';
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageEmployees = employees.slice(startIndex, endIndex);

    pageEmployees.forEach(employee => {
      const employeeDiv = document.createElement('div');
      employeeDiv.classList.add('customer'); // No se cambia la clase para mantener el estilo
      employeeDiv.innerHTML = `
        <p><strong>ID:</strong> ${employee.idEmployee}</p>
        <p><strong>Nombre:</strong> ${employee.nameEmployee}</p>
        <p><strong>Cargo:</strong> ${employee.positionEmployee}</p>
        <p><strong>Cédula:</strong> ${employee.cedEmployee}</p>
        <p><strong>Dirección:</strong> ${employee.dirEmployee}</p>
        <p><strong>Teléfono:</strong> ${employee.telEmpployee}</p>
      `;
      contenedorDatos.appendChild(employeeDiv);
    });
  }

  // Función para generar los controles de paginación
  function renderPaginationControls() {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(employees.length / itemsPerPage);
    if (totalPages <= 1) return;

    // Botón "Anterior" (solo si no es la primera página)
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
