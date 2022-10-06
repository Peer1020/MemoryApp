import React from 'react';
import { act, fireEvent, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Record } from './record.component';
import { renderWithProviders } from '../../store/test-utils';
import {
  cardSetState,
  mockLanguages,
  RecordForm,
} from '../../../test/record-helpers';

describe(Record.name, () => {
  beforeEach(async () => {
    // arrange
    renderWithProviders(<Record />, {
      preloadedState: {
        newCardSet: { ...cardSetState },
        languages: { languages: [...mockLanguages], status: 'idle' },
      },
    });
  });

  it('should render a new card, clicking "add card" button', async () => {
    // assert
    let cards = screen.queryAllByTestId('record-cardset-display-card');
    expect(cards.length).toEqual(2);

    // arrange
    const { fillOutForm, addCardButton } = new RecordForm();
    await fillOutForm({ cardsetName: 'myCardset', word1: 'wir', word2: 'we' });

    // act
    await addCardButton.click();

    // assert
    cards = screen.queryAllByTestId('record-cardset-display-card');
    expect(cards.length).toEqual(3);
    expect(cards[2]).toHaveTextContent(/wir - we/i);
  });

  it('should clear the recorded cards, clicking "Reset All" button', async () => {
    // arrange
    const { resetAllButton } = new RecordForm();

    // assert
    expect(screen.queryAllByTestId('record-cardset-display-card').length).toBe(
      2
    );

    // act
    await resetAllButton.click();

    // assert
    expect(screen.queryAllByTestId('record-cardset-display-card').length).toBe(
      0
    );
  });

  it('should enable selection of languages, if last recorded card is removed with "delete" button', async () => {
    // arrange
    const cards = screen.queryAllByTestId('record-cardset-display-card');

    // act
    await act(() => {
      const deleteCard1 = within(cards[1]).getByRole('button');
      const deleteCard0 = within(cards[0]).getByRole('button');
      fireEvent.click(deleteCard1);
      fireEvent.click(deleteCard0);
    });

    // assert
    const { dropdown1, dropdown2 } = new RecordForm();
    expect(dropdown1.isExistingAndEnabled()).toBeTruthy();
    expect(dropdown2.isExistingAndEnabled()).toBeTruthy();
  });

  it('should enable selection of languages, if recorded cards are removed with "reset all" button', async () => {
    // arrange
    const { dropdown1, dropdown2, resetAllButton } = new RecordForm();

    // act
    await resetAllButton.click();

    // assert
    expect(dropdown1.isExistingAndEnabled()).toBeTruthy();
    expect(dropdown2.isExistingAndEnabled()).toBeTruthy();
  });
});
