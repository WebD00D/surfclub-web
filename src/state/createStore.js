import { createStore as reduxCreateStore } from "redux";

const reducer = (state, action) => {
  if (action.type === `INCREMENT`) {
    return Object.assign({}, state, {
      count: state.count + 1
    });
  }

  if ( action.type === `ALLOW_SITE_ACCESS` ) {
    return Object.assign({}, state, {
      userAuthenticated: true
    })
  }

  return state;
};

const initialState = {
  userAuthenticated: false,
};

const createStore = () =>
  reduxCreateStore(
    reducer,
    initialState,
    //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
export default createStore;
