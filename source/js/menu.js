'use strict';

/*
    функции для открытия\закрытия меню по нажатии кнопки
*/ 

document.addEventListener('DOMContentLoaded', function(evt) {   // если DOM загрузился
// событие на любой скролл
 //   window.addEventListener('scroll', function(evt) {           // если мы скролим
 //     muse_wheel();                                             //  
 //   });

  // событие на любой клик
  window.addEventListener('click', function(evt) {                // если мы кликнем
    f_click(evt);                                                 //  
  });
});

//////////////////////////////////////////////////////////////////
// нужно чтобы страницей можно было хоть както попользоватся без js
// для этого по умолчанию в html сделаем меню открытым, а затем уже тут
// в js в начале обработки мы найдем все менюшки и деактивируем их
deactive_no_js();

function deactive_no_js() {
  const js_manu_actives = document.getElementsByClassName("js-menu");
  const menu_elements_actives = document.getElementsByClassName("menu__elements");
  const menu_button = document.getElementsByClassName("menu__buton");
  // показать скрытую кнопку
  for (let i=0; i < menu_button.length; i++) {      
    menu_button[i].classList.remove("visually-hidden");
  }
  // обновить модификатор всего меню
  for (let i=0; i < js_manu_actives.length; i++) {
    js_manu_actives[i].classList.remove("js-menu--active");
  }
  // обновить модификатор блока элементов меню
  for (let i=0; i < menu_elements_actives.length; i++) {
    menu_elements_actives[i].classList.remove("menu__elements--active");
    menu_elements_actives[i].classList.remove("menu__elements--no_js");
  }
}

///////////////////////////////////////////////////////////////////

  function evt_menu_on_click(evt) {
    menu_on_click(evt);
  }

  function evt_menu_key_down(evt) {
    if (evt.code == 'Enter') menu_on_click(evt);
  }

  const object_menu_btn = document.getElementsByClassName("menu__buton");
  for(let i=0; i < object_menu_btn.length; i++) {                                // обходим все найденные меню
    object_menu_btn[i].addEventListener('click', evt_menu_on_click);             // повесить на них обработчик "клик мышкой"  
    object_menu_btn[i].addEventListener('keydown', evt_menu_key_down);           // повесить на них обработчик "выбор enter,ом"
  }

  function menu_on_click(DOM_obj) {                                             // открыть закрыть меню по кнопке
    let object_btn = DOM_obj.currentTarget;                
    let object_elements = DOM_obj.currentTarget.parentElement.parentElement.children[1];
    let object_menu = DOM_obj.currentTarget.parentElement.parentElement;
    object_menu.classList.toggle("js-menu--active");
    object_btn.classList.toggle("menu__buton--active");
    object_elements.classList.toggle("menu__elements--active");
  }

  function muse_wheel() {                                                       // закрываем меню (при скролле)
    close_menu();
  }

  const accept_classes = [  "menu__input",
                            "menu__buton",
                            "menu__elements",
                            "menu__element" ]

  function f_click(DOM_obj) {
    let obj_class = (typeof DOM_obj.srcElement.className === "object") ? (false) : (DOM_obj.srcElement.className);
    let obj_open_menu = document.getElementsByClassName("js-menu--active");
    if (DOM_obj && obj_class) {
      if (obj_open_menu.length >= 1) {
        let err_n = 0;
        for (let i = 0; i < accept_classes.length; i++) {
          if (obj_class.indexOf(accept_classes[i]) == -1) {
            err_n++;
            continue;
          }
          break;
        }
      //  console.log(err_n);
        if (err_n == accept_classes.length) {
          close_menu();
        }
      }
    } else {
      if (obj_open_menu.length >= 1) { 
        close_menu(); 
      }
    }
  }

  function close_menu() {
    if (object_menu_btn.length != null) {
      for (let i=0; i < object_menu_btn.length; i++) {
          object_menu_btn[i].classList.remove("menu__buton--active");
          object_menu_btn[i].parentElement.parentElement.children[1].classList.remove("menu__elements--active");
          object_menu_btn[i].parentElement.parentElement.classList.remove("js-menu--active");
      }
    } 
  }