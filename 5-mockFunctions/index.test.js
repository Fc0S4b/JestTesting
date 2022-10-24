// Mock functions: Funciones simuladas


// sirven para probar los enlaces entre códigos, borrando la implementación real de una función, capturando callbacks y sus parámetros, capturando instancias de constructores (cuando se usa new) y permitiendo la configuración en tiempo de prueba de valores de retorno
// dos formas de hacerlo: creando una mock function para usar el código de test o escribiendo una manual mock para anular la dependencia de un módulo

// usando una mock function

// imaginemos que estamos probando una implementación de una función forEach, que invoca una devolución de llamada para cada elemento en una matriz proporcionada

function forEach(items, callback) {
  for (let index = 0; index < items.length; index++) {
    callback(items[index]);
  }
}

// Para probar esta función, podemos usar una función simulada e inspeccionar el estado del simulacro para asegurarnos de que la devolución de llamada se invoque como se esperaba

const mockCallback = jest.fn((x) => 42 + x);
forEach([0, 1], mockCallback);

// The mock function is called twice
expect(mockCallback.mock.calls.length).toBe(2);

// The first argument of the first call to the function was 0
expect(mockCallback.mock.calls[0][0]).toBe(0);

// The first argument of the second call to the function was 1
expect(mockCallback.mock.calls[1][0]).toBe(1);

// The return value of the first call to the function was 42
expect(mockCallback.mock.results[0].value).toBe(42);

// propiedad .mock
// Todas las funciones simuladas tiene esta propiedad .mock que es donde se guardan los datos sobre como se ha llamado a la función y que devolvió la función. La propiedad .mock también rastrea el valor de this para cada llamada, por lo que también es posible inspeccionar esto:
const myMock1 = jest.fn();
const a = new myMock1();
// instancias
console.log(myMock1.mock.instances);
// > [ <a> ]

const myMock2 = jest.fn();
const b = {};
const bound = myMock2.bind(b);
bound();
// revisar contextos (a que está sujeto el this)
console.log(myMock2.mock.contexts);
// > [ <b> ]

// Estos miembros simulados son muy útiles en las pruebas para afirmar como se llama a estas funciones, se crean instancias o lo que devuelven:
// The function was called exactly once
expect(someMockFunction.mock.calls.length).toBe(1);

// The first arg of the first call to the function was 'first arg'
expect(someMockFunction.mock.calls[0][0]).toBe('first arg');

// The second arg of the first call to the function was 'second arg'
expect(someMockFunction.mock.calls[0][1]).toBe('second arg');

// The return value of the first call to the function was 'return value'
expect(someMockFunction.mock.results[0].value).toBe('return value');

// The function was called with a certain `this` context: the `element` object.
expect(someMockFunction.mock.contexts[0]).toBe(element);

// This function was instantiated exactly twice
expect(someMockFunction.mock.instances.length).toBe(2);

// The object returned by the first instantiation of this function
// had a `name` property whose value was set to 'test'
expect(someMockFunction.mock.instances[0].name).toBe('test');

// The first argument of the last call to the function was 'test'
expect(someMockFunction.mock.lastCall[0]).toBe('test');


// Mock Return values
// las funciones simuladas también se pueden usar para inyectar valores de prueba en su código durante una prueba:
const myMock = jest.fn();
console.log(myMock());
// > undefined

myMock.mockReturnValueOnce(10).mockReturnValueOnce('x').mockReturnValue(true);

console.log(myMock(), myMock(), myMock(), myMock());
// > 10, 'x', true, true

// las funciones simuladas también son muy efectivas en el código que usa un estilo funcional de paso de continuación. El código escrito en este estilo ayuda a evitar la necesidad de stubs complicados que recrean el comportamiento del componente real que representan, a favor de inyectar valores directamente en la prueba justo antes de que se usen
const filterTestFn = jest.fn();

// Make the mock return `true` for the first call,
// and `false` for the second call
filterTestFn.mockReturnValueOnce(true).mockReturnValueOnce(false);

const result = [11, 12].filter(num => filterTestFn(num));

console.log(result);
// > [11]
console.log(filterTestFn.mock.calls[0][0]); // 11
console.log(filterTestFn.mock.calls[1][0]); // 12

// Mocking modules
// Supongamos que tenemos una clase que obtiene usuarios de nuestra API. La clase usa axios para llamar a la API y luego devuelve el atributo data que contiene a todos los usuarios

import axios from 'axios';

class Users {
  static all() {
    return axios.get('/users.json').then((resp) => resp.data);
  }
}

export default Users;
// para crear pruebas sin tocar la API, pruebas lentas y frágiles, podemos usar jest.mock(...) para simular automáticamente el módulo de axios
// Podemos proporcionar mockResolvedValue para .get que devuelve los datos contra los que queremos que se afirme nuestra prueba. En efecto, estamos diciendo que queremos axios.get('/users.json') devuelva una respuesta falsa
 import axios from 'axios';
 import Users from './users';

 jest.mock('axios');

 test('should fetch users', () => {
   const users = [{ name: 'Bob' }];
   const resp = { data: users };
   axios.get.mockResolvedValue(resp);

   // or you could use the following depending on your use case:
   // axios.get.mockImplementation(() => Promise.resolve(resp))

   return Users.all().then((data) => expect(data).toEqual(users));
 });

//  Mocking Parcials
// Los subconjuntos de un módulo se pueden simular y el resto del módulo puede mantener su implementación real:

// en archivo foo-bar-baz.js
export const foo = 'foo';
export const bar = () => 'bar';
export default () => 'baz';

//test.js
import defaultExport, {bar, foo} from '../foo-bar-baz';

jest.mock('../foo-bar-baz', () => {
  const originalModule = jest.requireActual('../foo-bar-baz');

  //Mock the default export and named export 'foo'
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => 'mocked baz'),
    foo: 'mocked foo',
  };
});

test('should do a partial mock', () => {
  const defaultExportResult = defaultExport();
  expect(defaultExportResult).toBe('mocked baz');
  expect(defaultExport).toHaveBeenCalled();

  expect(foo).toBe('mocked foo');
  expect(bar()).toBe('bar');
});

// Mock implementations
// ir más alla de especificar valores de retorno y reemplazar completamente la implementación de una función simulada: se puede  hacer con jest.fn o mockImplementationOne como método en funciones simuladas:
const myMockFn = jest.fn(cb => cb(null, true));

myMockFn((err, val) => console.log(val));
// > true

// el método mockImplementatio es útil cuando necesita definir la implementación predeterminada de una función simulada que se crea a partir de otro módulo:

// otro módulo 
module.exports = function () {
  // some implementation;
};

// prueba.js
jest.mock('../foo'); // this happens automatically with automocking
const foo = require('../foo');

// foo is a mock function
foo.mockImplementation(() => 42);
foo();
// > 42

// mockImplementationOne para producir múltiples llamadas con resultados diferentes
const myMockFn = jest
  .fn()
  .mockImplementationOnce(cb => cb(null, true))
  .mockImplementationOnce(cb => cb(null, false));

myMockFn((err, val) => console.log(val));
// > true

myMockFn((err, val) => console.log(val));
// > false

// si no hay implementaciones definidas, entonces por default se implementará jest.fn si está definida
const myMockFn = jest
  .fn(() => 'default')
  .mockImplementationOnce(() => 'first call')
  .mockImplementationOnce(() => 'second call');

console.log(myMockFn(), myMockFn(), myMockFn(), myMockFn());
// > 'first call', 'second call', 'default', 'default'

// para métodos encadenados (return this) con .mokeReturnThis()
const myObj = {
  myMethod: jest.fn().mockReturnThis(),
};

// is the same as

const otherObj = {
  myMethod: jest.fn(function () {
    return this;
  }),
};

// Mock Names

// colócale nombre personalizado a la función simulada (en vez de jest.fn()), usa .mockName()

const myMockFn = jest
  .fn()
  .mockReturnValue('default')
  .mockImplementation(scalar => 42 + scalar)
  .mockName('add42');

  // Custom Matchers

  // algunos trucazos dados por Jest para funciones simuladas con matchers

  // The mock function was called at least once
expect(mockFunc).toHaveBeenCalled();

// The mock function was called at least once with the specified args
expect(mockFunc).toHaveBeenCalledWith(arg1, arg2);

// The last call to the mock function was called with the specified args
expect(mockFunc).toHaveBeenLastCalledWith(arg1, arg2);

// All calls and the name of the mock is written as a snapshot
expect(mockFunc).toMatchSnapshot();

// algo más específico
// The mock function was called at least once
expect(mockFunc.mock.calls.length).toBeGreaterThan(0);

// The mock function was called at least once with the specified args
expect(mockFunc.mock.calls).toContainEqual([arg1, arg2]);

// The last call to the mock function was called with the specified args
expect(mockFunc.mock.calls[mockFunc.mock.calls.length - 1]).toEqual([
  arg1,
  arg2,
]);

// The first arg of the last call to the mock function was `42`
// (note that there is no sugar helper for this specific of an assertion)
expect(mockFunc.mock.calls[mockFunc.mock.calls.length - 1][0]).toBe(42);

// A snapshot will check that a mock was invoked the same number of times,
// in the same order, with the same arguments. It will also assert on the name.
expect(mockFunc.mock.calls).toEqual([[arg1, arg2]]);
expect(mockFunc.getMockName()).toBe('a mock name');