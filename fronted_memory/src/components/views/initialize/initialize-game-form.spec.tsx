import React from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { act, fireEvent, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { PlayInitialize } from './initialize-game-form.component';
import { DropdownItemType } from '../../mui/custom-dropdown.component';
import * as backendUtils from '../../../utils/backend.utils';
import { renderWithProviders } from '../../../store/test-utils';
import { expectedGameStateFe } from '../../../../test/test-constants';

jest.mock('../../../utils/backend.utils');
const mockedBackendUtils = backendUtils as jest.Mocked<typeof backendUtils>;

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  const navigate = jest.fn();
  return {
    __esModule: true,
    ...originalModule,
    useNavigate: () => navigate,
  };
});

const list: DropdownItemType[] = [
  { id: '234', value: 'Animals' },
  { id: '134', value: 'Transportmittel' },
  { id: '534', value: 'Greetings' },
];

describe(PlayInitialize.name, () => {
  beforeEach(async () => {
    await act(() => {
      renderWithProviders(
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PlayInitialize />} />
          </Routes>
        </BrowserRouter>
      );
    });
  });

  it('should NOT be possible to click start game, until cardset and nickname are set', async () => {
    // arrange
    mockedBackendUtils.fetchCardsetListFromBackend.mockReturnValue(
      Promise.resolve([...list])
    );

    // assert
    expect(screen.getByTestId('start-game-button')).toBeDisabled();

    // act: set nick name
    await act(() => {
      const nickNameInput = screen.getByLabelText('name');
      fireEvent.input(nickNameInput, { target: { value: 'my Name' } });
    });

    // assert
    expect(screen.getByTestId('start-game-button')).toBeDisabled();

    // act: choose cardset
    await act(() => {
      const dropdown = within(
        screen.getByTestId('available-cardsets-select')
      ).getByRole('button');
      fireEvent.mouseDown(dropdown);
    });
    await act(() => {
      const dropdownItem = within(screen.getByRole('listbox')).getByText(
        /Transportmittel/i
      );
      fireEvent.click(dropdownItem);
    });

    // assert
    expect(screen.getByTestId('start-game-button')).not.toBeDisabled();
  });

  it('should call start game of the backend, and input fields should be disabled', async () => {
    // arrange
    mockedBackendUtils.fetchCardsetListFromBackend.mockReturnValue(
      Promise.resolve([...list])
    );
    mockedBackendUtils.startGameToBackend.mockReturnValue(
      Promise.resolve({ ...expectedGameStateFe })
    );

    // act: set nick name
    const nickNameInput = await screen.findByLabelText('name');
    await act(async () => {
      fireEvent.input(nickNameInput, { target: { value: 'my Name' } });
    });

    // act: choose cardset
    await act(() => {
      const dropdown = within(
        screen.getByTestId('available-cardsets-select')
      ).getByRole('button');
      fireEvent.mouseDown(dropdown);
    });
    await act(() => {
      const dropdownItem = within(screen.getByRole('listbox')).getByText(
        /Transportmittel/i
      );
      fireEvent.click(dropdownItem);
    });

    // assert
    expect(screen.getByLabelText('name')).not.toBeDisabled();
    expect(
      screen.getByTestId('available-cardsets-select').querySelector('input')
    ).not.toBeDisabled();

    // act: click Start Game
    await act(() => {
      fireEvent.click(screen.getByTestId('start-game-button'));
    });

    // assert
    const nav = useNavigate();
    expect(nav).toHaveBeenCalledTimes(1);
    expect(mockedBackendUtils.startGameToBackend).toHaveBeenCalledTimes(1);
  });
});
