import React from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { act, fireEvent, prettyDOM, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { PlayJoinNewGame } from './join-new-game.component';
import { DropdownItemType } from '../../mui/custom-dropdown.component';
import * as backendUtils from '../../../utils/backend.utils';
import { renderWithProviders } from '../../../store/test-utils';
import { expectedGameStateFe } from '../../../../test/test-constants';
import { NewGame } from '../../../store/initialize-game';

jest.mock('../../../utils/backend.utils');
const mockedBackendUtils = backendUtils as jest.Mocked<typeof backendUtils>;

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  const navigate = jest.fn();
  return {
    __esModule: true,
    ...originalModule,
    useNavigate: () => navigate,
  };
});

const newGames: NewGame[] = [
  {
    gameId: '2346',
    nickName: 'helene',
    cardsetName: 'transports',
    languages: 'englisch - deutsch',
  },
  {
    gameId: '653',
    nickName: 'Paul',
    cardsetName: 'familj',
    languages: 'schwedisch - deutsch',
  },
];

const preloadedState = {
  initializeGame: {
    sets: [] as DropdownItemType[],
    newGames: [...newGames],
    nickName: '',
    setStatus: 'idle',
    newGameStatus: 'idle',
  },
};

mockedBackendUtils.fetchNewGamesFromBackend.mockReturnValue(
  Promise.resolve(newGames)
);

describe(PlayJoinNewGame.name, () => {
  afterEach(() => {
    mockedBackendUtils.fetchNewGamesFromBackend.mockClear();
  });

  it('should NOT be possible to click join game, if nickname is not set', async () => {
    // arrange
    await act(() => {
      renderWithProviders(
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PlayJoinNewGame />} />
          </Routes>
        </BrowserRouter>,
        {
          preloadedState,
        }
      );
    });
    let buttons = screen.getAllByTestId(
      'select-new-game-card-button'
    ) as HTMLButtonElement[];

    // assert
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('should call join game of the backend, and input fields should be disabled', async () => {
    // arrange
    mockedBackendUtils.joinGameToBackend.mockReturnValue(
      Promise.resolve({ ...expectedGameStateFe })
    );
    preloadedState.initializeGame.nickName = 'hello you';
    await act(() => {
      renderWithProviders(
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PlayJoinNewGame />} />
          </Routes>
        </BrowserRouter>,
        {
          preloadedState,
        }
      );
    });

    let buttons = screen.getAllByTestId(
      'select-new-game-card-button'
    ) as HTMLButtonElement[];

    // assert
    buttons.forEach((button) => {
      expect(button).not.toBeDisabled();
    });

    // act: click join game
    await act(() => {
      fireEvent.click(buttons[0]);
    });

    // assert
    const nav = useNavigate();
    expect(nav).toHaveBeenCalledTimes(1);
    expect(mockedBackendUtils.joinGameToBackend).toHaveBeenCalledTimes(1);
  });
});
