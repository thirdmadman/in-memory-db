# in-memory-db

Simple implementation of In-memory DB.

## Installation

Using npm:

``` bash
npm i @thirdmadman/in-memory-db
```

## Description

Typescript, zero dependencies, compact.

Technically, it's ```Map<string, Array<AbstractEntity>>```, but with simple access methods.

All magic happens with usage of TypeScript - this implementation will guard you from using wrong types.

Additionally, you can provide your own function for generating global ids.

## How to use

``` typescript

interface UserEntity extends AbstractEntity {
  id: string;
  name: string;
  password: string;
}

const dbSchema = {
  user: Array<UserEntity>(),
};

const db = new GenericInMemoryDB<typeof dbSchema>(dbSchema);

const userRepository = new GenericRepository<typeof dbSchema, UserEntity>(db, 'user');
```
