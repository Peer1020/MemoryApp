import React from 'react';
import { CustomButton } from './custom-button.component';
import {
  render,
  waitFor,
  screen,
  act,
  fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe(CustomButton.name, () => {
  let button: HTMLButtonElement;
  let text: string = '';

  beforeEach(async () => {
    // arrange
    render(
      <CustomButton
        clickHandler={() => {
          text = 'isSet';
        }}
        buttonText="Test Button"
      />
    );
    button = (await waitFor(() =>
      screen.getByRole('button')
    )) as HTMLButtonElement;
  });

  it('should be rendered', async () => {
    // assert
    expect(button).toHaveTextContent('Test Button');
  });

  it('should have a working clickhandler', async () => {
    // act
    await act(() => {
      fireEvent.click(button);
    });

    // assert
    expect(text).toEqual('isSet');
  });
});
