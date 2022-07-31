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

    <div class="addon_slider__buttons">
        <!-- контейнер для кнопок переключения -->
        <!-- сюда автоматически добавляются кнопки для переключения слайдов -->
        <!-- <button name="sl_btn(индекс слайдера)(индекс кнопки)" value="(индекс кнопки 0-лево 1-право)" class="addon_slider__button"></button> -->
    </div>
  </div>

*/

// проверяет обьекты возвращаемые от getElementsByClassName
// если там есть хоть 1 элемент, вернет true
const is_object_valid = (obj) => {
    return (obj.length != 0) ? (true) : (false);
}

function evt_lstr_keydown_radio_label(evt) {        // EventListener если мы ткнули ентером по лейблу радио
    if (evt.code == 'Enter') {
        label_on_enter(evt);           
    }
}

function evt_lstr_click_radio(evt) {                // EventListener если мы ткнули мышью по лейблу радио
    update_active_slide(evt.target);
}

function evt_lstr_click_btn(evt) {                  // EventListener если мы нажали на кнопку
    slider_btn_on_klick(evt.target);
}

// после загрузки страницы, начинаем обработку, ищим слайдеры
a_slider_init();

function a_slider_init() {
    const object_sliders = document.getElementsByClassName("js-addon_slider");
    if (is_object_valid(object_sliders)) {
        init_sliders(object_sliders);           //  добавляем переключалки к слайдерам
        init_sleders_radio(object_sliders);     //  активация первой переключалки и слайда в каждом слайдере
        init_sliders_buttons(object_sliders);   //  добавить кнопки в слайдер

        const obj_radio_label = document.getElementsByClassName("addon_slider__radio-label");
        if (is_object_valid(obj_radio_label)) {
            for (let i = 0; i < obj_radio_label.length; i++) {
                obj_radio_label[i].removeEventListener('keydown', evt_lstr_keydown_radio_label);
                obj_radio_label[i].addEventListener('keydown', evt_lstr_keydown_radio_label);
            }
        }

        const object_sliders_radio = document.getElementsByClassName("addon_slider__radio");
        if (is_object_valid(object_sliders_radio)) {
            init_active_slide(object_sliders_radio);    // вешаем на переключалки событие клик
        }

        const object_slider_btn = document.getElementsByClassName("addon_slider__button");
        if (is_object_valid(object_slider_btn)) {
            event_klick_for_btn(object_slider_btn);    // вешаем на кнопки событие клик
            first_upd_style_btn(object_sliders);       // вешаем на кнопку за которой нет слаидов, класс не активной
        }
    }
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
            if (rafio_amount == 1) {                                     // с одной кнопкой мы ничего не будем листать, не нужно ее создавать
                DOM_obj[i].children[1].style.display = "none";           // отключаем рендеринг для этого блока
                continue;
            } 
            
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
            object_slide.classList.add("addon_slider__slide--active");    // включаем первый слаид
        }
    }
}

function init_sliders_buttons(DOM_obj) {                                // добовление к слайдерам кнопок переключения (влево вправо)
    for (let i=0; i < DOM_obj.length; i++) {                 
        let object_slider_input_btn = DOM_obj[i].children[2]; 

        let slides_in_vieport = DOM_obj[i].children[0].children.length;                       // количество слайдов в вьюпорте слайдера
        let slide_width = DOM_obj[i].children[0].children[0].clientWidth;                     // ширина слайда
        let vieport_width = DOM_obj[i].children[0].clientWidth;                               // ширина вьюпорта ихного
        let slide_amount = slides_in_vieport / Math.floor((vieport_width / slide_width));     // сколько слайдов поместится в вьюпорт
        if (slide_amount == 1) {                                                              // если у нас все слайды влезают в вьюпорт то нету смысла добавлять кнопки
            object_slider_input_btn.style.display = "none";                                   // отключаем рендеринг для этого блока
            continue;
        }


        for (let k=0; k < 2; k++) {                                     // 2 раза вписываем кнопку
            let text_btn = '<button name="sl_btn' + i + k + '" value="' + k + '" class="addon_slider__button"></button>';
            object_slider_input_btn.innerHTML += text_btn;         
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
        DOM_obj[i].removeEventListener('click', evt_lstr_click_radio); 
        DOM_obj[i].addEventListener('click', evt_lstr_click_radio );      // вешаем на них событие клик
    }    
}

function event_klick_for_btn(DOM_obj) {
    for (let i=0; i < DOM_obj.length; i++) {  
        DOM_obj[i].removeEventListener('click', evt_lstr_click_btn);                           
        DOM_obj[i].addEventListener('click', evt_lstr_click_btn );          
    }   
}

function slider_btn_on_klick(DOM_obj) {                                     // действие при нажатии кнопки
    let X_mode = (DOM_obj.value == 0) ? ("left") : ("right");           // по value кнопки определяем куда нам нужно дыигать слайды
    let slide_list = DOM_obj.parentElement.parentElement.children[0].children;
    let input_div = DOM_obj.parentElement.parentElement.children[1].children;   // блок переключалок и лейблов

    // имитирует нажатие на следующий по направлению radio
    // тем самым двигая слаиды
    const upd_current_radio = () => {
        let start_index;
        for (let i=0; i < input_div.length; i++) {      // сперва снимаем checked c активноко radio
            if (input_div[i].classList.contains("addon_slider__radio")) {
                if (input_div[i].checked == true) {
                    input_div[i].checked = false;
                    start_index = i;                    // запоминаем индекс старого активного radio
                    break;
                }
            }
        }

        if (X_mode == "left") {                                                 // если направление сдвига в лево
            for (let i = (start_index - 1); i >= 0; i--) {                      // начиная с позиции предыдущего активного radio ваижемся по заданному направлению в массиве
                if (input_div[i].classList.contains("addon_slider__radio")) {   // если это radio (а у нас там есть еще и лейблы)
                    input_div[i].checked = true;                                // делаем его нажатым
                    update_active_slide(input_div[i]);                          // обновляем активный слайд
                    break;                                                      // завершаем цыкл
                }
            }
        } else if (X_mode == "right") {
            for (let i = (start_index + 1); i < input_div.length; i++) {
                if (input_div[i].classList.contains("addon_slider__radio")) {
                    input_div[i].checked = true;
                    update_active_slide(input_div[i]);
                    break;
                }
            }
        }
    }

    if (X_mode == "left") {                       // нажали кнопку в лево
        if (is_moved(X_mode,slide_list)) {                   // если можно сдвинуть слаиды в лево
            upd_current_radio();                  // двигаем
        }
    } else if (X_mode == "right") {
        if (is_moved(X_mode,slide_list)) {
            upd_current_radio();
        }
    }
    upd_btn_style(DOM_obj, slide_list);
}



// проверяет можноли сдвинуть слайды в заданном направлении
//      проверяет, естьли за активным слайдом не активный слаид
//      если да, то листать можно. 
//  !!!! Но это работает не правильно если
//      если у нас несколько слайдов в вьюпорте. Проверку нужно привязать к
//      radio эдементам
//          TODO пока не буду везде переделывать слайд-лист в контейнер радио
//          проще сдесь перейти из слайд листа в контейнер радио. 

function is_moved(mode, slide_list) {          
    const slider_input = slide_list[0].parentElement.parentElement.children[1].children;    // переходим из контейнера слайдеров в контейнер переключалок
    let is_old_radio = false;               // фдаг наличия радио сздаи, относительно текущего радио
    let is_next_radio = false;              // фдаг наличия радио спереди, относительно текущего радио

    for (let i=0; i < slider_input.length; i++) {
        if (mode == "left") {
            if (slider_input[i].classList.contains("addon_slider__radio")) {                           // это радио ?
                if (slider_input[i].checked ) {                                                        // он нажат ?
                    if (is_old_radio) {                                                                // до этого нам попадались радио элементы ?
                        return true;
                    } else {
                        return false;
                    }
                }
                is_old_radio = true;
            }
        } else if (mode == "right") {
            if (slider_input[i].classList.contains("addon_slider__radio")) {
                if (slider_input[i].checked ) {                                             // дошли до нажатого радио
                    for (let k = i+1; k < slider_input.length; k++) {                       // запомним, идем дельше
                        if (slider_input[k].classList.contains("addon_slider__radio")) {    //
                            is_next_radio = true;
                            break;
                        }
                    }
                    if (is_next_radio) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        }
    }
} 

// делаем кнопку полупрозрачноей, если дальше по ее направлению нету слайда
// принимает обьект кнопки и блок слайдеров этих кнопок (addon_slider__vieport)
function upd_btn_style(obj_btn,slide_list) {
    const btns = obj_btn.parentElement.children;
    for (let i=0; i < 2; i++) {
        btns[0].classList.remove("addon_slider__button--no_active")
        btns[1].classList.remove("addon_slider__button--no_active")

        if (!is_moved("left", slide_list)) {
            btns[0].classList.add("addon_slider__button--no_active")
        }
        if (!is_moved("right", slide_list)) {
            btns[1].classList.add("addon_slider__button--no_active")
        }
    }
}

// вызывается 1 раз при загрузке страницы
function first_upd_style_btn(sliders) {
    for (let i=0; i < sliders.length; i++) {
        let slide_list = sliders[i].children[0].children;
        let obj_btn = sliders[i].children[2].children[0];
        upd_btn_style(obj_btn,slide_list);
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
    upd_btn_style(obj_radio.parentElement.parentElement.children[2].children[0] ,obj_slides);   // обновим стиль неактивности для кнопок
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

/////////////////////////////////////////////////////////////////////////////