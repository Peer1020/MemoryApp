import React from 'react';
import { act, fireEvent, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from '../../../store/test-utils';
import { RecordCardsDisplay } from './record-cards-display.component';
import { cardSetState } from '../../../../test/record-helpers';

describe(RecordCardsDisplay.name, () => {
  it('should remove card, which is clicked on the garbage-icon', async () => {
    // arrange
    renderWithProviders(<RecordCardsDisplay />, {
      preloadedState: { newCardSet: { ...cardSetState } },
    });
    const cards = screen.queryAllByTestId('record-cardset-display-card');
    const { getByRole } = within(cards[1]);
    const deleteCard = getByRole('button');

    // assert
    expect(screen.queryAllByTestId('record-cardset-display-card').length).toBe(
      2
    );

    // act
    await act(() => {
      fireEvent.click(deleteCard);
    });

    // assert
    expect(screen.queryAllByTestId('record-cardset-display-card').length).toBe(
      1
    );
  });
});
