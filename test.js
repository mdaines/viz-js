const Viz = require('./viz.js');
let viz = new Viz({ module: './viz.module' });

viz.renderString('digraph { a -> b; }', { format: 'plain' }).then(console.log);
viz.renderJSONObject('digraph { a -> b; }').then(console.log);

let vizLite = new Viz({ module: './viz-lite.module' });

vizLite.renderString('digraph { a -> b; }', { format: 'plain' }).then(console.log);
vizLite.renderJSONObject('digraph { a -> b; }').then(console.log);
