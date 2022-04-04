'use strict';

/*
    обработчик для слайдеров

    базувую структуру HTML менять категорически нежелательно
    HTML...

  <div class="js-addon_slider">
    <div class="addon_slider__vieport">
      <!--  на первый addon_slider__slide автоматом вешается доп класс addon_slider__slide--active  -->  
      <div class="addon_slider__slide">
        <div class="addon_slider__in_slide_container">
            <!-- содержание слайда -->
        </div>
      </div>
    </div>

    <div class="addon_slider__input">
 <!-- переключатели слайдеров -->
 <!--  Автоматически добавляются скриптом, столько раз, сколько есть слайдов  -->     
 <!--     <input class="addon_slider__radio" type="radio" value="(номер переключалки)" name="addon_slider(номер слайдера на странице)_img" id="addon_slider(номер слайдера на странице)_(номер переключалки)_img"/> -->
 <!--     <label for="addon_slider(номер слайдера на странице)_(номер переключалки)_img" class="addon_slider__radio-label" tabindex="0"></label>
    </div>
  </div>

*/

// проверяет обьекты возвращаемые от getElementsByClassName
// если там есть хоть 1 элемент, вернет true
const is_object_valid = (obj) => {
    return (obj.length != 0) ? (true) : (false);
}

// после загрузки страницы, начинаем обработку, ищим слайдеры
const object_sliders = document.getElementsByClassName("js-addon_slider");
if (is_object_valid(object_sliders)) {
    init_sliders(object_sliders);           //  добавляем переключалки к слайдерам
    init_sleders_radio(object_sliders);     //  активация первой переключалки и слайда в каждом слайдере
}

const obj_radio_label = document.getElementsByClassName("addon_slider__radio-label");
if (is_object_valid(obj_radio_label)) {
    for (let i=0; i < obj_radio_label.length; i++) {                                 
        obj_radio_label[i].addEventListener('keydown', function(evt) {
        if (evt.code == 'Enter') {
            label_on_enter(evt);            // вешаем на лейбел переключалки событие "нажатие ввода"
        }});
    }
}


const object_sliders_radio = document.getElementsByClassName("addon_slider__radio");
if (is_object_valid(object_sliders_radio)) {
    init_active_slide(object_sliders_radio);    // вешаем на переключалки событие клик
}

function init_sliders(DOM_obj) {                                          // находим все слайдеры, и добавляем к ним переключалки слайдов, в зависимости от количества слайдов
    for (let i=0; i < DOM_obj.length; i++) { 
        let slides_in_vieport = DOM_obj[i].children[0].children.length;   // количество слайдов в вьюпорте слайдера
        if (slides_in_vieport != 0) {
            //test
            let slide_width = DOM_obj[i].children[0].children[0].clientWidth;                     // ширина слайда
            let vieport_width = DOM_obj[i].children[0].clientWidth;                               // ширина вьюпорта ихного
            let rafio_amount = slides_in_vieport / Math.floor((vieport_width / slide_width));   // сколько кнопок нужно создать
           // for (let k=0; k < slides_in_vieport; k++) {
            if (rafio_amount == 1) {continue;}                          // с одной кнопкой мы ничего не будем листать, не нужно ее создавать
            for (let k=0; k < rafio_amount; k++) {                      // добавляем кнопки с учетом ихного количества в вьюпорте
                let object_sliders_input = DOM_obj[i].children[1];        // блок переключалок
                //let text_inputs = '<input class="addon_slider__radio" type="radio" value="' + k + '" name="addon_slider' + i + '_img"/>';
                //let text_inputs = '<input class="addon_slider__radio" type="radio" value="' + k + '" name="addon_slider' + i + '_' + k +'_img" id="addon_slider' + i + '_' + k +'_img"/> <label for="addon_slider' + i + '_' + k + '_img"></label>';
                let text_inputs = '<input class="addon_slider__radio" type="radio" value="' + k + '" name="addon_slider' + i + '_img" id="addon_slider' + i + '_' + k +'_img"/>';
                object_sliders_input.innerHTML += text_inputs;          // добавить 
                let text_label = '<label for="addon_slider' + i + '_' + k + '_img" class="addon_slider__radio-label" tabindex="0"></label>';
                object_sliders_input.innerHTML += text_label; 
            }
        }
    }
}

function init_sleders_radio(DOM_obj) {                                    // активирует первый слаид в каждом слайдере
    for (let i=0; i < DOM_obj.length; i++) {  
        let object_radio = DOM_obj[i].children[1].children[0];            // переключалка
        let object_slide = DOM_obj[i].children[0].children[0];            // слаид
        if (object_radio != null) {
            object_radio.checked = true;                                // включаем первую переключалку
        }
        if (object_slide != null) {
            object_slide.classList.toggle("addon_slider__slide--active");    // включаем первый слаид
        }
    }
}

function label_on_enter(DOM_obj) {                                      // при выборе label и нажатии по нему enter
    let get_current_radio = DOM_obj.target.control;                     // определяем radio к которому он относится
    get_current_radio.checked = true;                                   // делаем этот radio фскивным
    update_active_slide(get_current_radio);                             // обновляем активный слаид
}

function init_active_slide(DOM_obj) {                         
    for (let i=0; i < DOM_obj.length; i++) {                              // перебор всех переключалок слайдеров
        DOM_obj[i].addEventListener('click', function (evt) {             // вешаем на них событие клик
            update_active_slide(evt.target);
        });
    }    
}

function update_active_slide(DOM_obj) {                                             // вызывается при нажатии на переключалку слайда
    let obj_radio = DOM_obj;                                                        // нажатый radio
    let obj_slides = obj_radio.parentElement.parentElement.children[0].children;    // контейнер слайдов (для этих radio)
    let old_radio_value = get_old_value(obj_slides);
    for (let i=0; i < obj_slides.length; i++) {
        obj_slides[i].classList.remove("addon_slider__slide--active");               // снять активные слайды
    }
    obj_slides[obj_radio.value].classList.add("addon_slider__slide--active");        // установить новый активный слаид
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

// узнаем индекс активного слайда в массиве.
function get_old_value (arry) {                                    
    for (let i = 0; i < arry.length; i++) {
        if (arry[i].className.indexOf("__slide--active") != -1) {
            return i;
        }
    }
    return false;
}

// удаляет из строки все кроме знака - и чисел, возвращает полученное число
// использовать конкретно под эту риализацию, тк сюда на вход приходит строка
// типа translateX(-100%) и не какие иные. тут может менятся только число
// и если добавится хоть 1 новый параметр то работа может стать не корректной
function string_to_number(str) {
    if (str == '') {
       return 0;
    } else {
       return Number(str.replace(/[^- ^0-9]/g,""));
    }
}

