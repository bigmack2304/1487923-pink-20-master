'use strict';

const { boolean } = require("yargs");

// запуск скрипта в node.js, ввести в терминале   (   node .\source\js\index.js    )

// менеджер ошибок
class CustomErrEditor {

    static #err_stak = []                                       // стек ошибок
    static #alert_enable = false                                 // вызов всплывающего окна в браузере при обработке ошибки (alert)

    constructor({type = "test_err", duble = true, file = "", info = ""} = {}) {            // конструктор
	
		const add_obj_to_stack = () => {
			CustomErrEditor.#err_stak.push({ type: type,        // создаем обьект ошибки и закидываем его в private static массив
											 file: file,
                                             info: info });
		}
	
        if (duble === true) {                                   // если дублирование разрешено
            add_obj_to_stack();
        } else if (duble === false) {                           // если дублирование запрещено
            const check_dublicat = () => {
                for (let elem of CustomErrEditor.#err_stak) {
                    if (elem.type == type) {
                        return true;
                    }
                }
                return false;
            }

            if (!check_dublicat()) {
                add_obj_to_stack();  
            }
        }
    }

    static #print_err(obj) {                                    // обработчик ошибки, на вход поступает обьект ошибки
        let Read_file = obj.file;                               // читаем поле с описанием проблемного места

        if (typeof(Read_file) == "object") {                    // если это обьект
            if (Read_file.stack?.indexOf("Error") == 0) {       // проверим что у него есть поле stack и в нем в начале есть "Error"
                Read_file = Read_file.stack                     // значит мы использовали file: new Error() при создании ошибки, получаем доступ к строке
                                            .split('\n')                      // разбить строку на массив, по разделителю "\n"
                                            .map((item, index, array) => {    // вызываем функцию для каждого элемента
                                                if (index <= 4) {             // так мы ограничиваем отображаемый стек вызовов, не более 4
                                                  return (index == 1) ? (`${item.trim()}`) : (`\t\t${item.trim()}`);    // добавлю пару табуляций в начале для красоты
                                                }
                                            });
                Read_file = Read_file
                                    .slice(1)
                                    .join('\n')
                                    .trim();   // вернуть копию массива с позиции 1 (без ячейки с "error") и конвертировать его в строку, с разделителем "\n", удалить пробелы в начале и в конце
            }
        }
        // генерим текст сообщения
        const gen_desc = '\t' + "Type:\t" + obj.type + '\n\n\t' + "File:\t" + Read_file + '\n\n\t' + "Info:\t" + obj.info;
        console.error("ERROR\n" + gen_desc + "\n");                    // выкидываем его в консоль
        if (CustomErrEditor.#alert_enable) {                    // если разрешен alert
            alert("ERROR: " + obj.info);                        // делаем alert с основной информацией
        }
    }

    static get_error_info(need_type = "test_err", func = CustomErrEditor.#print_err) {       // обработка ошибок нужного типа, вункция обработчика
        let err_index_del = [];                                                 // хранит индексы обработанных ошибок

        CustomErrEditor.#err_stak.forEach((elem) => {                           // обходим стек ошибок, ищим ошибки указанного типа
            if (elem.type == need_type) {                                       // если тип совпал
                func(elem);                               // обрабатываем эту ошибку
                err_index_del.push(CustomErrEditor.#err_stak.indexOf(elem));    // запоменаем индекс этой ошибки в стеке
            }
        });

        if (err_index_del.length != 0) {                                        // если у нас есть обработанные ошибки
            while (err_index_del.length != 0) {                                 // начинаем извлекать индексы ошибок с конца массива,
                CustomErrEditor.#err_stak.splice(err_index_del.pop(), 1);       // таким образом, удаляя из стека обработанные ошибки
            }                                                                   // из конца к началу. (тк при удалении элемента из массива, у всех
                                                                                // элементов следующих за ним сбивается индекс)
            return true;                                        // по завершению возвращаем true
        }
        return false;                                           // если не обработали не одной ошибки, вернем false
    }

    static get_AllError_info(func = CustomErrEditor.#print_err) {
        if (CustomErrEditor.#err_stak.length != 0) {
            CustomErrEditor.#err_stak.forEach((elem) => { 
                func(elem);
            });

            CustomErrEditor.#err_stak.splice(0, CustomErrEditor.#err_stak.length);
            return true;
        }
        return false;
    }

    static set_alert_mode(mode = true) {                        // можно включить или выключить alert при обработке ошибки
        CustomErrEditor.#alert_enable = boolean(mode);
    }
}

// возвращает полного клона обьекта, с учетом вложенности
Object.create_copy_dep = function(obj = {}) {
    let obj_temp = {};

    for (let elem in obj) {
        if (typeof(obj[elem]) === "object") {
            obj_temp[elem] = Object.create_copy_dep(obj[elem]);
            continue;
        }
        obj_temp[elem] = obj[elem];
    }

    return obj_temp;
};

// пишет в консоль тип данных и значение value
function addon_console(value) {
    console.log(`${addon_typeOf(value)}: ${value};`);
}

// возвращает тип данных элемента
function addon_typeOf(element) {
    if (Array.isArray(element)) { return "array";}
    return typeof(element);
}

// этой функцией я проверю что мы запускаем скрипт в браузере
// в браузере есть глобальный обьект window, в node его нет
function is_window() {
    return (typeof(window) === "undefined") ? (false) : (true);
}

// в браузере есть глобальный обьект document, в node его нет
function is_document() {
    return (typeof(document) === "undefined") ? (false) : (true);
}

///////////////////////////////////////////////////
/*
new Worker не работает при обычной отладке, работает только на запущеном локальном
сервере. Также должен работать на обычном сервере.

// запуск воркера (запуск js скрипта в отдельном потоке)
let nagruzka_thread = new Worker("js/test_worker.js");     

// Получение сообщений, переданных при вызовах postMessage() в веб-воркере
nagruzka_thread.onmessage = (evt) => {
    console.log(evt.data);
}

// Передача данных веб-воркеру
nagruzka_thread.postMessage("123456789");
*/

let arry_data = { p1: null, p2: null };

addon_console("-1");

if (is_window() && is_document()) {
    console.log("Start in browser");
    foo();
} else {
    console.log("Start in node");
}

function foo() {
    let nagruzka_thread = new Worker("js/test_worker.js");      // открываем воркер
    nagruzka_thread.postMessage({thread_start: true});          // разрешаем ему запуск (передаем туде обьект с нужным ключем)
    addon_console("thread start");

    nagruzka_thread.onmessage = (evt) => {                      // если воркер что-то вернет
        if (typeof(evt.data) == "object") {                     // проверяем что это обьект
            if ((evt.data.finished ?? false) === true) {        // проверяем что в нем есть ключ и он = true
                arry_data.p1 = evt.data.p1;                     // читаем данные из обьекта
                arry_data.p2 = evt.data.p2;
                addon_console(evt.data.msg);
                addon_console(Object.values(arry_data));
                nagruzka_thread.terminate();                    // закрыть воркер
            }
        }
    };

    nagruzka_thread.onerror = (evt) => {
        console.log(evt.message);
    };

    addon_console("-2");
}

addon_console(Object.values(arry_data));
addon_console("-3");
console.log('=============================')


function DeepMerge(...args) {
    let temp = null;

    const merge_arr_to_arr = (arr) => {
        temp = temp.concat(arr);
    };

    const merge_arr_to_obj = (arr) => {

    };

    const merge_obj = (key, val) => {
        temp[key] = val;
    };

    const temp_init = () => {
        if (addon_typeOf(args[0]) == "array") {
            temp = [];
        } else if (addon_typeOf(args[0]) == "object") {
            temp = {};
        }
    };

    temp_init();

    if (addon_typeOf(temp) == "array") {
        for (let elem of args) {
            if (addon_typeOf(elem) == "array") {
                merge_arr_to_arr(elem);

            } else if (addon_typeOf(elem) == "object") {
                merge_arr_to_arr(Object.entries(elem));
            }
        }
    } else if (addon_typeOf(temp) == "object") {
        for (let elem of args) {
            if (addon_typeOf(elem) == "object") {
                for (let obj_val in elem) {
                    merge_obj(obj_val, elem[obj_val]);
                }
            } else if (addon_typeOf(elem) == "array") {
                merge_arr_to_obj(elem);
            }
        }   
    }

    return temp;
}

////////////////////////////////////////////////////
// импорт функций для node_js тестов mocha

if (!is_window() && !is_document()) {
    module.exports = {
        DeepMerge: (typeof(DeepMerge) !== "null" && typeof(DeepMerge) !== "undefined") ? (DeepMerge) : (function () { return null; }),  //  защита от добавления несуществующей функции, если функции нет то будет использована функция затычка, которая вернет null
        CustomErrEditor: (typeof(CustomErrEditor) !== "null" && typeof(CustomErrEditor) !== "undefined") ? (CustomErrEditor) : (function () { return null; }),
    }
}