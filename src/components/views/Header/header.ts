import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import type { IHeaderActions } from "../../../types";

interface IHeaderData {
  counter: number;
}

export class Header extends Component<IHeaderData> {
  protected counterElement: HTMLElement;
  protected basketButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IHeaderActions) {
    super(container);

    this.counterElement = ensureElement<HTMLElement>(
      ".header__basket-counter",
      this.container,
    );

    this.basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container,
    );

    if (actions?.onClick) {
      this.basketButton.addEventListener("click", actions.onClick);
    }
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
