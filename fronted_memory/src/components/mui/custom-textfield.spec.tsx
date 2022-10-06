import React, { ChangeEvent, useState } from 'react';
import {
  render,
  waitFor,
  screen,
  act,
  fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { CustomTextfield } from './custom-textfield.component';

describe(CustomTextfield.name, () => {
  const INITIAL_STATE: string = 'initial state';

  const getTextField = async () =>
    waitFor(
      () => screen.getByLabelText('test-textfield-label') as HTMLInputElement
    );

  it('should be rendered and not be disabled', async () => {
    // arrange
    render(
      <CustomTextfield
        id="123"
        name="test-textfield"
        label="test-textfield-label"
        changeHandler={() => {}}
        value={INITIAL_STATE}
      />
    );
    const textField = await getTextField();

    // assert
    expect(textField.value).toEqual(INITIAL_STATE);
    expect(textField.disabled).toBeFalsy();
  });

  it('should change', async () => {
    // arrange
    const UseCase = () => {
      const [value, setValue] = useState(INITIAL_STATE);

      const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
      };
      return (
        <CustomTextfield
          id="123"
          name="test-textfield"
          label="test-textfield-label"
          changeHandler={handleChange}
          value={value}
        />
      );
    };
    render(<UseCase />);
    const textField = await getTextField();

    // act
    await act(() => {
      fireEvent.input(textField, { target: { value: 'ending' } });
    });

    // assert
    expect(textField.value).toEqual('ending');
  });

  it('should be disabled if disable is set', async () => {
    // arrange
    render(
      <CustomTextfield
        id="123"
        name="test-textfield"
        label="test-textfield-label"
        changeHandler={() => {}}
        value={INITIAL_STATE}
        disabled
      />
    );

    const textField = await getTextField();

    // assert
    expect(textField.disabled).toBeTruthy();
  });

  it('should be disabled if disable is set to true', async () => {
    // arrange
    render(
      <CustomTextfield
        id="123"
        name="test-textfield"
        label="test-textfield-label"
        changeHandler={() => {}}
        value={INITIAL_STATE}
        disabled={true}
      />
    );

    const textField = await getTextField();

    // assert
    expect(textField.disabled).toBeTruthy();
  });
});
