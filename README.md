# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:

- src/ - исходные файлы проекта
- src/components/ - папка с JS компонентами
- src/components/base/ - папка с базовым кодом

Важные файлы:

- index.html - HTML-файл главной страницы
- src/types/index.ts - файл с типами
- src/main.ts - точка входа приложения и презентер
- src/scss/styles.scss - корневой файл стилей
- src/utils/constants.ts - файл с константами
- src/utils/utils.ts - файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Интернет-магазин "Web-Larёk"

"Web-Larёk" - это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.

View - слой представления, отвечает за отображение данных на странице.

Presenter - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события, используя методы как Моделей, так и Представлений.

## Константы проекта

`API_URL` - базовый адрес сервера. Для выполнения запроса к API необходимо добавить эндпоинт. Собирается из переменной окружения `VITE_API_ORIGIN`.

`CDN_URL` - базовый адрес для формирования полного пути к картинкам товаров. Для получения полной ссылки на картинку необходимо к `CDN_URL` добавить название файла изображения, которое хранится в поле `image` объекта товара.

`categoryMap` - объект соответствий категорий товара CSS-модификаторам, используемым для отображения фона категории.

### Базовый код

#### Класс Component

Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:
`constructor(container: HTMLElement)` - принимает ссылку на DOM-элемент, за отображение которого он отвечает.

Поля класса:
`container: HTMLElement` - поле для хранения корневого DOM-элемента компонента.

Методы класса:
`render(data?: Partial<T>): HTMLElement` - главный метод класса. Принимает данные, которые необходимо отобразить, записывает их в поля класса через `Object.assign` (что вызывает соответствующие сеттеры наследника) и возвращает ссылку на DOM-элемент.
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`.

#### Класс Api

Содержит в себе базовую логику отправки запросов.

Конструктор:
`constructor(baseUrl: string, options: RequestInit = {})` - в конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:
`baseUrl: string` - базовый адрес сервера
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:
`get(uri: string): Promise<object>` - выполняет GET-запрос на переданный в параметрах эндпоинт и возвращает промис с объектом, которым ответил сервер.
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на эндпоинт.
`handleResponse(response: Response): Promise<object>` - защищенный метод, проверяющий ответ сервера на корректность.

#### Класс EventEmitter

Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:
`_events: Map<string | RegExp, Set<Function>>` - хранит коллекцию подписок на события.

Методы класса:
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие.
`emit<T extends object>(event: string, data?: T): void` - инициализация события.
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое событие.

## Данные

Описание TypeScript-интерфейсов, которые используются при работе с API.

### IBuyer

Описаны данные покупателя для совершения заказа.

#### Связанные типы

##### TPayment

```ts
type TPayment = "card" | "cash" | "";
```

#### Поля

`payment`: `TPayment` - способ оплаты.
`email`: `string` - email покупателя.
`phone`: `string` - телефон в свободном формате.
`address`: `string` - адрес доставки.

#### Пример использования

```json
{
  "payment": "card",
  "email": "user@example.com",
  "phone": "+79999999999",
  "address": "г. Москва, ул. Пушкина, д. 67"
}
```

### IProduct

Описание интерфейса продукта в интернет-магазине.

#### Поля

`id`: `string` - уникальный идентификатор товара.
`description`: `string` - описание товара.
`image`: `string` - имя файла изображения товара. Полный путь собирается через `CDN_URL`.
`title`: `string` - название товара.
`category`: `string` - категория (группа).
`price`: `number | null` - стоимость.

#### Пример использования

```json
{
  "id": "c101ab44-ed99-4a54-990d-47aa2bb4e7d9",
  "description": "Лизните этот леденец, чтобы мгновенно запоминать и узнавать любой цветовой код CSS.",
  "image": "/Shell.svg",
  "title": "HEX-леденец",
  "category": "другое",
  "price": 1450
}
```

## Модели данных

Все модели данных принимают в конструктор брокер событий `IEvents` и генерируют события при изменении данных. Это ключевое требование архитектуры: любое изменение данных в модели сопровождается событием.

### Класс Catalog

#### Назначение

Хранит все товары, доступные в приложении, и товар, выбранный для подробного отображения. Отвечает за хранение и выдачу данных, а также уведомляет об изменениях через брокер событий.

#### Конструктор

`constructor(events: IEvents)` - принимает брокер событий для генерации событий при изменении данных.

#### Поля

`products`: `IProduct[]` - массив всех товаров, полученных с сервера.
`selectedProduct`: `IProduct | null` - товар, выбранный для подробного отображения. Если ничего не выбрано - `null`.

#### Методы

`setProducts(products: IProduct[]): void` - сохраняет массив товаров и генерирует событие `catalog:changed`.
`getProducts(): IProduct[]` - возвращает массив всех товаров.
`getProductById(id: string): IProduct | undefined` - возвращает товар по `id`.
`setSelectedProduct(product: IProduct): void` - сохраняет товар для подробного отображения и генерирует событие `catalog:selected`.
`getSelectedProduct(): IProduct | null` - возвращает выбранный товар.

#### Генерируемые события

`catalog:changed` - генерируется в `setProducts` после сохранения массива товаров.
`catalog:selected` - генерируется в `setSelectedProduct` после сохранения выбранного товара.

#### Пример использования

```ts
const catalog = new Catalog(events);

catalog.setProducts(products);

const all = catalog.getProducts();
const one = catalog.getProductById("c101ab44-ed99-4a54-990d-47aa2bb4e7d9");

catalog.setSelectedProduct(one!);
const selected = catalog.getSelectedProduct();
```

### Класс Cart

#### Назначение

Хранит товары, которые покупатель выбрал для покупки. Отвечает за добавление, удаление, очистку и подсчёт данных корзины. Уведомляет об изменениях через брокер событий.

#### Конструктор

`constructor(events: IEvents)` - принимает брокер событий.

#### Поля

`items`: `IProduct[]` - массив товаров в корзине.

#### Методы

`getItems(): IProduct[]` - возвращает массив товаров в корзине.
`addItem(product: IProduct): void` - добавляет товар в корзину и генерирует событие `cart:changed`.
`removeItem(product: IProduct): void` - удаляет товар из корзины и генерирует событие `cart:changed`.
`clear(): void` - очищает корзину и генерирует событие `cart:changed`.
`getTotalPrice(): number` - возвращает стоимость всех товаров в корзине.
`getCount(): number` - возвращает количество товаров в корзине.
`hasItem(id: string): boolean` - проверяет наличие товара по `id`.

#### Генерируемые события

`cart:changed` - генерируется в `addItem`, `removeItem` и `clear` при любом изменении содержимого корзины.

#### Пример использования

```ts
const cart = new Cart(events);

cart.addItem(product);
cart.addItem(anotherProduct);

console.log(cart.getCount());
console.log(cart.getTotalPrice());
console.log(cart.hasItem(product.id));

cart.removeItem(product);
cart.clear();
```

### Класс Buyer

#### Назначение

Хранит данные покупателя, которые тот указывает при оформлении заказа, и отвечает за их валидацию. Уведомляет об изменениях через брокер событий.

#### Конструктор

`constructor(events: IEvents)` - принимает брокер событий.

#### Поля

`payment`: `TPayment | ''` - вид оплаты. Пустая строка означает, что оплата ещё не выбрана.
`address`: `string` - адрес доставки.
`phone`: `string` - телефон покупателя.
`email`: `string` - email покупателя.

#### Методы

`setData(data: Partial<IBuyer>): void` - сохраняет данные в модели и генерирует событие `buyer:changed`.
`getData(): IBuyer` - возвращает все данные покупателя.
`clear(): void` - очищает данные покупателя и генерирует событие `buyer:changed`.
`validate(): Partial<Record<keyof IBuyer, string>>` - проверяет валидность данных. Возвращает объект с ошибками. Метод не генерирует событий, так как только читает состояние.

#### Генерируемые события

`buyer:changed` - генерируется в `setData` и `clear`.

#### Пример использования

```ts
const buyer = new Buyer(events);

buyer.setData({ email: "user@example.com" });
buyer.setData({ phone: "+79990000000" });
console.log(buyer.getData());
console.log(buyer.validate());

buyer.clear();
```

Пример возвращаемого значения `validate()`:

```ts
{
  payment: 'Не выбран вид оплаты',
  email: 'Укажите емэйл',
}
```

## View

Описание компонентов интерфейса.

### Класс Card

#### Назначение

Базовый абстрактный класс для всех карточек товара. Наследуется от `Component<T>`. Отвечает за отображение общих для любой карточки элементов - заголовка и цены. Предоставляет наследникам инфраструктуру для рендера данных.

#### Конструктор

Конструктор принимает корневой DOM-элемент карточки и необязательный объект с обработчиками действий. Если в объекте передан `onClick`, он навешивается на контейнер карточки.

#### Поля

`container`: `HTMLElement` - корневой DOM-элемент карточки.
`titleElement`: `HTMLElement` - элемент заголовка с селектором `.card__title`.
`priceElement`: `HTMLElement` - элемент цены с селектором `.card__price`.

#### Сеттеры

`set title(value: string): void` - устанавливает текст заголовка.
`set price(value: number | null): void` - устанавливает текст цены. Если передано `null`, выводится "Бесценно". Иначе выводится значение с подписью "синапсов".

#### Методы

`render(data?: Partial<T>): HTMLElement` - унаследован от `Component<T>`. Применяет данные через `Object.assign` и возвращает корневой элемент.

### Класс CardCatalog

#### Назначение

Карточка товара в каталоге. Наследуется от `Card<TCardCatalog>`. Помимо общих элементов, отображает изображение и категорию с цветовой подсветкой.

#### Конструктор

Конструктор принимает корневой элемент и необязательный объект с обработчиками. Находит элементы изображения и категории внутри контейнера. Если передан `onClick`, он навешивается на контейнер карточки, потому что клик по всей карточке открывает превью товара.

#### Тип данных

```ts
export type TCardCatalog = Pick<IProduct, 'image' | 'category'>;
```

#### Поля

`imageElement`: `HTMLImageElement` - элемент изображения с селектором `.card__image`.
`categoryElement`: `HTMLElement` - элемент категории с селектором `.card__category`.

#### Сеттеры

`set category(value: string): void` - устанавливает текст категории и переключает CSS-модификатор из объекта `categoryMap`.
`set image(value: string): void` - устанавливает изображение через `setImage` базового класса.

#### Генерируемые события

`card:select` с payload `IProduct` - генерируется, когда пользователь кликнул по карточке.

#### Пример использования

```ts
const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
    onClick: () => events.emit('card:select', item)
});

card.render({
    ...item,
    image: `${CDN_URL}${item.image}`
});
```

### Класс CardPreview

#### Назначение

Карточка товара в модальном окне превью. Наследуется от `Card<TCardPreview>`. Отображает подробную информацию о товаре: изображение, категорию, заголовок, описание, цену и кнопку действия.

#### Конструктор

Конструктор принимает корневой элемент и необязательный объект с обработчиками. Находит элементы изображения, категории, описания и кнопки действия. Если передан `onClick`, он навешивается на кнопку действия, а не на контейнер.

#### Тип данных

```ts
export type TCardPreview = Pick<IProduct, 'image' | 'category' | 'description'>;
```

#### Поля

`imageElement`: `HTMLImageElement` - элемент изображения с селектором `.card__image`.
`categoryElement`: `HTMLElement` - элемент категории с селектором `.card__category`.
`descriptionElement`: `HTMLElement` - элемент описания с селектором `.card__text`.
`actionButton`: `HTMLButtonElement` - кнопка действия с селектором `.card__button`.

#### Сеттеры

`set category(value: string): void` - устанавливает текст категории и переключает CSS-модификатор из `categoryMap`.
`set image(value: string): void` - устанавливает изображение.
`set description(value: string): void` - устанавливает текст описания.
`set buttonText(value: string): void` - устанавливает текст на кнопке.
`set buttonDisabled(value: boolean): void` - включает или выключает кнопку.

Сеттеры `buttonText` и `buttonDisabled` не входят в тип `TCardPreview`, потому что не приходят из данных товара. Их устанавливает презентер в зависимости от состояния корзины.

#### Генерируемые события

`card:toggle` с payload `IProduct` - генерируется, когда пользователь кликнул по кнопке действия.

#### Пример использования

```ts
const preview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => events.emit('card:toggle', item)
});

preview.render({
    ...item,
    image: `${CDN_URL}${item.image}`
});

preview.buttonText = 'Купить';
preview.buttonDisabled = false;
```

### Класс CardBasket

#### Назначение

Карточка товара в корзине. Наследуется от `Card<TBasketItem>`. Отображает позицию товара в корзине: заголовок, цену, порядковый номер и кнопку удаления.

#### Конструктор

Конструктор принимает корневой элемент и необязательный объект с обработчиками. Находит элементы порядкового номера и кнопки удаления. Если передан `onDelete`, он навешивается на кнопку удаления.

#### Тип данных

```ts
export type TBasketItem = Pick<IProduct, 'title' | 'price'> & {
    index: number;
};
```

#### Поля

`indexElement`: `HTMLElement` - элемент порядкового номера с селектором `.basket__item-index`.
`deleteButton`: `HTMLButtonElement` - кнопка удаления с селектором `.basket__item-delete`.

#### Сеттеры

`set index(value: number): void` - устанавливает порядковый номер позиции.

#### Генерируемые события

`cart:remove` с payload `IProduct` - генерируется, когда пользователь кликнул по кнопке удаления.

#### Пример использования

```ts
const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
    onDelete: () => events.emit('cart:remove', item)
});

card.render({
    title: item.title,
    price: item.price,
    index: i + 1
});
```

### Схема наследования карточек

Базовый класс `Card<T>` является абстрактным. От него наследуются три класса.

Класс `CardCatalog` наследуется от `Card<TCardCatalog>`.
Класс `CardPreview` наследуется от `Card<TCardPreview>`.
Класс `CardBasket` наследуется от `Card<TBasketItem>`.

### Класс Form

#### Назначение

Базовый абстрактный класс для всех форм приложения. Наследуется от `Component<T>`. Отвечает за общие для любой формы элементы: кнопку отправки и блок ошибок.

Наследники:
`OrderForm`
`ContactsForm`

#### Конструктор

Конструктор принимает корневой элемент формы и необязательный объект с обработчиками. Находит кнопку отправки и блок ошибок внутри контейнера.

Если передан `onSubmit`, он навешивается на событие `submit` формы. Внутри обработчика вызывается `preventDefault`, чтобы страница не перезагружалась.

Если передан `onChange`, он навешивается на событие `input`. При каждом изменении поля формы вызывается колбэк с именем поля и его значением.

```ts
constructor(container: HTMLFormElement, actions?: IFormActions)
```

#### Поля

`container`: `HTMLFormElement` - корневой DOM-элемент формы.
`submitButton`: `HTMLButtonElement` - кнопка отправки формы.
`errorsElement`: `HTMLElement` - блок для отображения ошибок.

#### Сеттеры

`set errors(value: string): void` - устанавливает текст ошибки.
`set valid(value: boolean): void` - включает или выключает кнопку отправки.

#### Методы

`render(data?: Partial<T>): HTMLElement` - унаследован от `Component<T>`.

### Класс OrderForm

#### Назначение

Форма оформления заказа. Наследуется от `Form<TOrderForm>`. Содержит выбор способа оплаты и поле ввода адреса доставки.

#### Конструктор

Конструктор принимает корневой элемент формы и необязательный объект с обработчиками. Находит кнопки выбора оплаты и поле адреса.

Если передан `onPaymentChange`, он навешивается на кнопки выбора оплаты.

```ts
constructor(container: HTMLFormElement, actions?: IOrderFormActions)
```

#### Тип данных

```ts
export type  TOrderForm = {
    payment: TPayment;
    address: string;
    errors: string;
    valid: boolean;
};
```

#### Поля

`cardButton`: `HTMLButtonElement` - кнопка оплаты картой.
`cashButton`: `HTMLButtonElement` - кнопка оплаты наличными.
`addressInput`: `HTMLInputElement` - поле адреса.

#### Сеттеры

`set payment(value: TPayment): void` - устанавливает активную кнопку оплаты. Для выделения используется модификатор `button_alt-active`.
`set address(value: string): void` - устанавливает значение поля адреса.

#### Генерируемые события

`order:change` с payload `{ field: string, value: string }` - генерируется при изменении поля адреса или выборе способа оплаты (через `onPaymentChange` и `onChange`).

`order:submit` - генерируется при отправке формы заказа.

#### Пример использования

```ts
const orderForm = new OrderForm(cloneTemplate(orderFormTemplate), {
    onChange: (field, value) => events.emit('order:change', { field, value }),
    onPaymentChange: (value) => events.emit('order:change', { field: 'payment', value }),
    onSubmit: () => events.emit('order:submit')
});

orderForm.render({ payment: 'card', address: 'Балашиха, ул. Ленина, 99' });
```

### Класс ContactsForm

#### Назначение

Форма ввода контактных данных. Наследуется от `Form<TContactsForm>`. Содержит поля email и телефона.

#### Конструктор

Конструктор принимает корневой элемент формы и необязательный объект с обработчиками. Находит поля ввода внутри контейнера.

```ts
constructor(container: HTMLFormElement, actions?: IFormActions)
```

#### Тип данных

```ts
export type TContactsForm = {
    email: string;
    phone: string;
    errors: string;
    valid: boolean;
};
```

#### Поля

`emailInput`: `HTMLInputElement` - поле ввода email.
`phoneInput`: `HTMLInputElement` - поле ввода телефона.

#### Сеттеры

`set email(value: string): void` - устанавливает значение поля email.
`set phone(value: string): void` - устанавливает значение поля телефона.

#### Генерируемые события

`contacts:change` с payload `{ field: string, value: string }` - генерируется при изменении любого поля формы контактов.

`contacts:submit` - генерируется при отправке формы контактов.

#### Пример использования

```ts
const contactsForm = new ContactsForm(cloneTemplate(contactsFormTemplate), {
    onChange: (field, value) => events.emit('contacts:change', { field, value }),
    onSubmit: () => events.emit('contacts:submit')
});

contactsForm.render({ email: 'user@example.com', phone: '+7 999 123-45-67' });
```

### Схема наследования форм

Базовый класс `Form<T>` является абстрактным. От него наследуются два класса.

Класс `OrderForm` наследуется от `Form<TOrderForm>`.
Класс `ContactsForm` наследуется от `Form<TContactsForm>`.

### Класс Gallery

#### Назначение

Галерея карточек товаров в каталоге. Наследуется от `Component<IGalleryData>`. Отвечает за отображение списка карточек на странице.

#### Конструктор

Конструктор принимает корневой элемент галереи.

```ts
constructor(container: HTMLElement)
```

Галерея не генерирует события. Клики обрабатываются внутри самих карточек через `CardCatalog`.

#### Поля

`container`: `HTMLElement` - корневой DOM-элемент галереи.

#### Сеттеры

`set catalog(items: HTMLElement[]): void` - принимает массив готовых DOM-элементов карточек и заменяет ими содержимое контейнера.

```ts
set catalog(items: HTMLElement[])
```

#### Пример использования

```ts
const gallery = new Gallery(ensureElement('.gallery'));

const itemCards = catalog.getProducts().map((item) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
        onClick: () => events.emit('card:select', item)
    });
    return card.render({
        ...item,
        image: `${CDN_URL}${item.image}`
    });
});

gallery.render({ catalog: itemCards });
```

### Класс Modal

#### Назначение

Модальное окно. Наследуется от `Component<IModalData>`. Отвечает за показ и скрытие контента, обработку закрытия. Не имеет наследников. Любая разметка, отображаемая в модальном окне, - это самостоятельные компоненты.

#### Конструктор

Конструктор принимает корневой элемент модального окна и необязательный объект с обработчиками.

Если передан `onClose`, он навешивается на кнопку закрытия и на клик по фону модального окна.

```ts
constructor(container: HTMLElement, actions?: IModalActions)
```

#### Поля

`container`: `HTMLElement` - корневой DOM-элемент модального окна с классом `.modal`.
`contentElement`: `HTMLElement` - контейнер для контента с селектором `.modal__content`.
`closeButton`: `HTMLButtonElement` - кнопка закрытия с селектором `.modal__close`.

#### Сеттеры

`set content(value: HTMLElement): void` - принимает готовый DOM-элемент и заменяет им содержимое модального окна.

```ts
set content(value: HTMLElement)
```

#### Методы

`render(data?: Partial<IModalData>): HTMLElement` - унаследован от `Component<T>`.

`open(): void` - открывает модальное окно, добавляя модификатор `modal_active` корневому элементу.

```ts
open(): void
```

`close(): void` - закрывает модальное окно, удаляя модификатор `modal_active` и очищая содержимое.

```ts
close(): void
```

#### Генерируемые события

Событие `modal:close` генерируется через обработчик `onClose`, когда пользователь кликнул по кнопке закрытия или по фону модального окна.

#### Пример использования

```ts
const modal = new Modal(ensureElement('.modal'), {
    onClose: () => events.emit('modal:close')
});

const preview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => events.emit('card:toggle', item)
});

preview.render({
    ...item,
    image: `${CDN_URL}${item.image}`
});

modal.render({ content: preview.render() });
modal.open();
```

### Класс Header

#### Назначение

Шапка сайта. Наследуется от `Component<IHeaderData>`. Отвечает за отображение счётчика товаров в корзине и обработку клика по иконке корзины. Всегда виден на странице.

#### Конструктор

Конструктор принимает корневой элемент шапки и необязательный объект с обработчиками. Находит счётчик корзины и кнопку корзины.

Если передан `onClick`, он навешивается на кнопку корзины.

```ts
constructor(container: HTMLElement, actions?: IHeaderActions)
```

#### Поля

`container`: `HTMLElement` - корневой DOM-элемент шапки с классом `.header`.
`counterElement`: `HTMLElement` - элемент счётчика с селектором `.header__basket-counter`.
`basketButton`: `HTMLButtonElement` - кнопка корзины с селектором `.header__basket`.

#### Сеттеры

`set counter(value: number): void` - устанавливает количество товаров в корзине.

```ts
set counter(value: number)
```

#### Генерируемые события

Событие `cart:open` генерируется через обработчик `onClick`, когда пользователь кликнул по иконке корзины.

#### Пример использования

```ts
const header = new Header(ensureElement('.header'), {
    onClick: () => events.emit('cart:open')
});

events.on('cart:changed', () => {
    header.render({ counter: cart.getCount() });
});
```

### Класс Basket

#### Назначение

Корзина. Наследуется от `Component<IBasketData>`. Отвечает за отображение списка товаров, итоговой суммы и кнопки оформления. Отображается в модальном окне.

#### Конструктор

Конструктор принимает корневой элемент корзины и необязательный объект с обработчиками. Находит список товаров, сумму и кнопку оформления.

Если передан `onCheckout`, он навешивается на кнопку оформления.

```ts
constructor(container: HTMLElement, actions?: IBasketActions)
```

#### Поля

`listElement`: `HTMLElement` - список товаров с селектором `.basket__list`.
`totalElement`: `HTMLElement` - элемент суммы с селектором `.basket__price`.
`checkoutButton`: `HTMLButtonElement` - кнопка оформления с селектором `.basket__button`.

#### Сеттеры

`set items(items: HTMLElement[]): void` - принимает массив готовых карточек и заменяет ими содержимое списка.
`set total(value: number): void` - устанавливает текст с итоговой суммой.
`set disabled(value: boolean): void` - включает или выключает кнопку оформления.

#### Генерируемые события

Событие `order:open` генерируется через обработчик `onCheckout`, когда пользователь кликнул по кнопке "Оформить".

#### Пример использования

```ts
const basket = new Basket(cloneTemplate(basketTemplate), {
    onCheckout: () => events.emit('order:open')
});

events.on('cart:changed', () => {
    const itemCards = cart.getItems().map((item, i) => {
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
            onDelete: () => events.emit('cart:remove', item)
        });
        return card.render({
            title: item.title,
            price: item.price,
            index: i + 1
        });
    });

    basket.render({
        items: itemCards,
        total: cart.getTotalPrice(),
        disabled: cart.getCount() === 0
    });
});
```

### Класс Success

#### Назначение

Экран успешного оформления заказа. Наследуется от `Component<ISuccessData>`. Отвечает за отображение суммы списанных синапсов и обработку закрытия.

#### Конструктор

Конструктор принимает корневой элемент экрана успеха и необязательный объект с обработчиками.

Если передан `onClose`, он навешивается на кнопку закрытия.

```ts
constructor(container: HTMLElement, actions?: ISuccessActions)
```

#### Поля

`totalElement`: `HTMLElement` - элемент с текстом о сумме с селектором `.order-success__description`.
`closeButton`: `HTMLButtonElement` - кнопка закрытия с селектором `.order-success__close`.

#### Сеттеры

`set total(value: number): void` - устанавливает текст в формате "Списано N синапсов".

```ts
set total(value: number)
```

#### Генерируемые события

Событие `modal:close` генерируется через обработчик `onClose`, когда пользователь кликнул по кнопке закрытия экрана успеха.

#### Пример использования

```ts
events.on('contacts:submit', () => {
    webLarekApi.postOrder(orderData).then((result) => {
        const success = new Success(cloneTemplate(successTemplate), {
            onClose: () => events.emit('modal:close')
        });

        modal.render({ content: success.render({ total: result.total }) });
        modal.open();
    });
});
```

## Слой коммуникации

### Класс WebLarekApi

#### Назначение

Класс `WebLarekApi` отвечает за взаимодействие приложения с сервером "Веб-ларёк". Он получает товары с сервера и отправляет данные о заказе.

Класс использует композицию: в конструктор принимает объект, соответствующий интерфейсу `IApi`, и вызывает его методы `get` и `post`.

#### Конструктор

`api`: `IApi` - объект, выполняющий GET и POST запросы.

#### Поля

`api`: `IApi` - объект для выполнения HTTP-запросов.

#### Методы

`getProducts(): Promise<IProductListResponse>` - делает GET-запрос на эндпоинт `/product/`. Возвращает объект с массивом товаров и их общим количеством.

`postOrder(data: IOrderRequest): Promise<IOrderResponse>` - делает POST-запрос на эндпоинт `/order/`. Принимает данные покупателя и выбранных товаров, возвращает объект, подтверждающий покупку.

#### Связанные типы

```ts
interface IProductListResponse {
  total: number;
  items: IProduct[];
}

interface IOrderRequest extends IBuyer {
  items: string[];
  total: number;
}

interface IOrderResponse {
  id: string;
  total: number;
}
```

#### Пример использования

```ts
const api = new Api({ baseUrl: API_URL });
const webLarekApi = new WebLarekApi(api);
const catalog = new Catalog(events);

webLarekApi.getProducts().then((data) => {
  catalog.setProducts(data.items);
});
```

## Презентер

### Назначение

Презентер - это слой приложения, который связывает модели данных и компоненты представления. Он слушает события, которые генерируют модели и представления, и решает, что делать: обновить данные в модели, вызвать метод представления или открыть модальное окно.

Презентер реализован в основном скрипте приложения `src/main.ts`. Вынос презентера в отдельный класс не требуется, потому что у приложения только одна страница, и вся логика сосредоточена в одном месте.

### Правила работы презентера

Презентер не генерирует события. Он только слушает их и реагирует. В коде `main.ts` есть вызовы `events.emit(...)`, но они принадлежат колбэкам, переданным в компоненты представления, а не самому презентеру. То есть события генерирует компонент по действию пользователя.

Презентер не работает с DOM напрямую. Все взаимодействие с разметкой идет через методы классов представления.

Презентер не хранит данные. Все данные живут в моделях. Презентер только запрашивает их через методы моделей.

Презентер не вызывает перерисовку представления просто так. Перерисовка происходит только в двух случаях: при обработке события от модели данных об изменении или при открытии модального окна.

### Сборка пути к картинкам

Картинки товаров хранятся на CDN-сервере. В данных товара поле `image` содержит только имя файла (например, `/5_Dots.svg`). Полный путь собирается в презентере:

```ts
image: `${CDN_URL}${item.image}`
```

Это делается при рендере карточек каталога и превью. В корзине картинки не отображаются, поэтому для `CardBasket` путь не собирается.

### Логика валидации форм

Валидация выполняется моделью `Buyer` через метод `validate()`. Метод возвращает объект со всеми ошибками сразу. Презентер разделяет эти ошибки по формам:

Для формы заказа берутся только ошибки полей `payment` и `address`.

Для формы контактов берутся только ошибки полей `email` и `phone`.

Это позволяет каждой форме показывать только свои ошибки и активировать кнопку отправки независимо от другой формы. Например, кнопка "Далее" в форме заказа становится активной, когда выбрана оплата и введён адрес, даже если email и телефон ещё не заполнены.

### Логика показа превью товара

Когда пользователь кликает по карточке каталога, презентер создаёт новый экземпляр `CardPreview`, рендерит в него данные товара и настраивает кнопку действия в зависимости от состояния корзины:

Если у товара нет цены - кнопка показывает "Недоступно" и заблокирована.

Если товар уже в корзине - кнопка показывает "Удалить из корзины".

Если товара нет в корзине - кнопка показывает "Купить".

После нажатия кнопки (`card:toggle`) модальное окно закрывается. Это соответствует требованию функциональности.

### Логика отправки заказа

При отправке формы контактов (`contacts:submit`) презентер собирает данные заказа из модели покупателя, добавляет к ним сумму и список id товаров из корзины и отправляет на сервер через `webLarekApi.postOrder`.

При успешном ответе презентер:

Показывает модальное окно с экраном успеха и суммой заказа.

Очищает корзину и данные покупателя.

Порядок важен: сначала показывается успех, потом очищаются данные. Иначе событие `cart:changed` от очистки корзины могло бы перебить показ экрана успеха.

## Сводная таблица событий приложения

### События от моделей данных

`catalog:changed` - генерируется в `Catalog.setProducts`. Payload отсутствует.
`catalog:selected` - генерируется в `Catalog.setSelectedProduct`. Payload отсутствует.
`cart:changed` - генерируется в `Cart.addItem`, `Cart.removeItem`, `Cart.clear`. Payload отсутствует.
`buyer:changed` - генерируется в `Buyer.setData`, `Buyer.clear`. Payload отсутствует.

### События от представлений

`card:select` с payload `IProduct` - генерируется в `CardCatalog` при клике по карточке.
`card:toggle` с payload `IProduct` - генерируется в `CardPreview` при клике по кнопке действия.
`cart:remove` с payload `IProduct` - генерируется в `CardBasket` при клике по кнопке удаления.
`cart:open` без payload - генерируется в `Header` при клике по иконке корзины.
`order:open` без payload - генерируется в `Basket` при клике по кнопке "Оформить".
`order:change` с payload `{ field: string, value: string }` - генерируется в `OrderForm` при изменении поля.
`order:submit` без payload - генерируется в `OrderForm` при отправке формы.
`contacts:change` с payload `{ field: string, value: string }` - генерируется в `ContactsForm` при изменении поля.
`contacts:submit` без payload - генерируется в `ContactsForm` при отправке формы.
`modal:close` без payload - генерируется в `Modal` и `Success` при закрытии модального окна.

Все события обрабатываются презентером в `main.ts`.