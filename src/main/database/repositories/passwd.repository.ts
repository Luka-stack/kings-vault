import sqlite from 'sqlite3';
import { CreatePasswdDto, Passwd } from '../entities/passwd/passwd';
import { PasswdQueries } from '../entities/passwd/queries';

export class PasswdRepository {
  constructor(private readonly dbconnection: sqlite.Database) {}

  initTable(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.dbconnection.run(
        PasswdQueries.createTable(),
        function (err: Error | null) {
          if (err) {
            reject();
          }

          resolve();
        }
      );
    });
  }

  create(
    passwd: CreatePasswdDto,
    passwordHash: { iv: string; content: string },
    userId: number
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.dbconnection.run(
        PasswdQueries.createPasswd(passwd, passwordHash, userId),
        function (err: Error | null) {
          if (err) {
            reject(err);
          }

          if (this.lastID) {
            resolve();
          }

          reject();
        }
      );
    });
  }

  createPasswords(passwds: Passwd[], userId: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.dbconnection.run(
        PasswdQueries.createPasswds(passwds, userId),
        function (err: Error | null) {
          if (err) {
            reject(err);
          }

          if (this.lastID) {
            resolve();
          }

          reject();
        }
      );
    });
  }

  findAll(userId?: number, onlyUsers?: boolean): Promise<Passwd[]> {
    return new Promise<Passwd[]>((resolve, reject) => {
      this.dbconnection.all(
        PasswdQueries.findAll(userId, onlyUsers),
        function (err: Error | null, rows: any[]) {
          if (err) {
            reject(err);
          }

          resolve(rows);
        }
      );
    });
  }

  update(
    id: number,
    passwd: CreatePasswdDto,
    passwordHash: { iv: string; content: string }
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.dbconnection.run(
        PasswdQueries.updatePasswd(id, passwd, passwordHash),
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

  delete(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.dbconnection.run(
        PasswdQueries.deletePassword(id),
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
}
