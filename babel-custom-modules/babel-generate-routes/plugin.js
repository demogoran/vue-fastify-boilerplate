var fs = require('fs');
module.exports = ({ types: t }) => {
    console.log("Trying to load");
    return {
        visitor: {
            TaggedTemplateExpression: function (path, state) {
                try {
                    let node = path.node;

                    if (t.isIdentifier(node.tag, { name: "generateRoute" })) {
                        const fileName = state.file.opts.filename;

                        if (!fileName || fileName.indexOf('Controller') < 0) {
                            return;
                        }

                        const apiPrefix = fileName
                            .toLowerCase()
                            .split('\\')
                            .pop()
                            .replace('controller', '')
                            .replace('.js', '');

                        const quasi = node.quasi.quasis[0];
                        console.log(quasi);
                        const producedPath = apiPrefix + quasi.value.raw;
                        quasi.raw = quasi.cooked = producedPath;
                        state._store.push(producedPath);
                        node.tag.name = '';

                        //return path.replaceWith(node.quasi);
                    }
                }
                catch (ex) {
                    console.log('Extracting error: ', ex);
                }
            },
            Program: {
                enter: function (path, state) {
                    state._store = state._store || []
                },
                exit: function (path, state) {
                    state.file.metadata._store = state._store
                    console.log('Store', state._store);
                    //fs.writeFileSync('test.js', JSON.stringify(state._store), 'utf8')
                }
            }
        }
    }
}