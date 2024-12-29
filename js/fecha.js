function updateDateTime() {
    const dateContainer = document.getElementById('date-container');
    const timeContainer = document.getElementById('time-container');
    const iconContainer = document.getElementById('ico-container');
    
    // Configuración de fecha
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    const now = new Date();
    
    // Formatear fecha
    let formattedDate = now.toLocaleDateString('es-ES', options);
    formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    dateContainer.textContent = formattedDate;
    
    // Formatear hora
    const formattedTime = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    timeContainer.textContent = formattedTime;
    
    // Mostrar ícono de sol o luna
    const hour = now.getHours();
    if (hour >= 6 && hour < 19) {
        iconContainer.innerHTML = '<i class="fa-solid fa-sun"></i>'; // Ícono de sol
    } else {
        iconContainer.innerHTML = '<i class="fa-solid fa-moon"></i>'; // Ícono de luna
    }
}

// Actualizar fecha, hora e ícono cada segundo
setInterval(updateDateTime, 1000);

// Llama a la función inmediatamente para cargar los valores al inicio
updateDateTime();