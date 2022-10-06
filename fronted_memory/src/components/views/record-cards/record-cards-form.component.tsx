import React, { ChangeEvent, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import {
  CustomDropdown,
  DropdownItemType,
} from '../../mui/custom-dropdown.component';
import { postCardSetToBackend } from '../../../utils/backend.utils';
import {
  addCard,
  CardSpec,
  clear,
  NewCardSetState,
  selectIsCardListEmpty,
  selectNewCardSet,
  selectSpec,
  updateSetName,
  updateSpec,
} from '../../../store/new-card-set';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { CustomTextfield } from '../../mui/custom-textfield.component';
import { CustomButton } from '../../mui/custom-button.component';
import { fetchLanguages, selectLanguages } from '../../../store/languages';

const RecordCardsForm = () => {
  const dispatch = useAppDispatch();
  const newcardset = useAppSelector(selectNewCardSet);
  const specification = useAppSelector(selectSpec);
  const isCardListEmpty = useAppSelector(selectIsCardListEmpty);
  const [temporaryState, setTemporaryState] = useState({
    language1: '',
    language2: '',
  });
  const languages = useAppSelector(selectLanguages);
  const theme = useTheme();

  const updateLocalState = (event: ChangeEvent<HTMLInputElement>): void => {
    setTemporaryState({
      ...temporaryState,
      [event.target.name]: event.target.value,
    });
  };

  const addNewCard = () => {
    const newCard = {
      wordLng1: temporaryState.language1,
      wordLng2: temporaryState.language2,
    };
    dispatch(addCard(newCard));
  };

  const clearCards = () => {
    dispatch(clear());
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch(updateSetName(event.target.value));
  };

  const handleDropdownChange = (key: string, value: DropdownItemType): void => {
    dispatch(updateSpec({ [key]: value } as unknown as CardSpec));
  };

  const handleSelectOpen = async () => {
    dispatch(fetchLanguages());
  };

  const handleSubmit = async (data: NewCardSetState) => {
    await postCardSetToBackend(data);
    resetFields();
  };

  const resetFields = () => {
    dispatch(clear());
    setTemporaryState({ language1: '', language2: '' });
  };

  return (
    <Box
      sx={{
        [theme.breakpoints.down('sm')]: {
          mb: 1,
          mr: 2,
          width: 1,
          height: 264,
        },
        [theme.breakpoints.up('sm')]: {
          overflowY: 'auto',
          mr: 3,
          minWidth: 300,
          maxWidth: 450,
        },
      }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CustomTextfield
          id="title"
          changeHandler={handleTitleChange}
          label="Cardset Name"
          name="setName"
          value={specification.setName}
          dataTestId="record-cardset-name"
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            maxWidth: 500,
          }}>
          <Box sx={{ display: 'flex', flexGrow: 1, mr: 2 }}>
            <CustomDropdown
              id="language1"
              label="Language 1"
              changeHandler={handleDropdownChange}
              openHandler={handleSelectOpen}
              values={languages}
              currentValue={specification.language1}
              disabled={isCardListEmpty}
              dataTestId="record-cardset-main-language"
              emptyText="No languages available"
            />
          </Box>
          <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <CustomDropdown
              id="language2"
              label="Language 2"
              changeHandler={handleDropdownChange}
              openHandler={handleSelectOpen}
              values={languages}
              currentValue={specification.language2}
              disabled={isCardListEmpty}
              dataTestId="record-cardset-translation-language"
              emptyText="No languages available"
            />
          </Box>
        </Box>
        <CustomTextfield
          id="words"
          changeHandler={updateLocalState}
          label={specification.language1.value}
          name="language1"
          value={temporaryState.language1}
          dataTestId="record-cardset-term"
        />
        <CustomTextfield
          id="words"
          changeHandler={updateLocalState}
          label={specification.language2.value}
          name="language2"
          value={temporaryState.language2}
          dataTestId="record-cardset-translation"
        />
      </Box>
      <Box
        sx={{
          mt: 2,
          flexWrap: 'wrap',
          display: 'flex',
          justifyContent: 'space-between',
          maxWidth: 500,
        }}>
        <CustomButton clickHandler={addNewCard} buttonText="Add card" />
        <CustomButton
          clickHandler={clearCards}
          buttonText="Reset all"
          secondary={true}
        />
        <CustomButton
          clickHandler={() => handleSubmit(newcardset)}
          buttonText="Submit"
        />
      </Box>
    </Box>
  );
};

export { RecordCardsForm };
