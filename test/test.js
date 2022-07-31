"use strict";

/*
 запустить тесты 
    npm test
*/

let assert = require('assert');

describe('index.js сложение обьектов и массивов', function () {
  const indexJs_DepMerge = require('../source/js/index.js').DeepMerge;

  it("обьект + обьект", () => {
    assert.deepStrictEqual(indexJs_DepMerge({ a: 1, b: 2 }, { c: 3, d: 4 }), { a: 1, b: 2, c: 3, d: 4 });
  });

  it("обьект + массив + обьект", () => {
    assert.deepStrictEqual(indexJs_DepMerge({ a: 1, b: 2 }, [3, 4], { c: 5, d: 6 }), { a: 1, b: 2, c: 5, d: 6 });
  });

  it("массив + массив", () => {
    assert.deepStrictEqual(indexJs_DepMerge([1, 2, 3], [4, 5, 6]), [1, 2, 3, 4, 5, 6]);
  });

  it("массив + обьект + массив", () => {
    assert.deepStrictEqual(indexJs_DepMerge([1, 2, 3], { a: 4, b: 5 }, [6, 7]), [1, 2, 3, ['a', 4], ['b', 5], 6, 7]);
  });
});

describe('index.js кастомный менеджер ошибок', function () {
  const indexJs_CustomErrorEditor = require('../source/js/index.js').CustomErrEditor;

  it("работа менеджера ошибок 1", () => {
    new indexJs_CustomErrorEditor({type: 12, file: "12", info: "12"});
    assert.equal( indexJs_CustomErrorEditor.get_error_info(12, function(){}) , true );
  });

  it("работа менеджера ошибок 2", () => {
    let val_test = null;
    
    const func_forTest = function(obj) {
      val_test = Object.assign({}, obj);
    };

    new indexJs_CustomErrorEditor({type: 12, file: "12", info: "12"});
    indexJs_CustomErrorEditor.get_error_info(12, func_forTest);

    assert.deepStrictEqual( val_test , {type: 12, file: "12", info: "12"} );
  });

});









console.log('---------------------------------------------------------------------------------------------------------');