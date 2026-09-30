import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import type { IModalActions } from "../../../types";

interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  protected contentElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IModalActions) {
    super(container);

    this.contentElement = ensureElement<HTMLElement>(
      ".modal__content",
      this.container,
    );

    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container,
    );

    this.closeButton.addEventListener("click", () => {
      actions?.onClose?.();
    });

    this.container.addEventListener("click", (e) => {
      if (e.target === this.container) {
        actions?.onClose?.();
      }
    });
  }

  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }

  open(): void {
    this.container.classList.add("modal_active");
  }

  close(): void {
    this.container.classList.remove("modal_active");
    this.contentElement.replaceChildren();
  }
}
