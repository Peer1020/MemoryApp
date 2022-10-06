import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { screen } from '@testing-library/react';
import { PlayInformation } from './play-information.component';
import { renderWithProviders } from '../../../store/test-utils';
import { expectedGameStateFe } from '../../../../test/test-constants';

describe(PlayInformation.name, () => {
  it('should display text', () => {
    // arrange & act
    const gameState = { ...expectedGameStateFe };
    gameState.activePlayer.name = 'Laura';
    renderWithProviders(<PlayInformation text="nothing to say" />, {
      preloadedState: { playGame: { ...gameState } },
    });

    // assert
    expect(screen.getByText('nothing to say')).toBeTruthy();
  });
});
