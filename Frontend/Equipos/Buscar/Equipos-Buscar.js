document.addEventListener("DOMContentLoaded", () => {
  // Referencias a elementos del DOM
  const btnID = document.getElementById("btnID");
  const btnCedula = document.getElementById("btnCedula");
  const inputField = document.querySelector(".CampoBuscar input");
  const resultContainer = document.querySelector(".result-container");
  const form = document.getElementById("CampoBuscar1");
  const btnBorrarGlobal = document.getElementById("btnBorrar");
  const btnActualizarGlobal = document.getElementById("btnActualizar");

  // Contenedor de paginación
  const paginationContainer = document.createElement("div");
  paginationContainer.id = "pagination";
  resultContainer.parentNode.insertBefore(paginationContainer, resultContainer.nextSibling);

  // Variables para paginación en búsqueda por ID Dueño
  let filteredEquipments = [];
  const itemsPerPage = 12; // Puedes ajustar este valor
  let currentPage = 1;

  // Flag para distinguir modo de búsqueda: true si es búsqueda por dueño
  let searchByOwner = false;

  // Función para mostrar mensajes globales con estilos (verde para éxito, rojo para error)
  const showGlobalMessage = (msg, color) => {
    const messageDiv = document.createElement("div");
    messageDiv.innerHTML = `<p style="color:${color}; text-align: center;">${msg}</p>`;
    // Insertar el mensaje encima del contenedor de resultados
    resultContainer.parentNode.insertBefore(messageDiv, resultContainer);
    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  };

  // Función para quitar la clase "active" de ambos botones
  const clearSelected = () => {
    btnID.classList.remove("active");
    btnCedula.classList.remove("active");
  };

  // Función para limpiar el campo y resultados
  const clearData = () => {
    inputField.value = "";
    resultContainer.innerHTML = "";
    paginationContainer.innerHTML = "";
  };

  /**
   * Función para generar el HTML de un equipo.
   * Si showActions es true, se incluyen botones inline para borrar y actualizar.
   */
  const renderEquipment = (equipment, showActions = false) => {
    return `
      <div class="equipment">
        <p><strong>ID:</strong> <input type="text" class="equip-id" value="${equipment.id_equip || ''}" readonly></p>
        <p><strong>Modelo:</strong> <input type="text" class="equip-model" value="${equipment.model_equip || ''}"></p>
        <p><strong>Marca:</strong> <input type="text" class="equip-brand" value="${equipment.brand_equip || ''}"></p>
        <p><strong>Color:</strong> <input type="text" class="equip-color" value="${equipment.color_equip || ''}"></p>
        <p><strong>Estado del Equipo:</strong> <input type="text" class="equip-state" value="${equipment.state_equip || ''}"></p>
        <p><strong>Clave del Equipo:</strong> <input type="text" class="equip-pass" value="${equipment.pass_equip || ''}"></p>
        <p><strong>Antigüedad:</strong> <input type="text" class="equip-antivirus" value="${equipment.anti_equip || ''}"></p>
        <p><strong>Accesorios:</strong> <input type="text" class="equip-accessories" value="${equipment.accessor_equip || ''}"></p>
        <p><strong>Reporte:</strong> <input type="text" class="equip-report" value="${equipment.reported_equip || ''}"></p>
        <p><strong>Detalles Físicos:</strong> <input type="text" class="equip-detail" value="${equipment.detail_phy_equip || ''}"></p>
        <p><strong>Temperatura:</strong> <input type="text" class="equip-temp" value="${equipment.temp_equip || ''}"></p>
        <p><strong>Encendido/Apagado:</strong> <input type="text" class="equip-onoff" value="${equipment.on_off_equip ? 'Encendido' : 'Apagado'}" readonly></p>
        <p><strong>Causa del Daño:</strong> <input type="text" class="equip-causa" value="${equipment.cau_dam_equip || ''}"></p>
        <p><strong>Condición del Equipo:</strong> <input type="text" class="equip-cond" value="${equipment.condEquip || ''}"></p>
        <p><strong>ID Cliente:</strong> <input type="text" class="equip-idcustomer" value="${equipment.id_customer || ''}" readonly></p>
        <p><strong>Nombre Cliente:</strong> <input type="text" class="equip-name" value="${equipment.name || ''}" readonly></p>
        ${
          showActions
            ? `<div class="equipment-actions">
                 <button class="Borrar">Borrar</button>
                 <button class="Actualizar">Actualizar</button>
               </div>`
            : ""
        }
      </div>
    `;
  };

  // Función para mostrar un equipo individual (búsqueda por ID Equipo)
  const showEquipment = (equipment) => {
    if (!equipment || Object.keys(equipment).length === 0) {
      resultContainer.innerHTML = `<p style="color: red;">No se encontró información.</p>`;
      return;
    }
    // En búsqueda por ID Equipo se muestran los botones globales, por eso no se incluyen inline.
    resultContainer.innerHTML = renderEquipment(equipment, false);
  };

  // Función para extraer los datos de un equipo desde un contenedor específico
  const getEquipmentDataFromCard = (equipmentDiv) => {
    if (!equipmentDiv) return null;
    return {
      id_equip: equipmentDiv.querySelector(".equip-id")?.value,
      model_equip: equipmentDiv.querySelector(".equip-model")?.value,
      brand_equip: equipmentDiv.querySelector(".equip-brand")?.value,
      color_equip: equipmentDiv.querySelector(".equip-color")?.value,
      state_equip: equipmentDiv.querySelector(".equip-state")?.value,
      pass_equip: equipmentDiv.querySelector(".equip-pass")?.value,
      anti_equip: equipmentDiv.querySelector(".equip-antivirus")?.value,
      accessor_equip: equipmentDiv.querySelector(".equip-accessories")?.value,
      reported_equip: equipmentDiv.querySelector(".equip-report")?.value,
      detail_phy_equip: equipmentDiv.querySelector(".equip-detail")?.value,
      temp_equip: equipmentDiv.querySelector(".equip-temp")?.value,
      on_off_equip: equipmentDiv.querySelector(".equip-onoff")?.value === "Encendido",
      cau_dam_equip: equipmentDiv.querySelector(".equip-causa")?.value,
      condEquip: equipmentDiv.querySelector(".equip-cond")?.value,
      id_customer: equipmentDiv.querySelector(".equip-idcustomer")?.value,
      name: equipmentDiv.querySelector(".equip-name")?.value
    };
  };

  // Funciones para la paginación en búsqueda por ID Dueño
  function renderPage() {
    resultContainer.innerHTML = "";
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageEquipments = filteredEquipments.slice(startIndex, endIndex);

    // Contenedor para el grid, ajustando el layout según la cantidad de elementos
    const gridContainer = document.createElement("div");
    gridContainer.style.gap = "10px";
    if (pageEquipments.length === 1) {
      gridContainer.style.display = "flex";
      gridContainer.style.justifyContent = "center";
    } else if (pageEquipments.length === 2) {
      gridContainer.style.display = "grid";
      gridContainer.style.gridTemplateColumns = "repeat(2, 1fr)";
    } else {
      gridContainer.style.display = "grid";
      gridContainer.style.gridTemplateColumns = "repeat(3, 1fr)";
    }

    // Para cada equipo, generamos la tarjeta con botones inline y asignamos eventos
    pageEquipments.forEach(equip => {
      const equipHTML = renderEquipment(equip, true);
      const equipDiv = document.createElement("div");
      equipDiv.innerHTML = equipHTML;

      // Asignar evento al botón Borrar (inline)
      const btnDelete = equipDiv.querySelector(".Borrar");
      if (btnDelete) {
        btnDelete.addEventListener("click", () => {
          const equipmentId = equipDiv.querySelector(".equip-id")?.value;
          if (!equipmentId) return;
          const deleteUrl = `http://localhost:8084/api/equipment/delete/${equipmentId}`;
          fetch(deleteUrl, { method: "DELETE" })
            .then(response => {
              if (!response.ok) {
                throw new Error("Error al eliminar el equipo");
              }
              return response.text();
            })
            .then(() => {
              // Muestra mensaje similar a la búsqueda por ID Equipo
              showGlobalMessage(`Equipo con ID ${equipmentId} eliminado correctamente.`, "green");
              // Eliminamos la tarjeta del DOM
              equipDiv.remove();
            })
            .catch(error => {
              showGlobalMessage(`Error: ${error.message}`, "red");
            });
        });
      }

      // Asignar evento al botón Actualizar (inline)
      const btnUpdate = equipDiv.querySelector(".Actualizar");
      if (btnUpdate) {
        btnUpdate.addEventListener("click", () => {
          const equipmentData = getEquipmentDataFromCard(equipDiv);
          if (!equipmentData || !equipmentData.id_equip) {
            showGlobalMessage("No se encontró el equipo para actualizar", "red");
            return;
          }
          const updateUrl = `http://localhost:8084/api/equipment/update/${equipmentData.id_equip}`;
          fetch(updateUrl, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(equipmentData)
          })
            .then(response => {
              if (!response.ok) {
                throw new Error("Error al actualizar el equipo");
              }
              return response.text();
            })
            .then(() => {
              showGlobalMessage(`Equipo con ID ${equipmentData.id_equip} actualizado correctamente.`, "green");
            })
            .catch(error => {
              showGlobalMessage(`Error: ${error.message}`, "red");
            });
        });
      }

      gridContainer.appendChild(equipDiv);
    });

    resultContainer.appendChild(gridContainer);
  }

  function renderPaginationControls() {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(filteredEquipments.length / itemsPerPage);
    if (totalPages <= 1) return;
  
    // Función para aplicar estilos en línea y el efecto hover
    const styleButton = (btn) => {
      btn.style.margin = "0 5px";
      btn.style.padding = "8px 12px";
      btn.style.backgroundColor = "rgb(103, 93, 45)";
      btn.style.color = "white";
      btn.style.border = "none";
      btn.style.borderRadius = "5px";
      btn.style.cursor = "pointer";
      
  
      // Efecto hover con eventos
      btn.addEventListener("mouseenter", () => {
        btn.style.backgroundColor = "rgb(93, 83, 35)";
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.backgroundColor = "rgb(103, 93, 45)";
      });
    };
  
    if (currentPage > 1) {
      const prevButton = document.createElement("button");
      prevButton.textContent = "Anterior";
      styleButton(prevButton);
      prevButton.addEventListener("click", () => {
        currentPage--;
        renderPage();
        renderPaginationControls();
      });
      paginationContainer.appendChild(prevButton);
    }
  
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      styleButton(btn);
      if (i === currentPage) btn.disabled = true;
      btn.addEventListener("click", () => {
        currentPage = i;
        renderPage();
        renderPaginationControls();
      });
      paginationContainer.appendChild(btn);
    }
  
    if (currentPage < totalPages) {
      const nextButton = document.createElement("button");
      nextButton.textContent = "Siguiente";
      styleButton(nextButton);
      nextButton.addEventListener("click", () => {
        currentPage++;
        renderPage();
        renderPaginationControls();
      });
      paginationContainer.appendChild(nextButton);
    }
  }
  

  function showPaginatedEquipments() {
    currentPage = 1;
    renderPage();
    renderPaginationControls();
  }

  // Eventos para seleccionar el tipo de búsqueda
  btnID.addEventListener("click", () => {
    clearSelected();
    btnID.classList.add("active");
    clearData();
    searchByOwner = false;
    // Se muestran los botones globales para actualizar y borrar (para búsqueda por ID Equipo)
    btnBorrarGlobal.style.display = "inline-block";
    btnActualizarGlobal.style.display = "inline-block";
  });

  btnCedula.addEventListener("click", () => {
    clearSelected();
    btnCedula.classList.add("active");
    clearData();
    searchByOwner = true;
    // Ocultamos los botones globales, pues en búsqueda por dueño se usan los botones inline en cada tarjeta
    btnBorrarGlobal.style.display = "none";
    btnActualizarGlobal.style.display = "none";
  });

  // Evento submit del formulario: realiza la búsqueda según la opción activa
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!btnID.classList.contains("active") && !btnCedula.classList.contains("active")) {
      resultContainer.innerHTML = `<p style="color:red;">Por favor, selecciona una opción de búsqueda (ID o ID Dueño)</p>`;
      return;
    }
    const valor = inputField.value.trim();
    if (valor === "") {
      resultContainer.innerHTML = `<p style="color:red;">Por favor ingresa un valor para la búsqueda</p>`;
      return;
    }

    // Búsqueda por ID Equipo
    if (btnID.classList.contains("active")) {
      const url = `http://localhost:8084/api/equipment/find/${valor}`;
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error("La información no existe");
          }
          return response.json();
        })
        .then(data => {
          showEquipment(data);
        })
        .catch(error => {
          resultContainer.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
        });
    }
    // Búsqueda por ID Dueño
    else if (btnCedula.classList.contains("active")) {
      fetch("http://localhost:8084/api/equipment/findAll")
        .then(response => {
          if (!response.ok) {
            throw new Error("Error en la solicitud");
          }
          return response.json();
        })
        .then(data => {
          filteredEquipments = data.filter(equip => equip.id_customer == valor);
          if (filteredEquipments.length === 0) {
            resultContainer.innerHTML = `<p style="color:red;">No se encontraron equipos para este cliente.</p>`;
            paginationContainer.innerHTML = "";
          } else {
            showPaginatedEquipments();
          }
        })
        .catch(error => {
          resultContainer.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
        });
    }
  });

  // Eventos globales para Borrar y Actualizar (para búsqueda por ID Equipo)
  btnBorrarGlobal.addEventListener("click", () => {
    if (!btnID.classList.contains("active")) {
      resultContainer.innerHTML = `<p style="color:red;">La opción Borrar sólo funciona en la búsqueda por ID Equipo</p>`;
      return;
    }
    const equipmentId = resultContainer.querySelector(".equip-id")?.value || inputField.value.trim();
    if (!equipmentId) {
      resultContainer.innerHTML = `<p style="color:red;">No se encontró el ID del equipo para borrar</p>`;
      return;
    }
    const deleteUrl = `http://localhost:8084/api/equipment/delete/${equipmentId}`;
    fetch(deleteUrl, {
      method: "DELETE"
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al eliminar el equipo");
        }
        return response.text();
      })
      .then(() => {
        showGlobalMessage(`Equipo con ID ${equipmentId} eliminado correctamente.`, "green");
        setTimeout(() => {
          clearData();
        }, 3000);
      })
      .catch(error => {
        resultContainer.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
      });
  });

  btnActualizarGlobal.addEventListener("click", () => {
    if (!btnID.classList.contains("active")) {
      resultContainer.innerHTML = `<p style="color:red;">La opción Actualizar sólo funciona en la búsqueda por ID Equipo</p>`;
      return;
    }
    const equipmentData = getEquipmentDataFromCard(document.querySelector(".equipment"));
    if (!equipmentData || !equipmentData.id_equip) {
      resultContainer.innerHTML = `<p style="color:red;">No se encontró el equipo para actualizar</p>`;
      return;
    }
    const updateUrl = `http://localhost:8084/api/equipment/update/${equipmentData.id_equip}`;
    fetch(updateUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(equipmentData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al actualizar el equipo");
        }
        return response.text();
      })
      .then(() => {
        showGlobalMessage(`Equipo con ID ${equipmentData.id_equip} actualizado correctamente.`, "green");
      })
      .catch(error => {
        resultContainer.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
      });
  });
});
