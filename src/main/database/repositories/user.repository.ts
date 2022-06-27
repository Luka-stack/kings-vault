import sqlite, { RunResult } from 'sqlite3';

import { UserQueries } from '../entities/user/queries';

const ANONYMOUS_USER = {
  username: '_Anonymous',
  password: '',
  strength: '',
};

export class UserRepository {
  constructor(private readonly dbconnection: sqlite.Database) {}

  initTable() {
    this.dbconnection.run(
      UserQueries.createTable(),
      function (runResult: RunResult, err: Error | null) {
        // console.log(runResult);
        // console.log(err);
      }
    );
  }

  createAnonymousUser() {
    this.dbconnection.run(
      UserQueries.createUser(ANONYMOUS_USER),
      function (runResult: RunResult, err: Error | null) {
        // console.log(runResult);
        // console.log(err);
      }
    );
  }
}
