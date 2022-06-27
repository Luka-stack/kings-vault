import sqlite, { RunResult, Statement } from 'sqlite3';
import { CreatePasswdDto, Passwd } from '../entities/passwd/passwd';
import { PasswdQueries } from '../entities/passwd/queries';

export class PasswdRepository {
  constructor(private readonly dbconnection: sqlite.Database) {}

  initTable() {
    this.dbconnection.run(
      PasswdQueries.createTable(),
      function (runResult: RunResult, err: Error | null) {
        // console.log(runResult);
        // console.log(err);
      }
    );
  }

  createPasswd(
    passwd: CreatePasswdDto,
    passwordHash: { iv: string; content: string },
    userId: number
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.dbconnection.run(
        PasswdQueries.createPasswd(passwd, passwordHash, userId),
        function (_: RunResult, err: Error | null) {
          if (err) {
            reject(err);
          }

          resolve();
        }
      );
    });
  }

  findAll(userId?: number): Promise<Passwd[]> {
    return new Promise<Passwd[]>((resolve, reject) => {
      this.dbconnection.all(
        PasswdQueries.findAll(userId),
        function (err: Error | null, rows: any[]) {
          if (err) {
            reject();
          }

          resolve(rows);
        }
      );
    });
  }
}
