
/** ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    var r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
}

Rectangle.prototype.getArea = function() {
  return this.width * this.height;
};

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    var r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {
  return Object.setPrototypeOf(JSON.parse(json), proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class and
 * pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy and
 * implement the functionality
 * to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple, clear
 * and readable as possible.
 *
 * @example
 *
 *  var builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify() =>
 *    '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify() =>
 *    'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify() =>
 *      'div#main.container.draggable + table#data ~ tr:nth-of-type(even) td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
const proto = {
  element(value) {
    if (this.status.element > 0) {
      throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }

    if (this.status.order > 1) {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    this.status.element += 1;
    this.selector += value;
    return this;
  },

  id(value) {
    if (this.status.id > 0) {
      throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }

    if (this.status.order > 2) {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    this.status.id += 1;
    this.status.order = 2;
    this.selector += `#${value}`;
    return this;
  },

  class(value) {
    if (this.status.order > 3) {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    this.status.order = 3;
    this.selector += `.${value}`;
    return this;
  },

  attr(value) {
    if (this.status.order > 4) {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    this.status.order = 4;
    this.selector += `[${value}]`;
    return this;
  },

  pseudoClass(value) {
    if (this.status.order > 5) {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    this.status.order = 5;
    this.selector += `:${value}`;
    return this;
  },

  pseudoElement(value) {
    if (this.status.pseudo > 0) {
      throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }

    this.status.order = 6;
    this.status.pseudo += 1;
    this.selector += `::${value}`;
    return this;
  },

  combine(selector1, combinator, selector2) {
    this.selector = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return this;
  },

  stringify() {
    const str = this.selector;
    this.selector = '';
    return str;
  }
};

const cssSelectorBuilder = {

  element(value) {
    return Object.setPrototypeOf({ selector: value, status: { element: 1, order: 1 } }, proto);
  },

  id(value) {
    return Object.setPrototypeOf({ selector: `#${value}`, status: { id: 1, order: 2 } }, proto);
  },

  class(value) {
    return Object.setPrototypeOf({ selector: `.${value}`, status: { order: 3 } }, proto);
  },

  attr(value) {
    return Object.setPrototypeOf({ selector: `[${value}]`, status: { order: 4 } }, proto);
  },

  pseudoClass(value) {
    return Object.setPrototypeOf({ selector: `:${value}`, status: { order: 5 } }, proto);
  },

  pseudoElement(value) {
    return Object.setPrototypeOf({ selector: `::${value}`, status: { pseudo: 1, order: 6 } }, proto);
  },

  combine(selector1, combinator, selector2) {
    return proto.combine(selector1, combinator, selector2);
  }
};

module.exports = {
  Rectangle: Rectangle,
  getJSON: getJSON,
  fromJSON: fromJSON,
  cssSelectorBuilder: cssSelectorBuilder
};
