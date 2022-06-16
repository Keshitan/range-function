"use strict";

async function ensureArgsLength(...items) {
  if (items.length === 0) {
    throw new TypeError(`range expected at least 1 argument, got 0`);
  } else if (items.length > 3) {
    throw new TypeError(`range expected at most 3 arguments, got ${items.length}`);
  }
}

async function ensureAllSafeInteger(...items) {
  const BaseStr = (type) => `'${type}' cannot be interpreted as a safe integer`;
  let type;
  for (const item of items) {
    type = typeof item;
    if (type === "boolean" || Number.isSafeInteger(item)) {
      continue;
    } else if (type === "number") {
      throw new TypeError(BaseStr("Non-SafeInteger"));
    } else {
      throw new TypeError(BaseStr(type));
    }
  }
}

async function ensureRangeThirdArg(...items) {
  if (items[2] === 0) {
    class ValueError extends Error {
      constructor(text) {
        super(text);
        this.message = text;
        this.name = "ValueError";
      }
    }
    throw new ValueError("range() arg 3 must not be zero");
  }
}


/* */

async function ensureSyntax(...items) {
  if (items.length === 0 || items.length > 3) {
    throw new SyntaxError("invalid syntax");
  }
}

async function ensureCorrectType(...items) {

  if (items.length === 1) {
    const BaseStr = (type) => `range indices must be safe integers, not ${type}`;
    const item = items[0];
    let type = typeof item;

    if (type === "boolean" || Number.isSafeInteger(item)) {
    } else if (type === "number") {
      throw new TypeError(BaseStr("Non-SafeInteger"));
    } else if (item === "None") {
      throw new TypeError(BaseStr("NoneType"));
    } else {
      throw new TypeError(BaseStr(type));
    }

  } else if (items.length >= 2) {
    const text = `slice indices must be safe integers or None`;
    const error = new TypeError(text);
    let type;

    for (const item of items) {
      type = typeof item;
      if (type === "boolean" || Number.isSafeInteger(item) || item === "None") {
        continue;
      } else {
        throw error;
      }
    }
  }
}


async function ensureSliceThirdArg(...items) {
  if (items[2] === 0) {
    class ValueError extends Error {
      constructor(text) {
        super(text);
        this.message = text;
        this.name = "ValueError";
      }
    }
    throw new ValueError("slice step cannot be zero");
  }
}


class RangeFunctionError {

  static async validateConstructorArgs(...items) {
    await ensureArgsLength(...items);
    await ensureAllSafeInteger(...items);
    await ensureRangeThirdArg(...items);
  }

  static async validateRangeObjectArgs(...items) {
    await ensureSyntax(...items);
    await ensureCorrectType(...items);
    await ensureSliceThirdArg(...items);
  }

  static async validateRangeIndex(index, length) {
    const isOutOfRange = (_x) => {
      if (_x >= 0) {
        return _x >= length;
      } else { // _x < 0
        return _x < -length;
      }
    }
    if (isOutOfRange(index)) {

      class IndexError extends Error {
        constructor(text) {
          super(text);
          this.message = text;
          this.name = "IndexError";
        }
      }

      throw new IndexError("range object index out of range");
    }

  }
}

exports.RangeFunctionError = RangeFunctionError;