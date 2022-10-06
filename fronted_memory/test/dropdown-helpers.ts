import { fireEvent, within } from '@testing-library/react';

export class Dropdown {
  private readonly _element: HTMLElement;
  private readonly _id: string;

  constructor(element: HTMLElement, id: string) {
    this._element = element;
    this._id = id;
  }

  public get label(): HTMLLabelElement | null {
    return this._element.querySelector(`label[id="label-${this._id}"]`);
  }

  public get element(): HTMLElement {
    return this._element;
  }

  public get selectedItem(): HTMLDivElement | null {
    return this._element.querySelector(`div[id=${this._id}]`);
  }

  public get inputElement(): HTMLInputElement | null {
    return this.element.querySelector(`input`);
  }

  public open(): void {
    const button = within(this._element).getByRole('button');
    fireEvent.mouseDown(button);
  }
}

export class DropdownItems {
  private _elements: HTMLLIElement[];

  constructor(elements: HTMLLIElement[]) {
    this._elements = elements;
  }

  public get elements() {
    return this._elements;
  }

  public get visualItems() {
    return this._elements.map((el) => el.textContent);
  }
}
