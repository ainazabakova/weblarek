import { Form } from "./form";
import { ensureElement } from "../../../utils/utils";
import type { IFormActions, TPayment } from "../../../types";

export type TOrderForm = {
  payment: TPayment;
  address: string;
  errors: string;
  valid: boolean;
};

export interface IOrderFormActions extends IFormActions {
  onPaymentChange?: (value: TPayment) => void;
}

export class OrderForm extends Form<TOrderForm> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, actions?: IOrderFormActions) {
    super(container, actions);

    this.cardButton = ensureElement<HTMLButtonElement>(
      "button[name=card]",
      this.container,
    );

    this.cashButton = ensureElement<HTMLButtonElement>(
      "button[name=cash]",
      this.container,
    );

    this.addressInput = ensureElement<HTMLInputElement>(
      "input[name=address]",
      this.container,
    );

    this.cardButton.addEventListener("click", () => {
      actions?.onPaymentChange?.("card");
    });

    this.cashButton.addEventListener("click", () => {
      actions?.onPaymentChange?.("cash");
    });
  }

  set payment(value: TPayment) {
    this.cardButton.classList.toggle("button_alt-active", value === "card");
    this.cashButton.classList.toggle("button_alt-active", value === "cash");
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}
