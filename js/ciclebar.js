const nav = document.querySelector("nav"),
      toggleBtn = nav.querySelector(".toggle-btn");
      
      toggleBtn.addEventListener("click", () =>{
        nav.classList.toggle("open");
});