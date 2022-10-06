import React from 'react';
import { Box } from '@mui/material';
import { MemoryCard } from '../../widgets/memory-card/memory-card.component';
import { useAppSelector } from '../../../app/hooks';
import {
  CardFe,
  selectActivePlayer,
  selectCards,
  selectGameId,
  selectIam,
} from '../../../store/play-game';
import { playGameToBackend } from '../../../utils/backend.utils';

const PlayBoard = () => {
  const cards = useAppSelector(selectCards);
  const gameId = useAppSelector(selectGameId);
  const iAmPlayer = useAppSelector(selectIam);
  const activePlayer = useAppSelector(selectActivePlayer);

  const clickCard = (card: CardFe) => {
    if (activePlayer.tag === iAmPlayer.tag) {
      playGameToBackend(gameId, card.cardId, iAmPlayer.tag);
    }
  };

  return (
    <Box
      sx={{
        height: `calc(100vh - 130px)`,
        display: 'flex',
        justifyContent: 'space-between',
        alignContent: 'flex-start',
        flexWrap: 'wrap',
        overflowY: 'auto',
      }}>
      {cards &&
        cards.map((card, idx) => (
          <MemoryCard
            disabled={activePlayer.tag !== iAmPlayer.tag}
            key={idx}
            card={card}
            onClick={clickCard}
          />
        ))}
    </Box>
  );
};

export { PlayBoard };
