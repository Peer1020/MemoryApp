import { act, fireEvent, screen, within } from '@testing-library/react';
import { DropdownItemType } from '../src/components/mui/custom-dropdown.component';
import { NewCardSetState } from '../src/store/new-card-set';

class Input {
  testId: string;
  querySelector: string;
  constructor(testId: string, querySelector: string) {
    this.testId = testId;
    this.querySelector = querySelector;
  }
  public get element(): HTMLInputElement | null {
    return screen
      .getByTestId(this.testId)
      .querySelector(`input[name=${this.querySelector}]`);
  }
  isValueEmpty = (): boolean => {
    const element: HTMLInputElement | null = screen
      .getByTestId(this.testId)
      .querySelector(`input[name=${this.querySelector}]`);
    return Boolean(element?.value === '');
  };
}

class Dropdown extends Input {
  select = async (value: DropdownItemType) => {
    const el = this.element;
    act(() => {
      el && fireEvent.change(el, { target: { value } });
    });
  };
  open = async () => {
    await act(async () => {
      const el = await screen.findByTestId(this.testId);
      fireEvent.mouseDown(within(el).getByRole('button'));
    });
  };
  isExistingAndDisabled = (): boolean => Boolean(this.element?.disabled);
  isExistingAndEnabled = (): boolean =>
    Boolean(this.element && !this.element.disabled);
}

class TextInput extends Input {
  change = async (value: string) => {
    act(() => {
      this.element &&
        fireEvent.change(this.element, {
          target: { value },
        });
    });
  };
}

class Button {
  buttonName: string;

  constructor(buttonName: string) {
    this.buttonName = buttonName;
  }
  click = async () => {
    await act(async () => {
      const button = await screen.findByText(this.buttonName);
      fireEvent.click(button);
    });
  };
}

export const cardSetState: NewCardSetState = {
  cards: [
    { wordLng1: 'Ich', wordLng2: 'I' },
    { wordLng1: 'Du', wordLng2: 'You' },
  ],
  language1: { id: '1', value: 'Deutsch' },
  language2: { id: '4', value: 'English' },
  setName: 'Pronomen',
};

export const mockLanguages: DropdownItemType[] = [
  { id: '1', value: 'Deutsch' },
  { id: '2', value: 'Svenska' },
  { id: '3', value: 'Francais' },
  { id: '4', value: 'English' },
];

export interface FormInput {
  cardsetName?: string;
  language1?: DropdownItemType;
  language2?: DropdownItemType;
  word1?: string;
  word2?: string;
}

export class RecordForm {
  cardsetName: TextInput;
  dropdown1: Dropdown;
  dropdown2: Dropdown;
  word1: TextInput;
  word2: TextInput;
  addCardButton: Button;
  resetAllButton: Button;
  submitButton: Button;

  constructor() {
    this.cardsetName = new TextInput('record-cardset-name', 'setName');
    this.dropdown1 = new Dropdown('record-cardset-main-language', 'language1');
    this.dropdown2 = new Dropdown(
      'record-cardset-translation-language',
      'language2'
    );
    this.word1 = new TextInput('record-cardset-term', 'language1');
    this.word2 = new TextInput('record-cardset-translation', 'language2');
    this.addCardButton = new Button('Add card');
    this.resetAllButton = new Button('Reset all');
    this.submitButton = new Button('Submit');
  }

  fillOutForm = async ({
    cardsetName,
    language1,
    language2,
    word1,
    word2,
  }: FormInput): Promise<void> => {
    cardsetName && (await this.cardsetName.change(cardsetName));
    language1 && (await this.dropdown1.select(language1));
    language2 && (await this.dropdown2.select(language2));
    word1 && (await this.word1.change(word1));
    word2 && (await this.word2.change(word2));
  };

  isFormEmpty = (): boolean =>
    this.cardsetName.isValueEmpty() &&
    this.dropdown1.isValueEmpty() &&
    this.dropdown2.isValueEmpty() &&
    this.word1.isValueEmpty() &&
    this.word2.isValueEmpty();
}
