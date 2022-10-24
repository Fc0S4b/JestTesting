// helpers functions para manejar setear trabajo antes de que corran los test y después de que se ejecuten

// Repeating setup

// si tienes algo de trabajo que se hace de forma repetida para muchos test puedes usar los hooks beforeEach y afterEach

// supongamos que tienes una función a ejecutar antes de un test llamada initializeCityDatabase() y otra función que se realiza después del test llamada clearCityDatabase(), entonces puedes usar los hooks:
beforeEach(() => {
  initializeCityDatabase();
});
// pueden manejar código asíncrono, puede tomar el parámetro done o return a promise
// beforeEach(() => {
//   return initializeCityDatabase(); //initializeCityDatabase retorna una promise que es resuelta cuando la dataBase es inicializada, entonces retornamos esa promise
// });

afterEach(() => {
  clearCityDatabase();
});

test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy();
});

test('city database has San Juan', () => {
  expect(isCity('San Juan')).toBeTruthy();
});

// One-Time Setup

// en algunos casos solo necesita realizar la configuración una vez, al principio de un archivo, esto puede ser molesto cuando la configuración es asíncrona por lo que no puede hacerlo inline, jest proporciona beforeAll y afterAll como hooks para manejar esta situación

// si initializeCityDatabse() y clearCityDatabase() devolvieran promesas, y la base de datos de la ciudad puediera reutilizarse entre pruebas, podríamos cambiar nuestro código de prueba a :

beforeAll(() => {
  return initializeCityDatabase();
});

afterAll(() => {
  return clearCityDatabase();
});

test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy();
});

test('city database has San Juan', () => {
  expect(isCity('San Juan')).toBeTruthy();
});

// Scope
// beforeAll y afterAll se aplican a todas las pruebas de un archivo de forma predeterminada, se puede agrupar pruebas usando un bloque "describe" para que solo beforeAll y afterAll se ejecuten dentro de ese bloque
// por ejemplo al tener dos bases de datos:
// Applies to all tests in this file

// este beforeEach se ejecutará antes que el beforeEach que está en el bloque describe
beforeEach(() => {
  return initializeCityDatabase();
});

test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy();
});

test('city database has San Juan', () => {
  expect(isCity('San Juan')).toBeTruthy();
});

describe('matching cities to foods', () => {
  // Applies only to tests in this describe block
  beforeEach(() => {
    return initializeFoodDatabase();
  });

  test('Vienna <3 veal', () => {
    expect(isValidCityFoodPair('Vienna', 'Wiener Schnitzel')).toBe(true);
  });

  test('San Juan <3 plantains', () => {
    expect(isValidCityFoodPair('San Juan', 'Mofongo')).toBe(true);
  });
});

// mira el orden de ejecución de todos los hooks
beforeAll(() => console.log('1 - beforeAll'));
afterAll(() => console.log('1 - afterAll'));
beforeEach(() => console.log('1 - beforeEach'));
afterEach(() => console.log('1 - afterEach'));

test('', () => console.log('1 - test'));

describe('Scoped / Nested block', () => {
  beforeAll(() => console.log('2 - beforeAll'));
  afterAll(() => console.log('2 - afterAll'));
  beforeEach(() => console.log('2 - beforeEach'));
  afterEach(() => console.log('2 - afterEach'));

  test('', () => console.log('2 - test'));
});

// 1 - beforeAll
// 1 - beforeEach
// 1 - test
// 1 - afterEach
// 2 - beforeAll
// 1 - beforeEach
// 2 - beforeEach
// 2 - test
// 2 - afterEach
// 1 - afterEach
// 2 - afterAll
// 1 - afterAll

// Order of Execution
// Jest ejecuta todos los controladores de describe en un archivo de prueba antes de ejecutar cualquiera de las pruebas reales. Esta es otra razón para configurar y desmontar el interior de los controladores before* y after* en lugar de hacerlo dentro de los bloques describe. Una vez que los describe están completos, por defecto, Jest ejecuta todas las pruebas en serie en el orden en que se encontraron en la fase de recopilación, esperando que cada una termine y se ordene antes de continuar

describe('describe outer', () => {
  console.log('describe outer-a');

  describe('describe inner 1', () => {
    console.log('describe inner 1');

    test('test 1', () => console.log('test 1'));
  });

  console.log('describe outer-b');

  test('test 2', () => console.log('test 2'));

  describe('describe inner 2', () => {
    console.log('describe inner 2');

    test('test 3', () => console.log('test 3'));
  });

  console.log('describe outer-c');
});

// describe outer-a
// describe inner 1
// describe outer-b
// describe inner 2
// describe outer-c
// test 1
// test 2
// test 3

// al igual que los bloques describe y test, Jest llama a los hooks before* y en el orden de declaración after*. Tenga en cuenta que los hooks after* del alcance envolvente se llaman primero. Por ejemplo, así es como puede configurar y desmanterlar recursos que dependen unos de otros

beforeEach(() => console.log('connection setup'));
beforeEach(() => console.log('database setup'));

afterEach(() => console.log('database teardown'));
afterEach(() => console.log('connection teardown'));

test('test 1', () => console.log('test 1'));

describe('extra', () => {
  beforeEach(() => console.log('extra database setup'));
  afterEach(() => console.log('extra database teardown'));

  test('test 2', () => console.log('test 2'));
});

// connection setup
// database setup
// test 1
// database teardown
// connection teardown

// connection setup
// database setup
// extra database setup
// test 2
// extra database teardown
// database teardown
// connection teardown

// usando jasmine2 como corredor de pruebas, el orden en que se ejecuta los after* cambia
beforeEach(() => console.log('connection setup'));
+afterEach(() => console.log('connection teardown'));

beforeEach(() => console.log('database setup'));
+afterEach(() => console.log('database teardown'));

-afterEach(() => console.log('database teardown'));
-afterEach(() => console.log('connection teardown'));

// consejos generales
// si una prueba falla se debe verificar primero si la prueba falla cuando es la única prueba que se ejecuta. Para ejecutar solo una prueba, cambie test a test.only
test.only('this will be the only test that runs', () => {
  expect(true).toBe(false);
});

test('this test will not run', () => {
  expect('A').toBe('A');
});

// Si tiene una prueba que a menudo falla cuando se ejecuta como parte de una suite mas grande pero no falla cuando la ejecuta solo, es una buena apuesta que algo de una prueba diferente está interfiriendo con esta. A menudo, puede solucionar esto borrando algún estado compartido con beforeEach. Si no está seguro de si se está modificando algún estado compartido, también puede probar uno beforeEach que registre datos.
