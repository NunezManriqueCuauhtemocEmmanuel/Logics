let tabs = document.querySelectorAll(".tabs h3")
let tabContentes = document.querySelectorAll(".tab-content div");

tabs.forEach((tab,index) =>{
    tab.addEventListener("click", () =>{
        tabContentes.forEach(content => {
            content.classList.remove("active");
        });
        tabs.forEach((tab) =>{
            tab.classList.remove("active");
        });
        tabContentes[index].classList.add("active");
        tabs[index].classList.add("active"); 
    });
});

