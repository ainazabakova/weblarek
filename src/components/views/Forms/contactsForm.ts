import { Form } from "./form";
import { ensureElement } from "../../../utils/utils";
import type { IFormActions } from "../../../types";

export type TContactsForm = {
  email: string;
  phone: string;
  errors: string;
  valid: boolean;
};

export class ContactsForm extends Form<TContactsForm> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, actions?: IFormActions) {
    super(container, actions);

    this.emailInput = ensureElement<HTMLInputElement>(
      "input[name=email]",
      this.container,
    );

    this.phoneInput = ensureElement<HTMLInputElement>(
      "input[name=phone]",
      this.container,
    );
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}
