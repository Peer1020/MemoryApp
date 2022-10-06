import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { CustomDropdown, DropdownItemType } from './custom-dropdown.component';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Dropdown, DropdownItems } from '../../../test/dropdown-helpers';

const expectedDropdownItems: DropdownItemType[] = [
  { id: '45632', value: 'Tiere' },
  { id: '45432', value: 'Transports' },
  { id: '87123', value: 'familj' },
];

describe(CustomDropdown.name, () => {
  it('should be rendered with label text and no input value, if nothing is selected', async () => {
    // arrange
    const dropdownId = 'test-dropdown';
    const labelText = 'test dropdown';
    const { container } = render(
      <CustomDropdown
        id={dropdownId}
        label={labelText}
        changeHandler={() => {}}
        openHandler={() => {}}
        currentValue={{ id: '', value: '' } as DropdownItemType}
        values={expectedDropdownItems}
        emptyText="No items available"
      />
    );
    const dropdown = new Dropdown(container, dropdownId);
    const emptySpan = dropdown.selectedItem?.querySelector('span');

    // assert
    expect(dropdown.label).toHaveTextContent(labelText);
    expect(dropdown.inputElement).toHaveTextContent('');
    expect(emptySpan).toHaveTextContent('\u200b');
  });

  it('should be rendered with label text and input value, if item is selected', async () => {
    // arrange
    const dropdownId = 'test-dropdown';
    const labelText = 'test dropdown';
    const { container } = render(
      <CustomDropdown
        id={dropdownId}
        label={labelText}
        changeHandler={() => {}}
        openHandler={() => {}}
        currentValue={expectedDropdownItems[1]}
        values={expectedDropdownItems}
        emptyText="No items available"
      />
    );
    const dropdown = new Dropdown(container, dropdownId);

    // assert
    expect(dropdown.label).toHaveTextContent(labelText);
    expect(dropdown.inputElement).toHaveValue(expectedDropdownItems[1].id);
    expect(dropdown.selectedItem).toHaveTextContent(
      expectedDropdownItems[1].value
    );
  });

  it('should be opened, clicking on it', async () => {
    // arrange
    const mockOpenHandler: jest.Mock<void> = jest.fn(() => {});
    const dropdownId = 'test-dropdown';
    const labelText = 'test dropdown';
    const all = render(
      <CustomDropdown
        id={dropdownId}
        label={labelText}
        changeHandler={() => {}}
        openHandler={mockOpenHandler}
        currentValue={expectedDropdownItems[1]}
        values={expectedDropdownItems}
        emptyText="No items available"
      />
    );
    const expectedShownItems = expectedDropdownItems.map((item) => item.value);

    // act
    const dropdown = new Dropdown(all.container, dropdownId);
    dropdown.open();
    const dropdownItems = new DropdownItems(
      await screen.findAllByTestId('dropdown-menu-item')
    );

    // assert
    expect(dropdownItems.visualItems).toEqual(expectedShownItems);
    expect(mockOpenHandler).toHaveBeenCalledTimes(1);
  });

  it('should execute change handler, if another element is selected', async () => {
    // arrange
    const mockChangeHandler: jest.Mock<
      void,
      [targetName: string, selection: DropdownItemType]
    > = jest.fn((targetName: string, selection: DropdownItemType) => {});
    const dropdownId = 'test-dropdown';
    const labelText = 'test dropdown';
    let currentValue = expectedDropdownItems[1];
    const { container } = render(
      <CustomDropdown
        id={dropdownId}
        label={labelText}
        changeHandler={mockChangeHandler}
        openHandler={() => {}}
        currentValue={currentValue}
        values={expectedDropdownItems}
        dataTestId="data-testid"
        emptyText="No items available"
      />
    );
    const dropdown = new Dropdown(container, dropdownId);

    // act
    await act(() => {
      fireEvent.input(dropdown.inputElement || ({} as HTMLInputElement), {
        target: { value: '87123' },
      });
    });

    // assert
    expect(mockChangeHandler.mock.calls[0][0]).toEqual('test-dropdown');
    expect(mockChangeHandler.mock.calls[0][1]).toEqual({
      id: '87123',
      value: 'familj',
    });
    expect(mockChangeHandler).toHaveBeenCalledTimes(1);
  });
});
