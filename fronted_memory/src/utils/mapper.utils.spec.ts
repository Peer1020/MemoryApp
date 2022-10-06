import { CardBe, CardDto, CardsetDto } from './backend.utils';
import {
  mapCardBeToCardFe,
  mapDropdownList,
  mapNewCardSetStateToCardsetDto,
  newGameBeToGameState,
} from './mapper.utils';
import { CardFe } from '../store/play-game';
import { DropdownItemType } from '../components/mui/custom-dropdown.component';
import { NewCard, NewCardSetState } from '../store/new-card-set';
import {
  cardSetBe,
  expectedGameStateFe,
  expectedListFe,
  newGameBe,
} from '../../test/test-constants';

describe('Unit tests for mapper.utils', () => {
  it('mapCardBeToCardFe: all attributes are set', () => {
    // arrange
    const cardBe: CardBe = {
      cardId: '275',
      connectId: '3',
      switched: false,
      temporarilySwitched: true,
      word: 'abcdef',
    };
    const expected: CardFe = {
      cardId: '275',
      connectId: '3',
      switched: false,
      temporarilySwitched: true,
      word: 'abcdef',
    };

    // act
    const cardFe = mapCardBeToCardFe(cardBe);

    // assert
    expect(cardFe).toEqual(expected);
  });

  it('newGameBeToGameState: all attributes are set', () => {
    // act
    const gameState = newGameBeToGameState(newGameBe);

    // assert
    expect(gameState).toEqual(expectedGameStateFe);
  });

  it('mapCardSetList: all attributes are set', () => {
    // act
    const list = mapDropdownList(cardSetBe);

    // assert
    expect(list).toEqual(expectedListFe);
  });

  it('mapNewCardSetStateToCardsetDto: all attributes are set', () => {
    // arrange
    const cards: NewCard[] = [
      {
        wordLng1: 'wrtz',
        wordLng2: 'jkn',
      },
      {
        wordLng1: 'abcd',
        wordLng2: 'ckjöertä',
      },
    ];
    const language1: DropdownItemType = {
      id: '5557345',
      value: 'french',
    };
    const language2: DropdownItemType = {
      id: '522573-45',
      value: 'english',
    };
    const newCardSetState: NewCardSetState = {
      setName: 'hello There',
      language1: language1,
      language2: language2,
      cards: cards,
    };

    const expectedCards: CardDto[] = [
      {
        wordLng1: 'wrtz',
        wordLng2: 'jkn',
      },
      {
        wordLng1: 'abcd',
        wordLng2: 'ckjöertä',
      },
    ];
    const expected: CardsetDto = {
      cardsetName: 'hello There',
      language1: 'french',
      language2: 'english',
      cardsetCards: expectedCards,
    };

    // act
    const cardsetDto = mapNewCardSetStateToCardsetDto(newCardSetState);

    // assert
    expect(cardsetDto).toEqual(expected);
  });
});
