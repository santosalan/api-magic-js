# api-magic-js

A library to simplify integration with REST APIs in JavaScript projects, based on [axios](https://www.npmjs.com/package/axios).

## Installation

Add to your project:

```sh
npm install api-magic-js
```

Or clone this repository and install dependencies for development:

```sh
git clone https://github.com/santosalan/api-magic-js.git
cd api-magic-js
npm install
```
---
---


## Basic Usage

Import and use the main composable:

```js
import { useApiMagic } from 'api-magic-js';

const api = useApiMagic();

api.setBase({ baseHost: 'https://jsonplaceholder.typicode.com' });
api.setNamedReturn(true);

const result = await api.element('users')
                        .toJson()
                        .call('users', ['GET', [], { name: 'Leanne' }]);

console.log(result);
```
---
---


## Main Methods

- `setBase({ baseHost, basePort, basePrefix })`: Sets the API host, port, and prefix.
- `setNamedReturn(true|false)`: Returns the response named by the element.
- `element('name')`: Sets the main element for the request.
- `toJson()`: Sends parameters as JSON.
- `call(name, [method, [pathParams], params, headers])`: Executes the HTTP call.
- `auth(username, password, type)`: Sets authentication.
- `setTokenField('field')`: Sets the token field.
- `setActionRoutes('route')`: Sets the route for available actions validation.
---
---


## Advanced Example

```js
import { useApiMagic } from 'api-magic-js';

const api = useApiMagic();

api.setBase({ baseHost: 'http://api.example.com', basePort: ':8080', basePrefix: '/v1' });
api.setNamedReturn(true);
api.setTokenField('token');

// api.example.com:8080/v1/clients/europe/france
const result = await api.auth('user', 'password')
                        .element('frenchClients')
                        .toJson()
                        .call('clients', [
                            'POST', 
                            ['europe', 'france'],  
                            { 
                                name: 'John', 
                                active: true 
                            }
                        ]);

console.log(result);
```

## Notes

- Can be used in any Node.js or modern frontend project.
- Edit the `test.js` file to create your own local tests.
- The main file is in `composables/useApiMagic.js`.

---

Contributions are welcome!