import findInTree from './findInTree';

export default (tree, filter) =>
  findInTree(tree, filter, {
    walkable: [ 'props', 'children', 'child', 'sibling' ]
  });
