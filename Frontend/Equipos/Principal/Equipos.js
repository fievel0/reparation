// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  const contenedorDatos = document.getElementById('contenedorDatos');
  const paginationContainer = document.getElementById('pagination');
  const mostrarOpciones = document.getElementById('mostrarOpciones'); // Elemento select para elegir la vista
  const itemsPerPage = 12;
  let currentPage = 1;
  let equipments = [];

  // Realiza la solicitud GET usando Fetch de forma automática
  fetch('http://localhost:8084/api/equipment/findAll')
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la solicitud: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      equipments = data;
      // Según la opción seleccionada, se muestra la vista correspondiente
      if (mostrarOpciones && mostrarOpciones.value === 'todos') {
        showAllEquipments();
      } else {
        currentPage = 1; // Se reinicia la página
        showPaginatedEquipments();
      }
    })
    .catch(error => {
      console.error('Hubo un problema con la solicitud Fetch:', error);
    });

  // Escucha cambios en el select para elegir la vista
  if (mostrarOpciones) {
    mostrarOpciones.addEventListener('change', (event) => {
      if (event.target.value === 'todos') {
        showAllEquipments();
      } else {
        currentPage = 1;
        showPaginatedEquipments();
      }
    });
  }

  // Función para mostrar todos los equipos
  function showAllEquipments() {
    contenedorDatos.innerHTML = '';
    equipments.forEach(equip => {
      const equipDiv = document.createElement('div');
      // Usamos la clase "customer" para aplicar el mismo estilo (sombra, etc.)
      equipDiv.classList.add('customer');
      equipDiv.innerHTML = `
        <p><strong>ID Equipo:</strong> ${equip.id_equip}</p>
        <p><strong>Modelo:</strong> ${equip.model_equip}</p>
        <p><strong>Marca:</strong> ${equip.brand_equip}</p>
        <p><strong>Color:</strong> ${equip.color_equip}</p>
        <p><strong>Estado:</strong> ${equip.state_equip}</p>
        <p><strong>Contraseña:</strong> ${equip.pass_equip}</p>
        <p><strong>Antigüedad:</strong> ${equip.anti_equip}</p>
        <p><strong>Accesorio:</strong> ${equip.accessor_equip}</p>
        <p><strong>Reportado:</strong> ${equip.reported_equip}</p>
        <p><strong>Detalle Físico:</strong> ${equip.detail_phy_equip}</p>
        <p><strong>Temperatura:</strong> ${equip.temp_equip}</p>
        <p><strong>Encendido:</strong> ${equip.on_off_equip}</p>
        <p><strong>Causa del daño:</strong> ${equip.cau_dam_equip}</p>
        <p><strong>Condición:</strong> ${equip.condEquip}</p>
        <p><strong>ID Cliente:</strong> ${equip.id_customer}</p>
        <p><strong>Nombre Cliente:</strong> ${equip.name}</p>
      `;
      contenedorDatos.appendChild(equipDiv);
    });
    // Limpia los controles de paginación
    paginationContainer.innerHTML = '';
  }

  // Función para mostrar equipos por páginas
  function showPaginatedEquipments() {
    renderPage();
    renderPaginationControls();
  }

  // Función para mostrar los equipos de la página actual
  function renderPage() {
    contenedorDatos.innerHTML = '';
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageEquipments = equipments.slice(startIndex, endIndex);

    pageEquipments.forEach(equip => {
      const equipDiv = document.createElement('div');
      // Usamos la misma clase para que tenga la sombra y estilo
      equipDiv.classList.add('customer');
      equipDiv.innerHTML = `
        <p><strong>ID Equipo:</strong> ${equip.id_equip}</p>
        <p><strong>Modelo:</strong> ${equip.model_equip}</p>
        <p><strong>Marca:</strong> ${equip.brand_equip}</p>
        <p><strong>Color:</strong> ${equip.color_equip}</p>
        <p><strong>Estado:</strong> ${equip.state_equip}</p>
        <p><strong>Clave del Equipo:</strong> ${equip.pass_equip}</p>
        <p><strong>Antigüedad:</strong> ${equip.anti_equip}</p>
        <p><strong>Accesorio:</strong> ${equip.accessor_equip}</p>
        <p><strong>Reporte:</strong> ${equip.reported_equip}</p>
        <p><strong>Detalles Físico:</strong> ${equip.detail_phy_equip}</p>
        <p><strong>Temperatura:</strong> ${equip.temp_equip}</p>
        <p><strong>Encendido/Apagado:</strong> ${equip.on_off_equip ? 'Encendido' : 'Apagado'}</p>
        <p><strong>Causa del daño:</strong> ${equip.cau_dam_equip}</p>
        <p><strong>Condición del Equipo:</strong> ${equip.condEquip}</p>
        <p><strong>ID Cliente:</strong> ${equip.id_customer}</p>
        <p><strong>Nombre Cliente:</strong> ${equip.name}</p>
      `;
      contenedorDatos.appendChild(equipDiv);
    });
  }

  // Función para generar los controles de paginación
  function renderPaginationControls() {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(equipments.length / itemsPerPage);
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
