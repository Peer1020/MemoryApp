import {
  combineReducers,
  configureStore,
  PreloadedState,
} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import playGameReducer from './play-game';
import newCardSetReducer from './new-card-set';
import initializeGameReducer from './initialize-game';
import languagesReducer from './languages';

const rootReducer = combineReducers({
  playGame: playGameReducer,
  newCardSet: newCardSetReducer,
  initializeGame: initializeGameReducer,
  languages: languagesReducer,
});

const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    devTools: process.env.NODE_ENV !== 'production',
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];

export { setupStore, rootReducer };
