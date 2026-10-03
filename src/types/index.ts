export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export interface IProduct {
  id: string;
  title: string;
  image: string;
  category: string;
  price: number | null;
  description?: string;
}
export type TPayment = "card" | "cash" | "";

export interface IBuyer {
  payment: TPayment;
  address: string;
  email: string;
  phone: string;
}
export interface IOrderRequest {
  payment: TPayment;
  address: string;
  email: string;
  phone: string;
  total: number;
  items: string[];
}

export interface IOrderResponse {
  id: string;
  total: number;
}

export interface IProductListResponse {
  items: IProduct[];
}

export interface ICardActions {
  onClick?: (event: MouseEvent) => void;
  onDelete?: (event: MouseEvent) => void;
}

export interface IFormActions {
  onSubmit?: () => void;
  onChange?: (field: string, value: string) => void;
}
