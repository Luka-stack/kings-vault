import sqlite from 'sqlite3';

import { UserQueries } from '../entities/user/queries';
import { CreateUserDto, User } from '../entities/user/user';

export class UserRepository {
  constructor(private readonly dbconnection: sqlite.Database) {}

  initTable(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.dbconnection.run(
        UserQueries.createTable(),
        function (err: Error | null) {
          if (err) {
            reject();
          }

          resolve();
        }
      );
    });
  }

  create(user: CreateUserDto): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.dbconnection.run(
        UserQueries.createUser(user),
        function (err: Error | null) {
          if (err) {
            reject(err);
          }

          resolve(this.lastID);
        }
      );
    });
  }

  update(user: CreateUserDto): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.dbconnection.run(
        UserQueries.updateUser(user),
        function (err: Error | null) {
          if (err) {
            reject(err);
          }

          if (this.changes) {
            resolve();
          }

          reject();
        }
      );
    });
  }

  updatePreferences(
    userId: number,
    notifyStatus: boolean,
    notifyDays: number
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.dbconnection.run(
        UserQueries.updatePreferences(userId, notifyStatus, notifyDays),
        function (err: Error | null) {
          if (err) {
            reject(err);
          }

          if (this.changes) {
            resolve();
          }

          reject();
        }
      );
    });
  }

  findById(id: number): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.dbconnection.get(
        UserQueries.findById(id),
        function (err: Error | null, row: User) {
          if (err) {
            reject(err);
          }

          if (row) {
            resolve(row);
          }

          reject();
        }
      );
    });
  }

  findByUsername(username: string): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.dbconnection.get(
        UserQueries.findByUsername(username),
        function (err: Error | null, row: User) {
          if (err) {
            reject(err);
          }

          resolve(row);
        }
      );
    });
  }
}
