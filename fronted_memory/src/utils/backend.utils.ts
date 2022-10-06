import axios, { AxiosResponse } from 'axios';
import {
  mapDropdownList,
  mapNewCardSetStateToCardsetDto,
  mapNewGameDtoListToNewGameArray,
  newGameBeToGameState,
} from './mapper.utils';
import { PlayGameState } from '../store/play-game';
import SockJS from 'sockjs-client';
import { Client as StompClient, IFrame } from '@stomp/stompjs';
import { DropdownItemType } from '../components/mui/custom-dropdown.component';
import { NewCardSetState } from '../store/new-card-set';
import { NewGame } from '../store/initialize-game';

require('axios-debug-log/enable');

export interface PlayGameDto {
  gameId: string;
  cardId: string;
  tag: string;
}

export interface PlayerBe {
  tag: string;
  name: string;
  pairs: number;
}

export interface CardBe {
  cardId: string;
  connectId: string;
  switched: boolean;
  temporarilySwitched: boolean;
  word: string;
}

export interface MemoryBoardBe {
  gameCards: CardBe[];
}

export interface NewGameBe {
  activePlayer: PlayerBe;
  gameId: string;
  gameState: string;
  memoryBoard: MemoryBoardBe;
  player1: PlayerBe;
  player2?: PlayerBe;
}

export interface StartGameDto {
  player: string;
  cardsetId: string;
}

export interface CardDto {
  wordLng1: string;
  wordLng2: string;
}

export interface CardsetDto {
  cardsetName: string;
  language1: string;
  language2: string;
  cardsetCards: CardDto[];
}

export interface NewGameDto {
  cardsetName: string;
  gameId: string;
  languages: string;
  player: string;
}

export interface JoinGameDto {
  player: string;
  gameId: string;
}

const rootUrl = process.env.REACT_APP_ROOT_URL;

export const fetchLanguagesFromBackend = async (): Promise<
  DropdownItemType[]
> => {
  const response = await axios.get(`${rootUrl}/cardset/languages`);
  console.log('Test');
  const data: [string, string][] = Object.entries(response.data);
  return mapDropdownList(data);
};

const postConfig = {
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
};

export const startGameToBackend = async (
  playerName: string,
  cardsetId: string
): Promise<PlayGameState> => {
  const response: AxiosResponse<NewGameBe> = await axios.post(
    `${rootUrl}/game/start`,
    { player: playerName, cardsetId } as StartGameDto,
    postConfig
  );
  return newGameBeToGameState(response.data);
};

export const joinGameToBackend = async (
  joinGameDto: JoinGameDto
): Promise<PlayGameState> => {
  const response: AxiosResponse<NewGameBe> = await axios.post(
    `${rootUrl}/game/join`,
    joinGameDto,
    postConfig
  );
  return newGameBeToGameState(response.data);
};

export const playGameToBackend = async (
  gameId: string,
  cardId: string,
  tag: string
): Promise<void> => {
  const playGameDto: PlayGameDto = {
    gameId: gameId,
    cardId: cardId,
    tag: tag,
  };
  await axios.post(`${rootUrl}/game/play`, playGameDto, postConfig);
};

export const postStopGame = async (gameId: string): Promise<void> => {
  await axios.post(`${rootUrl}/game/end`, gameId, postConfig);
};

export const fetchCardsetListFromBackend = async (): Promise<
  DropdownItemType[]
> => {
  const response = await axios.get(`${rootUrl}/cardset/all`);
  const data: [string, string][] = Object.entries(response.data);
  return mapDropdownList(data);
};

export const postCardSetToBackend = async (
  data: NewCardSetState
): Promise<void> => {
  const cardSetDto: CardsetDto = mapNewCardSetStateToCardsetDto(data);
  await axios.post(`${rootUrl}/cardset/record`, cardSetDto, postConfig);
};

export const fetchNewGamesFromBackend = async (): Promise<NewGame[]> => {
  const response = await axios.get(`${rootUrl}/game/new`);
  return mapNewGameDtoListToNewGameArray(response.data);
};

export const connectToPlayGameSocket = (
  gameId: string,
  subscribeFunction: (gameState: PlayGameState) => void
): StompClient => {
  const newStompClient = new StompClient({
    webSocketFactory: () => {
      return new SockJS(rootUrl + '/play');
    },
    onConnect: (frame: IFrame) => {
      console.log('stomp-client connected to the frame: ', frame);
      newStompClient.subscribe(`/topic/game-progress/${gameId}`, (message) => {
        const newGame = JSON.parse(message.body) as NewGameBe;
        const newGameState = newGameBeToGameState(newGame);
        subscribeFunction(newGameState);
      });
    },
  });
  newStompClient.activate();
  return newStompClient;
};

export const connectToNewGameSocket = (
  subscribeFunction: (newGames: NewGame[]) => void
): StompClient => {
  const newStompClient = new StompClient({
    webSocketFactory: () => {
      return new SockJS(`${rootUrl}/play`);
    },
    onConnect: (frame: IFrame) => {
      console.log('stomp-client connected to the frame: ', frame);
      newStompClient.subscribe(`/topic/new-games/`, (message) => {
        const newGameDto = JSON.parse(message.body) as NewGameDto[];
        const newGames = mapNewGameDtoListToNewGameArray(newGameDto);
        subscribeFunction(newGames);
      });
    },
  });
  newStompClient.activate();
  return newStompClient;
};
