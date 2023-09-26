import {AbstractEntity, GenericInMemoryDB} from './GenericInMemoryDB';

test('Initial DB store obj equals src empty dbSchema', () => {
  interface UserEntity extends AbstractEntity {
    id: string;
    name: string;
    password: string;
  }

  const dbSchema = {
    user: Array<UserEntity>(),
  };

  const db = new GenericInMemoryDB<typeof dbSchema>(dbSchema);
  
  expect(db.findAllInTable('user')).toStrictEqual(dbSchema.user);
});

test('After insertion data in DB store, it persists', () => {
  interface UserEntity extends AbstractEntity {
    id: string;
    name: string;
    password: string;
  }

  const user: UserEntity = {
    id: '',
    name: 'John',
    password: 'Password',
  };

  const dbSchema = {
    user: Array<UserEntity>(),
  };

  const db = new GenericInMemoryDB<typeof dbSchema>(dbSchema);

  const resultEntity = db.createInTable('user', user);

  const foundEntity = db.findAllInTable('user');

  expect(resultEntity).toStrictEqual(foundEntity[0]);
});

test('After insertion data in DB store, it should be able to found by id', () => {
  interface UserEntity extends AbstractEntity {
    id: string;
    name: string;
    password: string;
  }

  const user: UserEntity = {
    id: '',
    name: 'John',
    password: 'Password',
  };

  const dbSchema = {
    user: Array<UserEntity>(),
  };

  const db = new GenericInMemoryDB<typeof dbSchema>(dbSchema);

  const resultEntity = db.createInTable('user', user);

  const foundEntity = db.findOneInTable('user', resultEntity.id);

  expect(resultEntity).toStrictEqual(foundEntity);

  const notFoundEntity = db.findOneInTable('user', '1');

  expect(notFoundEntity).toStrictEqual(null);
});

test('After update entity in DB store, changes should persist', () => {
  interface UserEntity extends AbstractEntity {
    id: string;
    name: string;
    password: string;
  }

  const user: UserEntity = {
    id: '',
    name: 'John',
    password: 'Password',
  };

  const dbSchema = {
    user: Array<UserEntity>(),
  };

  const db = new GenericInMemoryDB<typeof dbSchema>(dbSchema);

  const resultEntity = db.createInTable('user', user);

  const updatedEntity = { ...resultEntity, password: 'NewPassword' };

  console.log('db.findAllInTable(user) :>> ', db.findAllInTable('user'));

  const resultOfUpdate = db.updateInTable('user', resultEntity.id, updatedEntity);

  expect(updatedEntity).toStrictEqual(resultOfUpdate);

  const foundEntity = db.findAllInTable('user');

  expect(updatedEntity).toStrictEqual(foundEntity[0]);
  expect(resultOfUpdate).toStrictEqual(foundEntity[0]);

  const notFoundEntity = db.updateInTable('user', '1', updatedEntity);

  expect(notFoundEntity).toStrictEqual(null);
});

test('After removing entity from DB store, it should not persist', () => {
  interface UserEntity extends AbstractEntity {
    id: string;
    name: string;
    password: string;
  }

  const user1: UserEntity = {
    id: '',
    name: 'John',
    password: 'Password',
  };

  const user2: UserEntity = {
    id: '',
    name: 'Karen',
    password: 'WordPass',
  };

  const dbSchema = {
    user: Array<UserEntity>(),
  };

  const db = new GenericInMemoryDB<typeof dbSchema>(dbSchema);

  const resultEntityUser1 = db.createInTable('user', user1);
  const resultEntityUser2 = db.createInTable('user', user2);

  const removeResultEntityUser1 = db.deleteInTable('user', resultEntityUser1.id);

  expect(removeResultEntityUser1).toStrictEqual(resultEntityUser1);

  const foundEntity = db.findAllInTable('user');

  expect([resultEntityUser2]).toStrictEqual(foundEntity);

  const notFoundEntity = db.deleteInTable('user', resultEntityUser1.id);

  expect(notFoundEntity).toStrictEqual(null);
});