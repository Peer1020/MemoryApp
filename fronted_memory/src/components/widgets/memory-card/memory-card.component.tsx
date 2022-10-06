import React from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  useTheme,
} from '@mui/material';
import { CardFe } from '../../../store/play-game';

export interface MemoryCardProps {
  card: CardFe;
  disabled?: boolean;
  onClick?: (card: CardFe) => void;
}
const MemoryCard = ({ card, disabled, onClick }: MemoryCardProps) => {
  const theme = useTheme();

  const clickOnCard = (card: CardFe) => {
    onClick && onClick(card);
  };

  return (
    <Card
      sx={{
        mb: 2,
        mr: 2,
        bgcolor: theme.palette.primary.light,
        width: 150,
        maxHeight: 'fit-content',
      }}
      data-testid="card">
      <CardActionArea
        sx={{ height: 50 }}
        data-testid="card-button"
        onClick={() => clickOnCard(card)}
        disabled={card.switched || card.temporarilySwitched || disabled}>
        <CardContent>
          <Typography variant="body1" align="center">
            {card.word}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export { MemoryCard };
