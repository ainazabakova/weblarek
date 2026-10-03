import "./scss/styles.scss";
import { EventEmitter } from "./components/base/Events";
import { Api } from "./components/base/Api";

import { Catalog } from "./components/models/catalog";
import { Cart } from "./components/models/cart";
import { Buyer } from "./components/models/buyer";
import { WebLarekApi } from "./components/models/webLarekApi";

import { CardCatalog } from "./components/views/Card/cardCatalog";
import { CardPreview } from "./components/views/Card/cardPreview";
import { CardBasket } from "./components/views/Card/cardBasket";

import { Gallery } from "./components/views/Gallery/gallery";
import { Modal } from "./components/views/Modal/modal";
import { Header } from "./components/views/Header/header";
import { Basket } from "./components/views/Basket/basket";
import { OrderForm } from "./components/views/Forms/orderForm";
import { ContactsForm } from "./components/views/Forms/contactsForm";
import { Success } from "./components/views/Success/success";

import { ensureElement, cloneTemplate } from "./utils/utils";
import type { IProduct, IOrderRequest, IOrderResponse } from "./types";
import { CDN_URL, API_URL } from "./utils/constants";

const events = new EventEmitter();
const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

const catalog = new Catalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");

const header = new Header(ensureElement(".header"), {
  onClick: () => events.emit("cart:open"),
});

const gallery = new Gallery(ensureElement(".gallery"));

const modal = new Modal(ensureElement(".modal"));

const basket = new Basket(cloneTemplate(basketTemplate), {
  onCheckout: () => events.emit("order:open"),
});

const orderForm = new OrderForm(
  cloneTemplate(orderTemplate) as HTMLFormElement,
  {
    onSubmit: () => events.emit("order:submit"),
    onChange: (field, value) => events.emit("order:change", { field, value }),
    onPaymentChange: (value) =>
      events.emit("order:change", { field: "payment", value }),
  },
);

const contactsForm = new ContactsForm(
  cloneTemplate(contactsTemplate) as HTMLFormElement,
  {
    onSubmit: () => events.emit("contacts:submit"),
    onChange: (field, value) =>
      events.emit("contacts:change", { field, value }),
  },
);

const success = new Success(cloneTemplate(successTemplate), {
  onClose: () => modal.close(),
});

const preview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
  onClick: () => events.emit("card:toggle"),
});

function updatePreviewButton(item: IProduct): {
  buttonText: string;
  buttonDisabled: boolean;
} {
  const inCart = cart.hasItem(item.id);
  const isPriceless = item.price === null;

  if (isPriceless) {
    return { buttonText: "Недоступно", buttonDisabled: true };
  }
  if (inCart) {
    return { buttonText: "Удалить из корзины", buttonDisabled: false };
  }
  return { buttonText: "Купить", buttonDisabled: false };
}

events.on("catalog:changed", () => {
  const itemCards = catalog.getProducts().map((item) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit("card:select", item),
    });

    return card.render({
      ...item,
      image: `${CDN_URL}${item.image}`,
    });
  });

  gallery.render({ catalog: itemCards });
});

events.on("catalog:selected", () => {
  const item = catalog.getSelectedProduct();
  if (!item) return;

  const buttonState = updatePreviewButton(item);

  preview.render({
    ...item,
    image: `${CDN_URL}${item.image}`,
    ...buttonState,
  });

  modal.render({ content: preview.render() });
  modal.open();
});

events.on("cart:changed", () => {
  header.render({ counter: cart.getCount() });

  const itemCards = cart.getItems().map((item, i) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onDelete: () => events.emit("cart:remove", item),
    });
    return card.render({
      title: item.title,
      price: item.price,
      index: i + 1,
    });
  });

  basket.render({
    items: itemCards,
    total: cart.getTotalPrice(),
    disabled: cart.getCount() === 0,
  });
});

events.on("buyer:changed", () => {
  const data = buyer.getData();
  const errors = buyer.validate();

  const orderErrors = [errors.payment, errors.address].filter(Boolean);
  const contactsErrors = [errors.email, errors.phone].filter(Boolean);

  orderForm.render({
    payment: data.payment,
    address: data.address,
    errors: orderErrors.join(", "),
    valid: orderErrors.length === 0,
  });

  contactsForm.render({
    email: data.email,
    phone: data.phone,
    errors: contactsErrors.join(", "),
    valid: contactsErrors.length === 0,
  });
});

events.on("card:select", (item: IProduct) => {
  catalog.setSelectedProduct(item);
});

events.on("card:toggle", () => {
  const item = catalog.getSelectedProduct();
  if (!item) return;

  if (cart.hasItem(item.id)) {
    cart.removeItem(item);
  } else {
    cart.addItem(item);
  }

  modal.close();
});

events.on("cart:remove", (item: IProduct) => {
  cart.removeItem(item);
});

events.on("cart:open", () => {
  modal.render({ content: basket.render() });
  modal.open();
});

events.on("order:open", () => {
  modal.render({ content: orderForm.render() });
  modal.open();
});

events.on(
  "order:change",
  ({ field, value }: { field: string; value: string }) => {
    buyer.setData({ [field]: value } as Record<string, string>);
  },
);

events.on("order:submit", () => {
  modal.render({ content: contactsForm.render() });
  modal.open();
});

events.on(
  "contacts:change",
  ({ field, value }: { field: string; value: string }) => {
    buyer.setData({ [field]: value } as Record<string, string>);
  },
);

events.on("contacts:submit", () => {
  const orderData: IOrderRequest = {
    ...buyer.getData(),
    total: cart.getTotalPrice(),
    items: cart.getItems().map((item) => item.id),
  };

  webLarekApi
    .postOrder(orderData)
    .then((result: IOrderResponse) => {
      modal.render({ content: success.render({ total: result.total }) });
      modal.open();

      cart.clear();
      buyer.clear();
    })
    .catch((error) => {
      console.error("Ошибка оформления заказа:", error);
    });
});

buyer.clear();
cart.clear();

webLarekApi
  .getProducts()
  .then((data) => {
    catalog.setProducts(data.items);
  })
  .catch((error) => {
    console.error("Ошибка загрузки товаров:", error);
  });
