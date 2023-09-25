interface AbstractEntityFieldsRestriction {
  [key: string]: number | string | boolean | null;
}

export interface AbstractEntityBase {
  id: string | number;
}

export interface AbstractEntity
  extends AbstractEntityFieldsRestriction,
    AbstractEntityBase {}

export interface AbstractDBStoreObject {
  [key: string]: Array<AbstractEntity>;
}

export class GenericInMemoryDB<T extends AbstractDBStoreObject> {
  private db: T;
  private prevId = 0;
  private newIdGenerator: (prevId: string | number) => string | number = (
    prevId: number,
  ) => prevId + 1;

  constructor(
    db: T,
    newIdGenerator: (prevId: string | number) => string | number = null,
  ) {
    this.db = JSON.parse(JSON.stringify(db));
    if (newIdGenerator) {
      this.newIdGenerator = newIdGenerator;
    }
  }

  createInTable<TEntity extends AbstractEntity>(
    tableName: keyof T,
    entity: TEntity,
  ) {
    const generatedId = this.newIdGenerator(this.prevId);
    const newEntity: TEntity = { ...entity, id: generatedId };
    this.db[tableName].push(newEntity);
    return newEntity;
  }

  findOneInTable<TEntity extends AbstractEntity>(
    tableName: keyof T,
    id: string,
  ) {
    let foundEntity: TEntity = null;
    if (this.db[tableName] && this.db[tableName].length > 0) {
      for (let i = 0; i < this.db[tableName].length; i++) {
        if (this.db[tableName][i].id === id) {
          foundEntity = this.db[tableName][i] as TEntity;
          break;
        }
      }
      if (foundEntity) {
        return { ...foundEntity };
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
          entities.push({ ...(entity as TEntity) });
        }
      }
      return entities;
    }
    return Array<TEntity>();
  }

  updateInTable<TEntity extends AbstractEntity>(
    tableName: keyof T,
    id: string,
    entity: TEntity,
  ) {
    const table = this.db[tableName];

    let index = -1;

    for (let i = 0; i < this.db[tableName].length; i++) {
      if (this.db[tableName][index].id === id) {
        index = i;
        break;
      }
    }

    if (index > -1) {
      const newEntity: TEntity = { ...entity, id };
      this.db[tableName][index] = newEntity;
      return { ...table[index] } as TEntity;
    }
    return null;
  }

  deleteInTable<TEntity extends AbstractEntity>(
    tableName: keyof T,
    id: string,
  ) {
    let index = -1;

    for (let i = 0; i < this.db[tableName].length; i++) {
      if (this.db[tableName][i].id === id) {
        index = i;
        break;
      }
    }

    if (index > -1) {
      const oldEntity: TEntity = { ...this.db[tableName][index] } as TEntity;
      this.db[tableName].splice(index, 1);
      return oldEntity;
    }
    return null;
  }
}