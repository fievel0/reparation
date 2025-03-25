document.querySelector('.form-container form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
  
  // Obtener los valores de los campos del formulario
  const fechaPago = document.getElementById('fechaPago').value;
  const saldo = parseFloat(document.getElementById('saldo').value);
  const abono = parseFloat(document.getElementById('abono').value);
  const idOrder = document.getElementById('idOrder').value;

  // Validación simple
  if (!fechaPago || isNaN(saldo) || isNaN(abono) || !idOrder) {
    alert('Por favor, rellene todos los campos correctamente.');
    return;
  }

  // Crear el objeto JSON para enviar
  const paymentData = {
    date_pay: fechaPago,
    money_pay: saldo,
    money_b_pay: abono,
    order_id: parseInt(idOrder)
  };

  // Enviar los datos con fetch
  fetch('http://localhost:8084/api/payments/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(paymentData) // Convertir el objeto en JSON
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al guardar el pago');
    }
    return response.json(); // Asumimos que la respuesta es en formato JSON
  })
  .then(data => {
    // Mostrar un mensaje de éxito
    document.getElementById('mensaje').textContent = 'Pago guardado exitosamente.';
    document.getElementById('mensaje').style.color = 'green';
  })
  .catch(error => {
    // Manejar errores
    document.getElementById('mensaje').textContent = 'Hubo un error al guardar el pago: ' + error.message;
    document.getElementById('mensaje').style.color = 'red';
  });
});
