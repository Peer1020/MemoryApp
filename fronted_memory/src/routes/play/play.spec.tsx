import React from 'react';
import * as backendUtils from '../../utils/backend.utils';
import { Play } from './play.component';
import { renderWithProviders } from '../../store/test-utils';
import { PlayGameState } from '../../store/play-game';
import { iniGameState } from '../../../test/test-constants';

jest.mock('../../utils/backend.utils');
const mockedBackendUtils = backendUtils as jest.Mocked<typeof backendUtils>;

describe(Play.name, () => {
  afterEach(() => {
    mockedBackendUtils.postStopGame.mockClear();
  });

  ['NEW', 'IN_PROGRESS'].forEach((state) => {
    it(`should call stopGame before component unmounts for game-state ${state}`, async () => {
      // arrange
      const game: PlayGameState = { ...iniGameState };
      game.gameState = state;

      const { unmount } = renderWithProviders(<Play />, {
        preloadedState: { playGame: game },
      });

      // act
      unmount();

      // assert
      expect(mockedBackendUtils.postStopGame).toHaveBeenCalledTimes(1);
    });
  });

  ['FINISHED', 'STOPPED'].forEach((state) => {
    it(`should not call stopGame before component unmounts, if state is already ${state}`, async () => {
      // arrange
      const game: PlayGameState = { ...iniGameState };
      game.gameState = state;

      const { unmount } = renderWithProviders(<Play />, {
        preloadedState: { playGame: game },
      });

      // act
      unmount();

      // assert
      expect(mockedBackendUtils.postStopGame).not.toHaveBeenCalled();
    });
  });
});
