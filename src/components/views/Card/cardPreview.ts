import { Card } from "./card";
import { ensureElement } from "../../../utils/utils";
import { categoryMap } from "../../../utils/constants";
import type { IProduct, ICardActions } from "../../../types";

type CategoryKey = keyof typeof categoryMap;

export type TCardPreview = Pick<
  IProduct,
  "title" | "price" | "image" | "category" | "description"
> & {
  buttonText: string;
  buttonDisabled: boolean;
};

export class CardPreview extends Card<TCardPreview> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected actionButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );

    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );

    this.actionButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );

    if (actions?.onClick) {
      this.actionButton.addEventListener("click", actions.onClick);
    }
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value,
      );
    }
  }

  set image(value: string) {
    this.setImage(
      this.imageElement,
      value,
      this.titleElement.textContent ?? "",
    );
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    this.actionButton.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.actionButton.disabled = value;
  }
}
