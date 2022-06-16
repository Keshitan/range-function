type NoneType = "None";

/**
 * This is just a class to make the instanceof operator discriminable.
 */
declare class RangeObject { }

export interface RangeObject<T> {
  (start: number | NoneType, stop: number | NoneType, step?: number | NoneType): RangeObject<T>;
  (index: number): number;
  start: number;
  stop: number;
  step: number;
}


interface range {
  new(start_or_length: number | boolean, stop: number | boolean, step: number | true): RangeObject<number>;
  (start_or_length: number | boolean, stop: number | boolean, step: number | true): RangeObject<number>;
}


/**
 * This function can be used like a range type, a kind of built-in type in Python.
 * 
 * @param start_or_length 
 * @param stop 
 * @param step 
 * @example
 * console.log(range(10))
 * //=> range(0, 10)
 * 
 * for (let r of range(3)) {
 *   console.log(r)
 * } //=> 0 1 2
 * 
 * [...range(4)]//=>[ 0, 1, 2, 3 ]
 * 
 * range(0, 10, 2)(1)//=> 2 (Number)
 * 
 * range(0, 10, 2)("None", "None", -1)
 * //=>range(8, -2, -2)
 * 
 * for (let r in range(5)) {
 *   // ...
 * }
 * //=>SyntaxError: You cannot use ... and 'for...in RangeObject'. 
 */
export function range(start_or_length: number | boolean, stop?: number | boolean, step?: number | true): RangeObject<number>;