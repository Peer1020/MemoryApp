import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { act, fireEvent, screen } from '@testing-library/react';
import { PlayGameState, setFromTopic } from '../../../store/play-game';
import { AppStore, setupStore } from '../../../store/store';
import { renderWithProviders } from '../../../store/test-utils';
import { PlayBoard } from './play-board.component';
import * as backendUtils from '../../../utils/backend.utils';
import { boardCards, iniGameState } from '../../../../test/test-constants';

jest.mock('../../../utils/backend.utils');
const mockedBackendUtils = backendUtils as jest.Mocked<typeof backendUtils>;
const mockPlayGameToBackend = jest.fn(
  async (gameId: string, cardId: string): Promise<void> => {
    const gameStateCopy: PlayGameState = {
      ...iniGameState,
      cards: [
        ...boardCards.map((c) =>
          c.cardId === cardId ? { ...c, temporarilySwitched: true } : c
        ),
      ],
    };
    testStore.dispatch(setFromTopic(gameStateCopy));
  }
);
mockedBackendUtils.playGameToBackend.mockImplementation(mockPlayGameToBackend);

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  const navigate = jest.fn();
  return {
    __esModule: true,
    ...originalModule,
    useNavigate: () => navigate,
  };
});

let testStore: AppStore;

describe(PlayBoard.name, () => {
  afterEach(() => {
    mockedBackendUtils.playGameToBackend.mockClear();
  });

  it('should all cards be laid out on the game board', async () => {
    // arrange & act
    testStore = setupStore({ playGame: { ...iniGameState } });
    renderWithProviders(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PlayBoard />} />
        </Routes>
      </BrowserRouter>,
      { store: testStore }
    );

    // assert
    const buttons = screen.getAllByTestId('card-button') as HTMLButtonElement[];
    expect(buttons.length).toEqual(boardCards.length);
  });

  it('should turn the card over, and calls the backend once, clicking on a covered card', async () => {
    // arrange
    testStore = setupStore({ playGame: { ...iniGameState } });
    renderWithProviders(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PlayBoard />} />
        </Routes>
      </BrowserRouter>,
      { store: testStore }
    );
    const buttons = screen.getAllByTestId('card-button') as HTMLButtonElement[];

    // act
    await act(() => {
      fireEvent.click(buttons[3]);
    });
    const text = screen.findByText('Pflanze');

    // assert
    expect(text).toBeTruthy();
    expect(mockedBackendUtils.playGameToBackend).toHaveBeenCalledTimes(1);
  });

  it('should not flip the card back and not call the backend, clicking on an uncovered card', async () => {
    // arrange
    let gameState: PlayGameState = {
      ...iniGameState,
      cards: iniGameState.cards.map((card) =>
        card.cardId === '3'
          ? { ...card, temporarilySwitched: true }
          : { ...card }
      ),
    };
    gameState.cards[1].switched = true;
    testStore = setupStore({ playGame: { ...gameState } });
    renderWithProviders(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PlayBoard />} />
        </Routes>
      </BrowserRouter>,
      { store: testStore }
    );
    const buttons = screen.getAllByTestId('card-button') as HTMLButtonElement[];

    // act
    await act(() => {
      fireEvent.click(buttons[1]);
    });

    // assert
    expect(mockedBackendUtils.playGameToBackend).not.toHaveBeenCalled();
    expect(buttons[1]).toBeDisabled();
  });

  it('should not be possible to click on switched and matching cards and backend is not called', async () => {
    // arrange
    let gameState: PlayGameState = {
      ...iniGameState,
      cards: iniGameState.cards.map((card) =>
        card.connectId === '2' ? { ...card, switched: true } : { ...card }
      ),
    };
    testStore = setupStore({ playGame: { ...gameState } });
    renderWithProviders(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PlayBoard />} />
        </Routes>
      </BrowserRouter>,
      { store: testStore }
    );
    let buttons = screen.getAllByTestId('card-button') as HTMLButtonElement[];

    // act
    await act(() => {
      fireEvent.click(buttons[1]);
    });
    await act(() => {
      fireEvent.click(buttons[2]);
    });

    // assert
    expect(buttons[1]).toBeDisabled();
    expect(buttons[2]).toBeDisabled();
    expect(mockedBackendUtils.playGameToBackend).not.toHaveBeenCalled();
  });

  it('should not be possible to click on temporarily switched and matching cards and backend is not called', async () => {
    // arrange
    let gameState: PlayGameState = {
      ...iniGameState,
      cards: iniGameState.cards.map((card) =>
        card.connectId === '2'
          ? { ...card, temporarilySwitched: true }
          : { ...card }
      ),
    };
    testStore = setupStore({ playGame: { ...gameState } });
    renderWithProviders(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PlayBoard />} />
        </Routes>
      </BrowserRouter>,
      { store: testStore }
    );
    let buttons = screen.getAllByTestId('card-button') as HTMLButtonElement[];

    // act
    await act(() => {
      fireEvent.click(buttons[1]);
    });
    await act(() => {
      fireEvent.click(buttons[2]);
    });

    // assert
    expect(buttons[1]).toBeDisabled();
    expect(buttons[2]).toBeDisabled();
    expect(mockedBackendUtils.playGameToBackend).not.toHaveBeenCalled();
  });
});
