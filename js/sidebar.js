const showSidebar = (toggleId, radiarbar) =>{
    const toggle = document.getElementById(toggleId),
          sidebar = document.getElementById(radiarbar)
 
    if(toggle && sidebar){
        toggle.addEventListener('click', ()=>{
            /* Show sidebar */
            sidebar.classList.toggle('show-radiar')
        })
    }
 }
 showSidebar('header-toggle','radiarbar')
