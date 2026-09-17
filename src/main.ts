import "./scss/styles.scss";
import { Cart } from "./components/models/cart.ts";
import { Buyer } from "./components/models/buyer.ts";
import { Catalog } from "./components/models/catalog.ts";
import { apiProducts } from "./utils/data.ts";
import { Api } from "./components/base/Api";
import { WebLarekApi } from "./components/models/webLarekApi.ts";
import { API_URL } from "./utils/constants";

//каталог. выводит все продукты из data.ts
const catalog = new Catalog();
catalog.setProducts(apiProducts.items);
console.log("catalog.getproducts():", catalog.getProducts());

//один продукт. используется для добавления в корзину
const firstProduct = catalog.getProductById(apiProducts.items[0].id);
//корзина. выводит содержимое (один продукт)
const userCart = new Cart();
if (firstProduct) {
  userCart.addItem(firstProduct);
}
console.log("uaerCart.getItems():", userCart.getItems());

//инфо покупателя. выведет только почту
const myBuyer = new Buyer();
myBuyer.setData({ email: "user@example.com" });
console.log("myBuyer.getData():", myBuyer.getData());

//объект Api
const api = new Api(API_URL);

//класс коммуникации, передаем ему api
const webLarekApi = new WebLarekApi(api);

//запрашиваем товары и сохраняем их в каталог
webLarekApi
  .getProducts()
  .then((data) => {
    catalog.setProducts(data.items);
    console.log("Каталог с сервера:", catalog.getProducts());
  })
  .catch((error) => {
    console.error("Ошибка загрузки товаров:", error);
  });
