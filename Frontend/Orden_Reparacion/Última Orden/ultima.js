// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    const contenedorDatos = document.getElementById('contenedorDatos');
    const btnDarkMode = document.getElementById("btn-dark-mode");
  
    // Realiza la solicitud GET a la API para obtener la última orden
    fetch('http://localhost:8084/api/ord_rep/findLast')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la solicitud: ' + response.status);
        }
        return response.json();
      })
      .then(order => {
        // Si existe el array de pagos, se obtiene el primero; de lo contrario se asigna un objeto vacío
        const payment = order.payments && order.payments.length > 0 ? order.payments[0] : {};
  
        // Construye el HTML para mostrar la información completa de la orden
        contenedorDatos.innerHTML = `
          <div class="customer">
            <p><strong>ID Orden: </strong>${order.id_order}</p>
            <p><strong>Fecha de Recepción: </strong>${order.create_date}</p>
            <p><strong>Fecha de Entrega: </strong>${order.deadline}</p>
            <p><strong>Total de Pago: </strong>${order.tot_pay}</p>
            <p><strong>Detalles Adicionales: </strong>${order.addit_details}</p>
            <p><strong>Cliente: </strong> ID ${order.customer.id_customer} | Nombre: ${order.customer.name} | C.I.: ${order.customer.cardIdentifi} | Teléfono: ${order.customer.phone} | Email: ${order.customer.mail}</p>
            <p><strong>Equipo: </strong> ID ${order.equipment.id_equip} | Modelo: ${order.equipment.model_equip} | Marca: ${order.equipment.brand_equip} | Color: ${order.equipment.color_equip} | Estado: ${order.equipment.on_off_equip ? 'Encendido' : 'Apagado'}</p>
            <p><strong>Pago: </strong>${payment.id_pay ? `ID ${payment.id_pay} | Fecha: ${payment.date_pay} | Monto: ${payment.money_pay} | Abono: ${payment.money_b_pay}` : 'No disponible'}</p>
            <p><strong>Empleado: </strong> ID ${order.employee.idEmployee} | Nombre: ${order.employee.nameEmployee}</p>
          </div>
        `;
      })
      .catch(error => {
        console.error('Hubo un problema con la solicitud Fetch:', error);
        contenedorDatos.innerHTML = `<p>Error al cargar la última orden.</p>`;
      });
  
    // Lógica para el modo oscuro (opcional)
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
  