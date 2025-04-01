document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const mensajeDiv = document.getElementById("mensaje");
  
    form.addEventListener("submit", (event) => {
      event.preventDefault();
  
      // Obtener los valores de los inputs
      const create_date = document.getElementById("fechaRecepcion").value;
      const deadline = document.getElementById("fechaEntrega").value;
      const tot_pay = parseFloat(document.getElementById("totalPago").value);
      const addit_details = document.getElementById("detalles").value;
      const id_customer = parseInt(document.getElementById("idCliente").value);
      const id_equip = parseInt(document.getElementById("idEquipo").value);
      const idEmployee = parseInt(document.getElementById("idEmpleado").value);
  
      // Crear el objeto con la estructura JSON requerida
      const ordenData = {
        create_date: create_date,
        deadline: deadline,
        tot_pay: tot_pay,
        addit_details: addit_details,
        customer: { id_customer: id_customer },
        equipment: { id_equip: id_equip },
        employee: { idEmployee: idEmployee }
      };
  
      // Enviar datos mediante POST a la URL indicada
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
          return response.text();
        })
        .then(data => {
          console.log("Orden guardada:", data);
          mensajeDiv.innerText = "Orden guardada correctamente";
        })
        .catch(error => {
          console.error("Error al guardar la orden:", error);
          mensajeDiv.innerText = "Error al guardar la orden, revise los ID";
        });
    });
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
  