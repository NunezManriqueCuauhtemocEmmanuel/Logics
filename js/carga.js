 // Obtener el parámetro 'next' de la URL
 const urlParams = new URLSearchParams(window.location.search);
 const nextPage = urlParams.get('next');

 // Verificar si existe un destino
 if (nextPage) {
   setTimeout(() => {
     window.location.href = nextPage;  // Redirige después de 10 segundos
   }, 3000);
 } else {
   // Si no existe un destino, redirigir a la página principal
   setTimeout(() => {
     window.location.href = "index.html";
   }, 3000);
 }