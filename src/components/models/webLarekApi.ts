import type {
  IApi,
  IProductListResponse,
  IOrderRequest,
  IOrderResponse,
} from "../../types";

export class WebLarekApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IProductListResponse> {
    return this.api.get<IProductListResponse>("/product/");
  }

  postOrder(data: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>("/order/", data);
  }
}
