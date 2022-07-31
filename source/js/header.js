'use strict';

js_active();

function js_active() {
    const header = document.getElementsByClassName("header");

    for (let i=0; i < header.length; i++) {      
        header[i].classList.remove("header--no_js");
      }
}