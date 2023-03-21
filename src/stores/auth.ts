import {makeAutoObservable} from 'mobx';
import {hydrateStore, makePersistable} from 'mobx-persist-store';

export class UserAuth implements IStore {
  auth = false;
  userName = null;
  userEmail = null;

  setAuth = (v: boolean): void => {
    this.auth = v;
  };

  setUserName = (v: string): void => {
    this.userName = v;
  };

  setUserEmail = (v: string): void => {
    this.userEmail = v;
  };

  constructor() {
    makeAutoObservable(this);

    makePersistable(this, {
      name: UserAuth.name,
      properties: ['auth', 'userName', 'userEmail'],
    });
  }

  hydrate = async (): PVoid => {
    await hydrateStore(this);
  };
}
