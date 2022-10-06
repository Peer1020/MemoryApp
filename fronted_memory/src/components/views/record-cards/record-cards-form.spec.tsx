import React from 'react';
import { act, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from '../../../store/test-utils';
import * as backendUtils from '../../../utils/backend.utils';
import { RecordCardsForm } from './record-cards-form.component';
import {
  cardSetState,
  mockLanguages,
  RecordForm,
} from '../../../../test/record-helpers';
import { DropdownItemType } from '../../mui/custom-dropdown.component';

jest.mock('../../../utils/backend.utils');
const mockedBackendUtils = backendUtils as jest.Mocked<typeof backendUtils>;

const mockFetchLanguagesFromBackend = jest.fn(
  async (): Promise<DropdownItemType[]> => {
    return [
      { id: '1', value: 'Deutsch' },
      { id: '2', value: 'Svenska' },
      { id: '3', value: 'Francais' },
      { id: '4', value: 'English' },
    ];
  }
);

describe(RecordCardsForm.name, () => {
  afterEach(() => {
    mockedBackendUtils.postCardSetToBackend.mockClear();
    mockedBackendUtils.fetchLanguagesFromBackend.mockClear();
  });

  it('should fetch the languages from the BE and show them, clicking the dropdown', async () => {
    // arrange
    renderWithProviders(<RecordCardsForm />);
    mockedBackendUtils.fetchLanguagesFromBackend.mockImplementation(
      mockFetchLanguagesFromBackend
    );
    const { dropdown2 } = new RecordForm();

    // act
    await dropdown2.open();

    // assert
    const { getAllByTestId, getByText } = within(screen.getByRole('listbox'));
    expect(getAllByTestId('dropdown-menu-item').length).toBe(4);
    expect(getByText('Deutsch')).toBeTruthy();
    expect(getByText('Svenska')).toBeTruthy();
    expect(getByText('Francais')).toBeTruthy();
    expect(getByText('English')).toBeTruthy();
    expect(mockedBackendUtils.fetchLanguagesFromBackend).toHaveBeenCalledTimes(
      1
    );
  });

  it('should disable the language selection, clicking "add card" button', async () => {
    // arrange
    renderWithProviders(<RecordCardsForm />, {
      preloadedState: {
        newCardSet: { ...cardSetState },
        languages: { languages: [...mockLanguages], status: 'idle' },
      },
    });

    // act
    const { addCardButton, dropdown1, dropdown2 } = new RecordForm();
    await addCardButton.click();

    //assert
    expect(dropdown1.isExistingAndDisabled()).toBeTruthy();
    expect(dropdown2.isExistingAndDisabled()).toBeTruthy();
  });

  it('should clear the form, clicking the "submit" button', async () => {
    // arrange
    await act(() => {
      renderWithProviders(<RecordCardsForm />, {
        preloadedState: {
          newCardSet: { ...cardSetState },
          languages: { languages: [...mockLanguages], status: 'idle' },
        },
      });
    });
    const { isFormEmpty, submitButton } = new RecordForm();

    // assert
    expect(isFormEmpty()).toBeFalsy();

    // act
    await submitButton.click();

    // assert
    expect(isFormEmpty()).toBeTruthy();
  });

  it('should post a new cardset to the backend, clicking the "submit" button', async () => {
    // arrange
    renderWithProviders(<RecordCardsForm />, {
      preloadedState: {
        newCardSet: { ...cardSetState },
        languages: { languages: [...mockLanguages], status: 'idle' },
      },
    });

    // act
    const { submitButton } = new RecordForm();
    await submitButton.click();

    // assert
    expect(mockedBackendUtils.postCardSetToBackend).toHaveBeenCalledTimes(1);
  });
});
