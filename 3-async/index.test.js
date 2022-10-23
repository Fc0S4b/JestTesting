// Promises, si la promise es rechazada entonces el test fallará
test('the data is peanut butter', () => {
  return fetchData().then((data) => {
    expect(data).toBe('peanut butter');
  });
});

// async / await
test('the data is peanut butter', async () => {
  const data = await fetchData();
  expect(data).toBe('peanut butter');
});

test('the fetch fails with an error', async () => {
  expect.assertions(1);
  try {
    await fetchData();
  } catch (e) {
    expect(e).toMatch('error');
  }
});

// combinar async/await con .resolves/.rejects

test('the data is peanut butter', async () => {
  await expect(fetchData()).resolves.toBe('peanut butter');
});
// asegúrate de retornar (o await) la promise, si lo omites el test se completará antes de que la promesa haya hecho return desde que se resuelva o rechaze fetchData

test('the fetch fails with an error', async () => {
  await expect(fetchData()).rejects.toMatch('error');
});

// si esperas que la promise sea rechazada usa .catch, asegúrate de usar expect.assertions para verificar que cierto números de aserciones son llamadas, de otra forma una promise fulfilled no fallará el test

test('the fetch fails with an error', () => {
  expect.assertions(1);
  return fetchData().catch((e) => expect(e).toMatch('error'));
});

// Callbacks
// si no usas promises usa callbacks, por ejemplo en vez de esperar una promise de fetchData, esperas una callback. Por ejemplo que llame a callback(null, data) cuando fetchData se completa. Acá esperas que la data sea 'peanut butter'

// el test será completado por default una vez que haya alcanzado el final de su ejecución, eso significa que el test no funcionará como pretende

// Don't do this!
test('the data is peanut butter', () => {
  function callback(error, data) {
    if (error) {
      throw error;
    }
    expect(data).toBe('peanut butter');
  }

  fetchData(callback);
});
//  la prueba se completará tan pronto como fetchData se complete antes de llamar a la devolución de llamada

// para solucionarlo, usa done como argumento, Jest esperará hasta que la callback de done sea llamada antes de finalizar la prueba
test('the data is peanut butter', (done) => {
  function callback(error, data) {
    if (error) {
      done(error);
      return;
    }
    try {
      expect(data).toBe('peanut butter');
      done();
    } catch (error) {
      done(error);
    }
  }

  fetchData(callback);
});

// si done no se llama nunca, el test fallará (error timeout) que es lo que deseas que suceda
// si la declaración expect falla, arrojará un error y done() no se llamará, si queremos ver en el test log porqué falló, tenemos que envolver expect en un bloque try y pasar a done el error en un bloque catch, de lo contrario terminaremos con un error de tiempo de espera que no muestra que valor recibió expect(data)
// si la misma función test recibe una devolución done() como callback y returns una promise, jest arrojará error para evitar pérdidas de memoria en sus pruebas

// .resolves / .rejects
// usa resolves para hacer match con lo que esperas, jest esperará que la promise se resuelva, si se rechaza la promise, el test automáticamente fallará
test('the data is peanut butter', () => {
  return expect(fetchData()).resolves.toBe('peanut butter');
});
// asegúrate de usar return, si lo omites, el test se completará antes de que la promise retornada de fetchData sea resuelta y then() ha tenido oportunidad para ejecutar su callback().
// si esperas que la promise sea rechazada usa .rejects, funciona de manera análoga a .resolves, si la promise es fulfilled el test automáticamente fallará
test('the fetch fails with an error', () => {
  return expect(fetchData()).rejects.toMatch('error');
});
