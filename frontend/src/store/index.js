import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';
import auth from './modules/auth';
import users from './modules/users';

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  modules: ['auth']
});

export default createStore({
  modules: {
    auth,
    users
  },
  plugins: [vuexLocal.plugin]
}); 