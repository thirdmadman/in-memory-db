import { AbstractDBStoreObject, AbstractEntity, GenericInMemoryDB } from './GenericInMemoryDB';

export class GenericRepository<
  DBType extends AbstractDBStoreObject,
  TEntity extends AbstractEntity,
> {
  private tableName: keyof DBType;
  private db: GenericInMemoryDB<DBType>;

  constructor(db: GenericInMemoryDB<DBType>, tableName: keyof DBType) {
    this.tableName = tableName;
    this.db = db;
  }

  create(entity: TEntity) {
    return this.db.createInTable<TEntity>(this.tableName, entity);
  }

  findOne(id: string) {
    return this.db.findOneInTable<TEntity>(this.tableName, id);
  }

  findAll() {
    return this.db.findAllInTable<TEntity>(this.tableName);
  }

  update(id: string, entity: TEntity) {
    return this.db.updateInTable<TEntity>(this.tableName, id, entity);
  }

  delete(id: string) {
    return this.db.deleteInTable<TEntity>(this.tableName, id);
  }
}
