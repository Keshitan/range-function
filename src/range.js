/* Node.js側で解釈可能なシンボル */
const customInspectSymbol = Symbol.for('nodejs.util.inspect.custom');

/* require */
const { RangeFunctionError } = require("./error");

/* range関数の定義 */
function range(start, stop, step = 1) {
  /* range関数が要素を持つ条件 */
  const condition = (start, stop, step, currentValue) => {
    let direction = (stop - start > 0 && step > 0) || (stop - start < 0 && step < 0); // stepと向きが一致することが条件
    let within = (start < stop ? start <= currentValue && currentValue < stop : stop < currentValue && currentValue <= start); // 終端を含まず
    return direction && within;
  }

  /* エラーチェック */
  RangeFunctionError.validateConstructorArgs(...arguments);

  /* 引数が１つの場合の処理 */
  if (arguments.length === 1) {
    stop = Number(start);
    start = 0;
  }

  /* for...ofで参照するイテレータの定義 */
  function* iterator() {
    for (let cV = start; condition(start, stop, step, cV); cV += step) {
      yield cV;
    }
    yield* [];
  }

  /* new RangeObject で関数として返すためにfunction宣言 */
  function RangeObject(_start, _stop = "None", _step = "None") {


    if (new.target) {

      /* 属性statr,stop,step の付与 */
      Object.defineProperty(RangeObject, "start", { value: _start, writable: false, enumerable: false, configurable: false });
      Object.defineProperty(RangeObject, "stop", { value: _stop, writable: false, enumerable: false, configurable: false });
      Object.defineProperty(RangeObject, "step", { value: _step, writable: false, enumerable: false, configurable: false });

      /* イテレータ */
      RangeObject[Symbol.iterator] = iterator;

      /* Node.jsで解釈可能なシンボル */
      RangeObject[customInspectSymbol] = () => {
        if (RangeObject.step === 1) {
          return `${'\u001b[36m'}range(${RangeObject.start}, ${RangeObject.stop})${"\u001b[0m"}`
        } else {
          return `${'\u001b[36m'}range(${RangeObject.start}, ${RangeObject.stop}, ${RangeObject.step})${"\u001b[0m"}`
        }
      }

      /* 定数の宣言 */
      const LENGTH = (() => {
        const result = Math.ceil((RangeObject.stop - RangeObject.start) / RangeObject.step);
        return (result >= 0 ? result : 0)
      })();
      const ValueOfLastIndex = RangeObject.start + RangeObject.step * (LENGTH - 1);

      /* propの絞り込み条件（数で解釈可能で空文字を含まない） */
      const ProxyConditon = (item) => {
        if (isNaN(item)) {
          return false;
        } else {
          if (item === "") {
            return false;
          } else {
            return true;
          }
        }
      }

      /* RangeObjectの挙動を定義 */
      RangeObject = new Proxy(RangeObject, {
        has: function (target, prop) {
          if (ProxyConditon(prop) && LENGTH > 0) {
            prop = Number(prop);
            if (target.start < target.stop) { // 4 7 10 (13    4      start+step*n = prop // (prop -start)%step === 0
              return (target.start <= prop && prop < target.stop ? (prop - target.start) % target.step === 0 : false);
            } else {
              return (target.stop < prop && prop <= target.start ? (prop - target.start) % target.step === 0 : false);
            }
          } else {
            return false;
          }
        },
        get: function (target, prop) {
          if (prop === 'start' || prop === "stop" || prop === "step" || prop === "name") {
            return target[prop];
          } else if (prop === Symbol.iterator) {
            return target[Symbol.iterator];
          } else {
            let text =
              `Warning: Deprecated operation; Access to RangeObject is limited to 
              'start', 'stop', and 'step' only.`;
            console.log(text);
            return undefined;
          }
        },
        set: function () {
          let text =
            `Warning: You cannot set property to RangeObject.`;
          console.log(text);
          return false;
        },
        getOwnPropertyDescriptor: function () {
          let text = `You cannot use 'getOwnPropertyDescriptor(RangeObject...)' and 'for...in RangeObject'.`;
          throw new SyntaxError(text);
        }
      });

      /* new呼び出し時は（色々付与した）関数自身が返る */
      return RangeObject;

    } else {

      /* エラーチェック */
      RangeFunctionError.validateRangeObjectArgs(...arguments);

      /* 定数（共通） */
      const LENGTH = (() => {
        const result = Math.ceil((RangeObject.stop - RangeObject.start) / RangeObject.step);
        return (result >= 0 ? result : 0)
      })();

      /* util（共通） */
      const isOutOfRange = (_x) => {
        if (_x >= 0) {
          return _x >= LENGTH;
        } else { // _x < 0
          return _x < -LENGTH;
        }
      }

      if (arguments.length === 1) {

        /* エラーチェック */
        RangeFunctionError.validateRangeIndex(_start, LENGTH);

        /* 返り値は要素 */
        return (_start >= 0 ? RangeObject.start + RangeObject.step * _start : RangeObject.start + RangeObject.step * (LENGTH + _start));

      } else {
        /* 定数 */
        const ValueOfLastIndex = RangeObject.start + RangeObject.step * (LENGTH - 1);

        /* 引数の解釈をする関数の定義 */
        function adapt() {
          if (LENGTH > 0) {
            if (_step === "None" || _step > 0) {
              _start = (() => {
                if (_start === "None") {
                  return RangeObject.start;
                } else if (isOutOfRange(_start)) {
                  return (_start > 0 ? ValueOfLastIndex + RangeObject.step : RangeObject.start);
                } else {
                  return (_start >= 0 ? RangeObject.start + RangeObject.step * _start : ValueOfLastIndex + RangeObject.step * (1 + _start));
                }
              })();

              _stop = (() => {
                if (_stop === "None") {
                  return ValueOfLastIndex + RangeObject.step;
                } else if (isOutOfRange(_stop)) {
                  return (_stop > 0 ? ValueOfLastIndex + RangeObject.step : RangeObject.start);
                } else {
                  return (_stop >= 0 ? RangeObject.start + RangeObject.step * _stop : ValueOfLastIndex + RangeObject.step * (1 + _stop));
                }
              })();

            } else { // _step < 0

              _start = (() => {
                if (_start === "None") {
                  return ValueOfLastIndex;
                } else if (isOutOfRange(_start)) {
                  return (_start < 0 ? RangeObject.start - RangeObject.step : ValueOfLastIndex);
                } else {
                  return (_start >= 0 ? RangeObject.start + RangeObject.step * _start : ValueOfLastIndex + RangeObject.step * (1 + _start));
                }
              })();

              _stop = (() => {
                if (_stop === "None") {
                  return RangeObject.start - RangeObject.step;
                } else if (isOutOfRange(_stop)) {
                  return (_stop < 0 ? RangeObject.start - RangeObject.step : ValueOfLastIndex);
                } else {
                  return (_stop >= 0 ? RangeObject.start + RangeObject.step * _stop : ValueOfLastIndex + RangeObject.step * (1 + _stop));
                }
              })();
            }
          } else {
            if (_step === "None" || _step > 0) {
              _start = RangeObject.start;
              _stop = RangeObject.start;
            } else { // _step < 0
              _start = RangeObject.start - RangeObject.step;
              _stop = RangeObject.start - RangeObject.step;
            }
          }
        }

        /* 実行 */
        adapt();

        /* stepの変化は不変 */
        _step = (_step === "None" ? RangeObject.step : RangeObject.step * _step);

        /* new range により新たに生成（非破壊） */
        return new range(_start, _stop, _step);
      }
    }
  }


  /* 返り値はnew RangeObject(関数) */
  return new RangeObject(start, stop, step);
}



/* instanceof演算子 での確認用 */
class RangeObject {
  static [Symbol.hasInstance](instance) {
    if (instance.start || instance.stop || instance.step) {
      return instance.name === "RangeObject";
    } else {
      return false;
    }
  }
}


/* エクスポート */
exports.range = range;
exports.RangeObject = RangeObject