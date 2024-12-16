const TrieSearch = require('trie-search');
const trieRoot = require('./trie.json');
const trieDataset = require('./dataset.json');

const trieSearch = new TrieSearch('title');
trieSearch.root = trieRoot;

module.exports = { trieSearch, trieDataset };