# pandadb
pandadb is a local document-oriented JSON database, ready to be implemented in an application in a simple way.

it is worth mentioning that the author of panda db was inspired by other packages to develop pandadb, such as lowdb, taffydb among others.

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
![NPM Version](https://img.shields.io/npm/v/%40nelson_echeverria%2Fpandadb)
![NPM Downloads](https://img.shields.io/npm/dw/%40nelson_echeverria%2Fpandadb)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# introduction

pandadb is a local JSON database, which uses a JSON file locally to persist the data, which is managed in a specific application, as a JSON format is used, pandadb uses **MQL** as a syntax to perform queries, which makes queries more intuitive and friendly to end customers.

#### example of an MQL query
```jsonc
// should return the element that has the property 'foo', with the value of 'bar'
{ "foo": "bar" }
```

# installation

```bash
npm i --save-exact pandadb
```
# usage
> [!NOTE]
> If you do not pass a file name to the PandaDB instance, it will create a JSON file called 'pandadb.json' by default.
```js
const PandaDB = require('pandadb')
const db = new PandaDB('NBA.json') // 

const players = db.collection('players')

players.createMany([
    {
        name: 'Michael Jordan',
        team: 'Chicago Bulls',
        shirtNumber: 23
    },
    {
        name: 'Lebron James',
        team: 'Leakers',
        shirtNumber: 23
    },
    {
        name: 'Kyle Irving',
        team: 'Celtics',
        shirtNumber: 11
    }
]).then(() => console.log('data was created successfully'))

players.find({ shirtNumber: 11 }).then(player => console.log(`here is kyle irving \n ${player}`))

```

# API

All of the following methods listed are available when creating a collection with the 'collection()' method.

- `list` 
obtains/lists all the data of the collection in question
```js
players.list().then(console.log)
```
- `create` creates and automatically inserts an id - UUID for subsequent persistence
```js
const MJ = { name: 'Michael Jordan', team: 'Chicago Bulls', shirtNumber: 23 }

players.create(MJ)
       .then(response => console.log(response)) // { status: 'success', collection: 'players', createdItems: 1 }
```
- `createMany` creates/saves a data set within a collection
```js
players.createMany([
    {
        name: 'Michael Jordan',
        team: 'Chicago Bulls',
        shirtNumber: 23
    },
    {
        name: 'Lebron James',
        team: 'Leakers',
        shirtNumber: 23
    },
    {
        name: 'Kyle Irving',
        team: 'Celtics',
        shirtNumber: 11
    }
]).then(response => console.log(response)) // { status: 'success', collection: 'players', createdItems: 3 }
```
- `find` returns the first element that matches the query
```js
players.find({ team: 'Celtics' }).then(player => console.log('here is Kyle Irving \n', player))
```
- `findMany` will recover all the data that matches the query made
```js
players.findMany({ shirtNumber: 23 }).then(players => console.log('the basketball gods:', players))
```
- `edit` edit the first element that matches the query
```js
players.edit({ name: 'Michael Jordan' }, { retired: true })
       .then(response => console.log(response)) // { status: 'success', collection: 'players', updatedItems: 1 }
```
- `editMany` edit all the elements of a collection that match the query made
```js
players.editMany({ shirtNumber: 23 }, { level: 'god' })
       .then(response => console.log(response)) // { status: 'success', collection: 'players', updatedItems: 2 }
```
- `remove` removes from the collection the first element of the collection that matches the query
```js
players.remove({ shirtNumber: 11 })
       .then(response => console.log(response)) // { status: 'success', collection: 'players', removedItems: 1 }
```
- `removeMany` removes all elements from the collection that match the query
```js
players.removeMany({})
       .then(response => console.log(response)) // { status: 'success', collection: 'players', removedItems: 3 }
```
- `destroy` destroys/removes the collection from which it is called.
> [!IMPORTANT]
> the methods can still be accessed, but they will have no effect
```js
players.destroy().then(() => console.log('the players collection was eliminated'))
players.list() // undefined
```

# license
pandadb is under the **MIT** license