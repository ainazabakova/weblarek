import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import type { IFormActions } from "../../../types";

export abstract class Form<T> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(container: HTMLFormElement, actions?: IFormActions) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>(
      "button[type=submit]",
      this.container,
    );

    this.errorsElement = ensureElement<HTMLElement>(
      ".form__errors",
      this.container,
    );

    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      actions?.onSubmit?.();
    });

    this.container.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      if (target.name) {
        actions?.onChange?.(target.name, target.value);
      }
    });
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }
}
