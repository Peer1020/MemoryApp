import React, { ChangeEvent, useState } from 'react';
import { Box } from '@mui/material';
import { CustomTextfield } from '../../mui/custom-textfield.component';
import { fetchStartGame, selectGameState } from '../../../store/play-game';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  fetchCardSetListAsync,
  selectCardsetList,
  selectNickName,
  setNickName,
} from '../../../store/initialize-game';
import {
  CustomDropdown,
  DropdownItemType,
} from '../../mui/custom-dropdown.component';
import { CustomButton } from '../../mui/custom-button.component';
import { useNavigate } from 'react-router-dom';

const PlayInitialize = () => {
  const dispatch = useAppDispatch();
  const cardsets: DropdownItemType[] = useAppSelector(selectCardsetList);
  const gameState = useAppSelector(selectGameState);
  const nickName = useAppSelector(selectNickName);
  const [selectedCardset, setSelectedCardset] = useState({
    id: '',
    value: '',
  } as DropdownItemType);
  const navigate = useNavigate();

  const startGame = (): void => {
    if (nickName && selectedCardset.id) {
      dispatch(
        fetchStartGame({ name: nickName, cardsetId: selectedCardset.id })
      );
      navigate('play');
    }
  };

  const handleSelectOpen = () => {
    dispatch(fetchCardSetListAsync());
  };

  const handleSelectChange = (
    targetName: string,
    selection: DropdownItemType
  ): void => {
    setSelectedCardset(selection);
  };

  const changeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch(setNickName(event.target.value));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        mb: 2,
      }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CustomTextfield
          id="nick-name"
          name="nick-name"
          label="name"
          changeHandler={changeHandler}
          value={nickName}
          dataTestId="nick-name-input"
          disabled={gameState === 'NEW' || gameState === 'IN_PROGRESS'}
        />
        <CustomDropdown
          id="available-cardsets"
          label="available cardsets"
          changeHandler={handleSelectChange}
          openHandler={handleSelectOpen}
          currentValue={selectedCardset}
          values={cardsets}
          dataTestId="available-cardsets-select"
          disabled={gameState === 'NEW' || gameState === 'IN_PROGRESS'}
          emptyText="No recorded cardsets"
        />
      </Box>
      <Box sx={{ ml: 2, mt: 1 }}>
        <CustomButton
          clickHandler={startGame}
          buttonText="Start Game"
          disabled={!nickName || selectedCardset.id === ''}
          dataTestId="start-game-button"
        />
      </Box>
    </Box>
  );
};

export { PlayInitialize };
