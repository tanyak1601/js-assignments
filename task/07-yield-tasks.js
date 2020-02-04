
/** ******************************************************************************************
 *                                                                                          *
 * Plese read the following tutorial before implementing tasks:                             *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield        *
 *                                                                                          *
 ****************************************************************************************** */


/**
 * Returns the lines sequence of "99 Bottles of Beer" song:
 *
 *  '99 bottles of beer on the wall, 99 bottles of beer.'
 *  'Take one down and pass it around, 98 bottles of beer on the wall.'
 *  '98 bottles of beer on the wall, 98 bottles of beer.'
 *  'Take one down and pass it around, 97 bottles of beer on the wall.'
 *  ...
 *  '1 bottle of beer on the wall, 1 bottle of beer.'
 *  'Take one down and pass it around, no more bottles of beer on the wall.'
 *  'No more bottles of beer on the wall, no more bottles of beer.'
 *  'Go to the store and buy some more, 99 bottles of beer on the wall.'
 *
 * See the full text at
 * http://99-bottles-of-beer.net/lyrics.html
 *
 * NOTE: Please try to complete this task faster then original song finished:
 * https://www.youtube.com/watch?v=Z7bmyjxJuVY   :)
 *
 *
 * @return {Iterable.<string>}
 *
 */
function* get99BottlesOfBeer() {
  let isSecond = false;
  let index = 99;
  while(index >= 0) {
    if (index > 2) {
      if (!isSecond) {
        isSecond = !isSecond;
        yield `${index} bottles of beer on the wall, ${index} bottles of beer.`;
      } else {
        isSecond = !isSecond;
        yield `Take one down and pass it around, ${--index} bottles of beer on the wall.`;
      }
    } else if (index === 2) {
      if (!isSecond) {
        isSecond = !isSecond;
        yield `${index} bottles of beer on the wall, ${index} bottles of beer.`;
      } else {
        isSecond = !isSecond;
        yield `Take one down and pass it around, ${--index} bottle of beer on the wall.`;
      }
    } else if (index === 1) {
      if (!isSecond) {
        isSecond = !isSecond;
        yield `${index} bottle of beer on the wall, ${index} bottle of beer.`;
      } else {
        isSecond = !isSecond;
        index--;
        yield `Take one down and pass it around, no more bottles of beer on the wall.`;
      }
    }  else {
      if (!isSecond) {
        isSecond = !isSecond;
        yield 'No more bottles of beer on the wall, no more bottles of beer.';
      } else {
        isSecond = !isSecond;
        index--;
        yield `Go to the store and buy some more, 99 bottles of beer on the wall.`;
      }
      
    }
  }
}


/**
 * Returns the Fibonacci sequence:
 *   0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, ...
 *
 * See more at: https://en.wikipedia.org/wiki/Fibonacci_number
 *
 * @return {Iterable.<number>}
 *
 */
function* getFibonacciSequence() {
  let a = -1;
  let b = 1;
  let c;

  while (true) {
    c = a + b;
    a = b;
    b = c;
    yield c;
  }
}


/**
 * Traverses a tree using the depth-first strategy
 * See details: https://en.wikipedia.org/wiki/Depth-first_search
 *
 * Each node have child nodes in node.children array.
 * The leaf nodes do not have 'children' property.
 *
 * @params {object} root the tree root
 * @return {Iterable.<object>} the sequence of all tree nodes in depth-first order
 * @example
 *
 *   var node1 = { n:1 }, node2 = { n:2 }, node3 = { n:3 }, node4 = { n:4 },
 *       node5 = { n:5 }, node6 = { n:6 }, node7 = { n:7 }, node8 = { n:8 };
 *   node1.children = [ node2, node6, node7 ];
 *   node2.children = [ node3, node4 ];
 *   node4.children = [ node5 ];
 *   node7.children = [ node8 ];
 *
 *     source tree (root = 1):
 *            1
 *          / | \
 *         2  6  7
 *        / \     \            =>    { 1, 2, 3, 4, 5, 6, 7, 8 }
 *       3   4     8
 *           |
 *           5
 *
 *  depthTraversalTree(node1) => node1, node2, node3, node4, node5, node6, node7, node8
 *
 */
function* depthTraversalTree(root) {
  const currRoots = [{children: [root], level: 0}];
 
  while(currRoots.length) {
    const currNode = currRoots[currRoots.length - 1];

    if(currNode.level === currNode.children.length) {
      currRoots.length--;
    } else {
      const item = currNode.children[currNode.level++];    
      yield item;

      if(item.children){
        currRoots.push({children: item.children, level: 0});
      }
    }
  }
}


/**
 * Traverses a tree using the breadth-first strategy
 * See details: https://en.wikipedia.org/wiki/Breadth-first_search
 *
 * Each node have child nodes in node.children array.
 * The leaf nodes do not have 'children' property.
 *
 * @params {object} root the tree root
 * @return {Iterable.<object>} the sequence of all tree nodes in breadth-first order
 * @example
 *     source tree (root = 1):
 *
 *            1
 *          / | \
 *         2  3  4
 *        / \     \            =>    { 1, 2, 3, 4, 5, 6, 7, 8 }
 *       5   6     7
 *           |
 *           8
 *
 */
function* breadthTraversalTree(root) {
  let nodes = [[root]];
    
  while(nodes.length) {
    const currLevel = nodes[0];
    const nextLevel = [];
    
    for (const node of currLevel) {
      if (node.children) {
        nextLevel.push(node.children);
      }
      yield node;
    }

    nodes = [];
    
    if (nextLevel.length) {
      nodes.push(nextLevel.flat());
    }  
  }
}


/**
 * Merges two yield-style sorted sequences into the one sorted sequence.
 * The result sequence consists of sorted items from source iterators.
 *
 * @params {Iterable.<number>} source1
 * @params {Iterable.<number>} source2
 * @return {Iterable.<number>} the merged sorted sequence
 *
 * @example
 *   [ 1, 3, 5, ... ], [2, 4, 6, ... ]  => [ 1, 2, 3, 4, 5, 6, ... ]
 *   [ 0 ], [ 2, 4, 6, ... ]  => [ 0, 2, 4, 6, ... ]
 *   [ 1, 3, 5, ... ], [ -1 ] => [ -1, 1, 3, 5, ...]
 */
function* mergeSortedSequences(source1, source2) {
  const it1 = source1();
  const it2 = source2();
  let item1 = it1.next();
  let item2 = it2.next();
  let value1 = item1.value;
  let value2 = item2.value;

  while (true) {
    if (item1.done) {
      value1 = value2 + 1;
    }

    if (item2.done) {
      value2 = value1 + 1;
    }
    
    if (value1 < value2) {
      yield value1;

      if (item1.done === false) {
        item1 = it1.next();
        if (item1.value) {
          value1 = item1.value;
        }
      }
    } else {
      yield value2;

      if (item2.done === false) {
        item2 = it2.next();
        if (item2.value) {
          value2 = item2.value;
        }
      }
    }
  }
}

module.exports = {
  get99BottlesOfBeer: get99BottlesOfBeer,
  getFibonacciSequence: getFibonacciSequence,
  depthTraversalTree: depthTraversalTree,
  breadthTraversalTree: breadthTraversalTree,
  mergeSortedSequences: mergeSortedSequences
};
