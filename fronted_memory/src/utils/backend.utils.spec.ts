import axios from 'axios';
import * as mapperUtils from './mapper.utils';
import { PlayGameState } from '../store/play-game';
import {
  fetchCardsetListFromBackend,
  joinGameToBackend,
  playGameToBackend,
  postCardSetToBackend,
  postStopGame,
  startGameToBackend,
} from './backend.utils';
import { DropdownItemType } from '../components/mui/custom-dropdown.component';
import Mock = jest.Mock;
import { NewCardSetState } from '../store/new-card-set';
import {
  cardSetBe,
  expectedGameStateFe,
  expectedListFe,
} from '../../test/test-constants';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock('./mapper.utils');
const mockedMapperUtils = mapperUtils as jest.Mocked<typeof mapperUtils>;

let mockPost: Mock<Promise<{ data: [string, string][] }>, []>;
let mockError: Mock<never, []>;

beforeEach(() => {
  mockPost = jest.fn(() => Promise.resolve({ data: cardSetBe }));
  mockError = jest.fn(() => {
    throw new Error('Network Error');
  });
});

describe(startGameToBackend.name, () => {
  it('behaves correctly, if post works', async () => {
    // arrange
    mockedAxios.post.mockImplementation(mockPost);
    const mockNewGameBeToGameState = jest.fn(() => expectedGameStateFe);
    mockedMapperUtils.newGameBeToGameState.mockImplementation(
      mockNewGameBeToGameState
    );

    // act
    const gameState: PlayGameState = await startGameToBackend('', '');

    // assert
    expect(gameState).toEqual(expectedGameStateFe);
    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(mockNewGameBeToGameState).toHaveBeenCalledTimes(1);
  });

  it('throws an error, if call can not be executed', () => {
    // arrange
    mockedAxios.post.mockImplementation(mockError);

    // act & assert
    expect.assertions(1);
    return startGameToBackend('', '').catch((e) => {
      expect(e.message).toEqual('Network Error');
    });
  });
});

describe(joinGameToBackend.name, () => {
  it('behaves correctly, if post works', async () => {
    // arrange
    mockedAxios.post.mockImplementation(mockPost);
    const mockNewGameBeToGameState = jest.fn(() => expectedGameStateFe);
    mockedMapperUtils.newGameBeToGameState.mockImplementation(
      mockNewGameBeToGameState
    );

    // act
    const gameState: PlayGameState = await joinGameToBackend({
      player: '',
      gameId: '',
    });

    // assert
    expect(gameState).toEqual(expectedGameStateFe);
    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(mockNewGameBeToGameState).toHaveBeenCalledTimes(1);
  });

  it('throws an error, if call can not be executed', () => {
    // arrange
    mockedAxios.post.mockImplementation(mockError);

    // act & assert
    expect.assertions(1);
    return joinGameToBackend({
      player: '',
      gameId: '',
    }).catch((e) => {
      expect(e.message).toEqual('Network Error');
    });
  });
});

describe(playGameToBackend.name, () => {
  it('behaves correctly if post works', async () => {
    // arrange
    mockedAxios.post.mockImplementation(mockPost);

    // act
    await playGameToBackend('', '', '');

    // assert
    expect(mockPost).toHaveBeenCalledTimes(1);
  });

  it('throws an error, if call can not be executed', () => {
    // arrange
    mockedAxios.post.mockImplementation(mockError);

    // act & assert
    expect.assertions(1);
    return playGameToBackend('', '', '').catch((e) => {
      expect(e.message).toEqual('Network Error');
    });
  });
});

describe(postStopGame.name, () => {
  it('behaves correctly if post works', async () => {
    // arrange
    const postFn = jest.fn(() => Promise.resolve());
    mockedAxios.post.mockImplementation(postFn);

    // act
    await postStopGame('1234');

    // assert
    expect(postFn).toHaveBeenCalledTimes(1);
  });

  it('throws an error, if call can not be executed', () => {
    // arrange
    mockedAxios.post.mockImplementation(mockError);

    // act & assert
    expect.assertions(1);
    return postStopGame('').catch((e) => {
      expect(e.message).toEqual('Network Error');
    });
  });
});

describe(fetchCardsetListFromBackend.name, () => {
  it('behaves correctly if get works', async () => {
    // arrange
    const mockGet = jest.fn(() => Promise.resolve({ data: cardSetBe }));
    mockedAxios.get.mockImplementation(mockGet);
    const mockMapCardSetList = jest.fn(() => expectedListFe);
    mockedMapperUtils.mapDropdownList.mockImplementation(mockMapCardSetList);

    // act
    const dropdownItems: DropdownItemType[] =
      await fetchCardsetListFromBackend();

    // assert
    expect(dropdownItems).toEqual(expectedListFe);
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockMapCardSetList).toHaveBeenCalledTimes(1);
  });

  it('throws an error, if call can not be executed', () => {
    // arrange
    mockedAxios.get.mockImplementation(mockError);

    // act & assert
    expect.assertions(1);
    return fetchCardsetListFromBackend().catch((e) => {
      expect(e.message).toEqual('Network Error');
    });
  });
});

describe(postCardSetToBackend.name, () => {
  it('behaves correctly if post works', async () => {
    // arrange
    const mockGet = jest.fn(() => Promise.resolve({ data: cardSetBe }));
    mockedAxios.post.mockImplementation(mockGet);

    // act
    await postCardSetToBackend({} as NewCardSetState);

    // assert
    expect(mockGet).toHaveBeenCalledTimes(1);
  });

  it('throws an error, if call can not be executed', () => {
    // arrange
    mockedAxios.post.mockImplementation(mockError);

    // act & assert
    expect.assertions(1);
    return postCardSetToBackend({} as NewCardSetState).catch((e) => {
      expect(e.message).toEqual('Network Error');
    });
  });
});
