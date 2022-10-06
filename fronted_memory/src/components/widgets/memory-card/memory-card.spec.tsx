import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryCard } from './memory-card.component';
import { CardFe } from '../../../store/play-game';

describe(MemoryCard.name, () => {
  const card: CardFe = {
    cardId: '1',
    connectId: '1',
    switched: false,
    temporarilySwitched: false,
    word: 'test',
  };

  it('should render word, if word is set', async () => {
    render(<MemoryCard card={card} onClick={() => {}} />);
    expect(screen.queryByText('test')).toBeTruthy();
  });
});
