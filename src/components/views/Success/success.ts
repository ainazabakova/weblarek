import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";

export interface ISuccessActions {
  onClose?: () => void;
}
interface ISuccessData {
  total: number;
}

export class Success extends Component<ISuccessData> {
  protected totalElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ISuccessActions) {
    super(container);

    this.totalElement = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container,
    );

    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container,
    );

    if (actions?.onClose) {
      this.closeButton.addEventListener("click", actions.onClose);
    }
  }

  set total(value: number) {
    this.totalElement.textContent = `Списано ${value} синапсов`;
  }
}
