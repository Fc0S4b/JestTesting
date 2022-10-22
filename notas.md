### instalar jest

```
npm install --save-dev jest

```

### instalar jest global

```
npm install jest --global

```

### instalar node-notifier

```
npm install --save node-notifier

```

luego ejecuta el test

```
jest <nombreDelArchivoATestear> --notify
```

### crear archivo de configuración jest

```
jest --init

```

si escoges jsdom como enviroment, debes instalarlo aparte

### instalar enviroment jsdom

```
npm install -D jest-environment-jsdom

```

si usas babel

### instalar babel-jest

```
npm install --save-dev babel-jest @babel/core @babel/preset-env
```

### crear archivo de configuración en root babel.config.js

```
module.exports = {
  presets: [['@babel/preset-env', {targets: {node: 'current'}}]],
};
```
