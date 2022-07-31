'use strict';

/*

postMessage('Worker running');  // отсылаем сообщение от этого воркера туда где он создан

onmessage = (evt) => {          // срабатывает при полученом сообщении от основного потока
    console.log(evt.data);      // выводит полученное сообщение.
};

*/

function nagruzka() {
    for(let i=0; i<2519900909; i++) {
        i = i + 2 - 2;
    }

    postMessage({
                    p1: 228,
                    p2: "kek",
                    msg: "thread end",
                    finished: true
                });

}

onmessage = (evt) => {         
    if ( (evt.data.thread_start ?? false) === true) {
        setTimeout( () => { nagruzka(); }, 2000);
    }
};