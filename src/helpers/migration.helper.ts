import { TableColumnOptions } from 'typeorm';

export const baseColumns: TableColumnOptions[] = [
  {
    name: 'id',
    type: 'int',
    isPrimary: true,
    isGenerated: true,
    generationStrategy: 'increment',
  },
  {
    name: 'createdAt',
    type: 'timestamp',
    default: 'now()',
  },
  {
    name: 'updatedAt',
    type: 'timestamp',
    default: 'now()',
  },
  {
    name: 'deletedAt',
    type: 'timestamp',
    isNullable: true,
  },
];
