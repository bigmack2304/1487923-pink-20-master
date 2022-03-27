/*
    функции для открытия\закрытия меню по нажатии кнопки
*/ 

document.addEventListener('DOMContentLoaded', function(evt) {   // если DOM загрузился
// событие на любой скролл
 //   window.addEventListener('scroll', function(evt) {           // если мы скролим
 //     muse_wheel();                                             // закрываем меню
 //   });

  // событие на любой клик
 // window.addEventListener('click', function(evt) {           // если мы скролим
 //   click(evt);                                             // закрываем меню
 // });
});

const object_menu_btn = document.getElementsByClassName("menu__buton");
for(let i=0; i < object_menu_btn.length; i++) {                                // обходим все найденные меню
    object_menu_btn[i].addEventListener('click', function (evt) {              // повесить на них обработчик "клик мышкой"
      menu_on_click(evt)
    }); 
  
    object_menu_btn[i].addEventListener('keydown', function(evt) {             // повесить на них обработчик "выбор enter,ом"
      if (evt.code == 'Enter') menu_on_click(evt);
    });
  } 

  function menu_on_click(DOM_obj) {                                             // открыть закрыть меню по кнопке
    let object_btn = DOM_obj.currentTarget;                
    let object_elements = DOM_obj.currentTarget.parentElement.parentElement.children[1];
    let object_menu = DOM_obj.currentTarget.parentElement.parentElement;
    object_menu.classList.toggle("menu--active");
    object_btn.classList.toggle("menu__buton--active");
    object_elements.classList.toggle("menu__elements--active");
  }

  function muse_wheel() {                                                       // закрываем меню (при скролле)
    close_menu();
  }

  function close_menu() {
    if (object_menu_btn.length != null) {
      for (let i=0; i < object_menu_btn.length; i++) {
          object_menu_btn[i].classList.remove("menu__buton--active");
          object_menu_btn[i].parentElement.parentElement.children[1].classList.remove("menu__elements--active");
          object_menu_btn[i].parentElement.parentElement.classList.remove("menu--active");
      }
    } 
  }