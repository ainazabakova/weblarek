import { Card } from "./card";
import { ensureElement } from "../../../utils/utils";
import type { IProduct, ICardActions } from "../../../types";

export type TBasketItem = Pick<IProduct, "title" | "price"> & {
  index: number;
};

export class CardBasket extends Card<TBasketItem> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );

    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container,
    );

    if (actions?.onDelete) {
      this.deleteButton.addEventListener("click", actions.onDelete);
    }
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
