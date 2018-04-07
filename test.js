const path = require('path');
const Viz = require('./lib');

let viz = new Viz({ module: path.resolve('./viz.module') });

viz.renderString('digraph { a -> b; }', { format: 'plain' }).then(console.log);
viz.renderJSONObject('digraph { a -> b; }').then(console.log);

let vizLite = new Viz({ module: path.resolve('./viz-lite.module') });

vizLite.renderString('digraph { a -> b; }', { format: 'plain' }).then(console.log);
vizLite.renderJSONObject('digraph { a -> b; }').then(console.log);
