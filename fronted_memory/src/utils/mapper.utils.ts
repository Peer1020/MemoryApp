import { CardBe, CardsetDto, NewGameBe, NewGameDto } from './backend.utils';
import { CardFe, PlayGameState, PlayerFe } from '../store/play-game';
import { DropdownItemType } from '../components/mui/custom-dropdown.component';
import { NewCardSetState } from '../store/new-card-set';
import { NewGame } from '../store/initialize-game';

export const mapCardBeToCardFe = (cardBe: CardBe): CardFe => {
  return {
    cardId: cardBe.cardId,
    connectId: cardBe.connectId,
    switched: cardBe.switched,
    temporarilySwitched: cardBe.temporarilySwitched,
    word: cardBe.word,
  };
};

export const newGameBeToGameState = (newGameBe: NewGameBe): PlayGameState => {
  return {
    activePlayer: { ...newGameBe.activePlayer },
    gameId: newGameBe.gameId,
    gameState: newGameBe.gameState,
    cards: newGameBe.memoryBoard.gameCards.map((card) =>
      mapCardBeToCardFe(card)
    ),
    player1: { ...newGameBe.player1 },
    player2: { ...newGameBe.player2 },
    iAmPlayer: {} as PlayerFe,
    loadingState: '',
  } as PlayGameState;
};

export const mapDropdownList = (
  cardsSets: [string, string][]
): DropdownItemType[] => {
  return cardsSets.map(([key, value]) => ({
    id: key,
    value: value,
  }));
};

export const mapNewCardSetStateToCardsetDto = (
  data: NewCardSetState
): CardsetDto => {
  return {
    cardsetName: data.setName,
    language1: data.language1.value,
    language2: data.language2.value,
    cardsetCards: data.cards.map((card) => {
      return { wordLng1: card.wordLng1, wordLng2: card.wordLng2 };
    }),
  };
};

export const mapNewGameDtoListToNewGameArray = (
  newGameList: NewGameDto[]
): NewGame[] => {
  return newGameList.map((item) => ({
    gameId: item.gameId,
    nickName: item.player,
    cardsetName: item.cardsetName,
    languages: item.languages,
  }));
};
