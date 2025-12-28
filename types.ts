export interface MenuItem {
  id: string;
  name_jp: string;
  name_zh: string;
  price: string;
  description: string;
  category?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export enum AppState {
  UPLOAD = 'UPLOAD',
  PROCESSING = 'PROCESSING',
  MENU = 'MENU',
  SUMMARY = 'SUMMARY',
  ERROR = 'ERROR'
}

export type Cart = Record<string, number>; // Item ID -> Quantity

export interface GeminiResponse {
  items: MenuItem[];
}