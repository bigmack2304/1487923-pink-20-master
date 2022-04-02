/*
    обработчик для слайдеров

    HTML...

  <div class="js-addon_slider">
    <div class="addon_slider__vieport">
      <!--  на первый addon_slider__slide автоматом вешается доп класс addon_slider__slide-active  -->  
      <div class="addon_slider__slide">
        <!-- содержание слайда -->
      </div>
    </div>
    <div class="addon_slider__input">
 <!-- переключатели слайдеров -->
 <!--  Автоматически добавляются скриптом, столько раз, сколько есть слайдов  -->     
 <!--     <input class="addon_slider__radio" type="radio" value="1" name="img"/> -->
    </div>
  </div>

*/

let object_sliders = document.getElementsByClassName("js-addon_slider");
if (object_sliders != null) {
    init_sliders(object_sliders);
    init_sleders_radio(object_sliders);
}

let object_sliders_radio = document.getElementsByClassName("addon_slider__radio");
if (object_sliders_radio != null) {
    init_active_slide(object_sliders_radio);
}

function init_sliders(input) {                                          // находим все слайдеры, и добавляем к ним переключалки слайдов, в зависимости от количества слайдов
    for (let i=0; i < input.length; i++) { 
        let slides_in_vieport = input[i].children[0].children.length;   // количество слайдов в вьюпорте слайдера
        if (slides_in_vieport != null) {
            //test
            let slide_width = input[i].children[0].children[0].clientWidth;                     // ширина слайда
            let vieport_width = input[i].children[0].clientWidth;                               // ширина вьюпорта ихного
            let rafio_amount = slides_in_vieport / Math.floor((vieport_width / slide_width));   // сколько кнопок нужно создать
           // for (let k=0; k < slides_in_vieport; k++) {
            if (rafio_amount == 1) {continue;}                          // с одной кнопкой мы ничего не будем листать, не нужно ее создавать
            for (let k=0; k < rafio_amount; k++) {                      // добавляем кнопки с учетом ихного количества в вьюпорте
                let object_sliders_input = input[i].children[1];        // блок переключалок
                //let text_inputs = '<input class="addon_slider__radio" type="radio" value="' + k + '" name="addon_slider' + i + '_img"/>';
                //let text_inputs = '<input class="addon_slider__radio" type="radio" value="' + k + '" name="addon_slider' + i + '_' + k +'_img" id="addon_slider' + i + '_' + k +'_img"/> <label for="addon_slider' + i + '_' + k + '_img"></label>';
                let text_inputs = '<input class="addon_slider__radio" type="radio" value="' + k + '" name="addon_slider' + i + '_img" id="addon_slider' + i + '_' + k +'_img"/>';
                object_sliders_input.innerHTML += text_inputs;          // добавить 

                let text_label = '<label for="addon_slider' + i + '_' + k + '_img"></label>';
                object_sliders_input.innerHTML += text_label; 
            }
        }
    }
}

function init_sleders_radio(input) {                                    // активирует первый слаид в каждом слайдере
    for (let i=0; i < input.length; i++) {  
        let object_radio = input[i].children[1].children[0];            // переключалка
        let object_slide = input[i].children[0].children[0];            // слаид
        if (object_radio != null) {
            object_radio.checked = true;                                // включаем первую переключалку
        }
        if (object_slide != null) {
            object_slide.classList.toggle("addon_slider__slide-active");    // включаем первый слаид
        }
    }
}

function init_active_slide(input) {                         
    for (let i=0; i < input.length; i++) {                              // перебор всех переключалок слайдеров
        input[i].addEventListener('click', function (evt) {             // вешаем на них событие клик
            update_active_slide(evt);
        });
    }    
}

function update_active_slide(DOM_obj) {                                             // вызывается при нажатии на переключалку слайда
    let obj_radio = DOM_obj.currentTarget;                                          // нажатый radio
    let obj_slides = obj_radio.parentElement.parentElement.children[0].children;    // контейнер слайдов (для этих radio)
    let old_radio_value = get_old_value(obj_slides);
    for (let i=0; i < obj_slides.length; i++) {
        obj_slides[i].classList.remove("addon_slider__slide-active");               // снять активные слайды
    }
    obj_slides[obj_radio.value].classList.add("addon_slider__slide-active");        // установить новый активный слаид
    updete_position(Number(obj_radio.value), old_radio_value, obj_radio.parentElement.parentElement);
}

function updete_position(slide_num, old_slide_num, obj_slider) {     // передвигает слайдер лист, так чтобы на экране был активный слаид
    // slide_num - номер слайда, который нужно показать
    // old_slide_num - номер слайда который активен ранее
    // obj_slider - общий контейнер слайдера, в котором мы нажали переключалку
    if (old_slide_num === false) { return; }

    let obj_slides = obj_slider.children[0].children;   // массив всех слайдеров
    //let vp_width = obj_slider.clientWidth;              // ширина слайдера
    let vp_width = 100;
    let dir = (slide_num > old_slide_num) ? ("left") : ("right");
    let x_pos;
   for (let k = 0; k < Math.abs(slide_num - old_slide_num); k++) {
        for (let i = 0; i < obj_slides.length; i++) {
            x_pos = string_to_number(obj_slides[i].style.transform);

            if (dir == "left") {
                obj_slides[i].style.transform = 'translateX(' + (x_pos - vp_width) + '%)';
            } else if (dir == "right") {
                obj_slides[i].style.transform = 'translateX(' + (x_pos + vp_width) + '%)';
            }
        }
    }
}

function get_old_value (arry) {
    for (let i = 0; i < arry.length; i++) {
        if (arry[i].className.indexOf("__slide-active") != -1) {
            return i;
        }
    }
    return false;
}

function string_to_number(str) {
    if (str == '') {
       return 0;
    } else {
       //return Number(str.replace(/[^-1-9-0, ]/g,""));
       return Number(str.replace(/[^- ^0-9]/g,""));
    }
}

