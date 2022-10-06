import React from 'react';
import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  useTheme,
} from '@mui/material';
import { clearCard, selectNewCards } from '../../../store/new-card-set';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import DeleteIcon from '@mui/icons-material/Delete';

const RecordCardsDisplay = () => {
  const newCards = useAppSelector(selectNewCards);
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const deleteExistingCard = (idx: number) => {
    dispatch(clearCard(idx));
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        minWidth: 230,
        [theme.breakpoints.down('sm')]: {
          height: `calc(100vh - 110px - 290px)`,
        },
        [theme.breakpoints.up('sm')]: {
          height: `calc(100vh - 110px)`,
        },
      }}>
      <List
        sx={{
          width: 1,
          bgcolor: 'background.paper',
          mr: 2,
          maxWidth: 500,
          [theme.breakpoints.down('sm')]: {
            height: `calc(100vh - 110px - 290px)`,
          },
          [theme.breakpoints.up('sm')]: {
            height: `calc(100vh - 110px - 20px)`,
          },
          overflowY: 'auto',
        }}>
        {newCards.length > 0 &&
          newCards.map((card, idx) => (
            <ListItem
              key={idx}
              sx={{ bgcolor: '#e9ddff', my: 1 }}
              secondaryAction={
                <IconButton
                  onClick={() => deleteExistingCard(idx)}
                  color="primary"
                  edge="end"
                  aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              }
              data-testid="record-cardset-display-card">
              <ListItemAvatar>
                <Avatar>W</Avatar>
              </ListItemAvatar>
              <ListItemText primary={`${card.wordLng1} - ${card.wordLng2}`} />
            </ListItem>
          ))}
      </List>
    </Box>
  );
};

export { RecordCardsDisplay };
