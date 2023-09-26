export type AbstractEntity = {
  id: string;
}

export interface AbstractDBStoreObject {
  [key: string]: Array<AbstractEntity>;
}

export class GenericInMemoryDB<T extends AbstractDBStoreObject> {
  private db: T;
  private prevId: string | null = null;
  private idGenerator: (prevId: string | null) => string;

  constructor(db: T, idGenerator: (prevId: string | null) => string = (prevId) => prevId === null ? String(0) : String(parseInt(prevId, 10)  + 1)) {
    this.db = JSON.parse(JSON.stringify(db));
    this.idGenerator = idGenerator;

  }

  createInTable<TEntity extends AbstractEntity>(tableName: keyof T, entity: TEntity) {
    const generatedId = this.idGenerator(this.prevId);
    this.prevId = generatedId;
    const newEntity: TEntity = {...entity, id: generatedId};
    this.db[tableName].push(newEntity);
    return newEntity;
  }

  findOneInTable<TEntity extends AbstractEntity>(tableName: keyof T, id: string) {
    let foundEntity: TEntity | null = null;
    if (this.db[tableName] && this.db[tableName].length > 0) {
      for (let i = 0; i < this.db[tableName].length; i++) {
        if (this.db[tableName][i].id === id) {
          foundEntity = this.db[tableName][i] as TEntity;
          break;
        }
      }
      if (foundEntity) {
        return {...foundEntity};
      }
    }
    return null;
  }

  findAllInTable<TEntity extends AbstractEntity>(tableName: keyof T) {
    if (this.db[tableName] && this.db[tableName].length > 0) {
      const entities = Array<TEntity>();
      for (let i = 0; this.db[tableName].length > i; i += 1) {
        const entity = this.db[tableName][i];
        if (entity) {
          entities.push({...(entity as TEntity)});
        }
      }
      return entities;
    }
    return Array<TEntity>();
  }

  updateInTable<TEntity extends AbstractEntity>(tableName: keyof T, id: string, entity: TEntity) {
    const table = this.db[tableName];

    let index = -1;

    for (let i = 0; i < this.db[tableName].length; i++) {
      if (this.db[tableName][i].id === id) {
        index = i;
        break;
      }
    }

    if (index > -1) {
      const newEntity: TEntity = {...entity, id};
      this.db[tableName][index] = newEntity;
      return {...table[index]} as TEntity;
    }
    return null;
  }

  deleteInTable<TEntity extends AbstractEntity>(tableName: keyof T, id: string) {
    let index = -1;

    for (let i = 0; i < this.db[tableName].length; i++) {
      if (this.db[tableName][i].id === id) {
        index = i;
        break;
      }
    }

    if (index > -1) {
      const oldEntity: TEntity = {...this.db[tableName][index]} as TEntity;
      this.db[tableName].splice(index, 1);
      return oldEntity;
    }
    return null;
  }
}
