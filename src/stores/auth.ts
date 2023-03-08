import {makeAutoObservable} from 'mobx';
import {hydrateStore, makePersistable} from 'mobx-persist-store';

export class UserAuth implements IStore {
  auth = false;

  setAuth = (v: boolean): void => {
    this.auth = v;
  };

  constructor() {
    makeAutoObservable(this);

    makePersistable(this, {
      name: UserAuth.name,
      properties: ['auth'],
    });
  }

  hydrate = async (): PVoid => {
    await hydrateStore(this);
  };
}
