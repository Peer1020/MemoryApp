import {
  CardBe,
  MemoryBoardBe,
  NewGameBe,
  PlayerBe,
} from '../src/utils/backend.utils';
import { CardFe, PlayGameState, PlayerFe } from '../src/store/play-game';
import { DropdownItemType } from '../src/components/mui/custom-dropdown.component';

const player1: PlayerBe = {
  tag: 'ONE',
  name: 'jules',
  pairs: 1,
};
const player2: PlayerBe = {
  tag: 'TWO',
  name: 'amy',
  pairs: 2,
};
const gameCards: CardBe[] = [
  {
    cardId: '1',
    connectId: '1',
    switched: false,
    temporarilySwitched: false,
    word: 'Haus',
  },
  {
    cardId: '2',
    connectId: '2',
    switched: false,
    temporarilySwitched: false,
    word: 'Car',
  },
  {
    cardId: '4',
    connectId: '2',
    switched: false,
    temporarilySwitched: true,
    word: 'Auto',
  },
  {
    cardId: '5',
    connectId: '1',
    switched: false,
    temporarilySwitched: false,
    word: 'House',
  },
];
const memoryBoard: MemoryBoardBe = {
  gameCards: gameCards,
};
export const newGameBe: NewGameBe = {
  activePlayer: player1,
  gameId: '12345',
  memoryBoard: memoryBoard,
  gameState: 'IN_PROGRESS',
  player1: player1,
  player2: player2,
};

const expectedPlayer1: PlayerFe = {
  tag: 'ONE',
  name: 'jules',
  pairs: 1,
};
const expectedPlayer2: PlayerFe = {
  tag: 'TWO',
  name: 'amy',
  pairs: 2,
};
const expectedActivePlayer: PlayerFe = expectedPlayer1;
const expectedCards: CardFe[] = [
  {
    cardId: '1',
    connectId: '1',
    switched: false,
    temporarilySwitched: false,
    word: 'Haus',
  },
  {
    cardId: '2',
    connectId: '2',
    switched: false,
    temporarilySwitched: false,
    word: 'Car',
  },
  {
    cardId: '4',
    connectId: '2',
    switched: false,
    temporarilySwitched: true,
    word: 'Auto',
  },
  {
    cardId: '5',
    connectId: '1',
    switched: false,
    temporarilySwitched: false,
    word: 'House',
  },
];
export const expectedGameStateFe: PlayGameState = {
  activePlayer: expectedActivePlayer,
  gameId: '12345',
  gameState: 'IN_PROGRESS',
  cards: expectedCards,
  player1: expectedPlayer1,
  player2: expectedPlayer2,
  iAmPlayer: {} as PlayerFe,
  loadingState: '',
};

export const cardSetBe: [string, string][] = [
  ['56', 'wertwert'],
  ['0834 9', 'wert sdfrt'],
];

export const expectedListFe: DropdownItemType[] = [
  {
    id: '56',
    value: 'wertwert',
  },
  {
    id: '0834 9',
    value: 'wert sdfrt',
  },
];

export const boardCards: CardFe[] = [
  {
    cardId: '1',
    connectId: '1',
    switched: false,
    temporarilySwitched: false,
    word: 'Plant',
  },
  {
    cardId: '3',
    connectId: '2',
    switched: false,
    temporarilySwitched: false,
    word: 'Haus',
  },
  {
    cardId: '4',
    connectId: '2',
    switched: false,
    temporarilySwitched: false,
    word: 'House',
  },
  {
    cardId: '2',
    connectId: '1',
    switched: false,
    temporarilySwitched: false,
    word: 'Pflanze',
  },
];

export const iniGameState: PlayGameState = {
  activePlayer: { tag: 'ONE', name: 'Jana', pairs: 0 },
  gameId: '1234-5678',
  gameState: 'NEW',
  cards: boardCards,
  player1: { tag: 'ONE', name: 'Jana', pairs: 0 },
  player2: { tag: 'TWO', name: 'Tom', pairs: 0 },
  iAmPlayer: { tag: 'ONE', name: 'Jana', pairs: 0 },
  loadingState: 'idle',
};
