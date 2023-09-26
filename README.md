# in-memory-db

Simple implementation of In-memory DB

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
