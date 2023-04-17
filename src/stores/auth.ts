import {makeAutoObservable} from 'mobx';
import {hydrateStore, makePersistable} from 'mobx-persist-store';

export class UserAuth implements IStore {
  auth = false;
  userFirstName = null;
  userLastName = null;
  userEmail = null;
  userTelephone = null;

  setAuth = (v: boolean): void => {
    this.auth = v;
  };

  setUserFirstName = (v: string): void => {
    this.userFirstName = v;
  };

  setUserLastName = (v: string): void => {
    this.userLastName = v;
  }

  setUserEmail = (v: string): void => {
    this.userEmail = v;
  };

  setUserTelephone = (v: string): void => {
    this.userTelephone = v;
  };

  constructor() {
    makeAutoObservable(this);

    makePersistable(this, {
      name: UserAuth.name,
      properties: ['auth', 'userFirstName', 'userLastName', 'userEmail', 'userTelephone'],
    });
  }

  hydrate = async (): PVoid => {
    await hydrateStore(this);
  };
}
