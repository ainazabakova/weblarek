import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import type { IBasketActions } from "../../../types";

interface IBasketData {
  items: HTMLElement[];
  total: number;
  disabled: boolean;
}

export class Basket extends Component<IBasketData> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected checkoutButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IBasketActions) {
    super(container);

    this.listElement = ensureElement<HTMLElement>(
      ".basket__list",
      this.container,
    );

    this.totalElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.container,
    );

    this.checkoutButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container,
    );

    if (actions?.onCheckout) {
      this.checkoutButton.addEventListener("click", actions.onCheckout);
    }
  }

  set items(items: HTMLElement[]) {
    this.listElement.replaceChildren(...items);
  }

  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }

  set disabled(value: boolean) {
    this.checkoutButton.disabled = value;
  }
}
