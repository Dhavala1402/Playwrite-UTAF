// Type definitions for the SmartStore (ecommerce) application domain

export interface SmartStoreCredentials {
  username: string;
  password: string;
}

export interface SmartStoreTestData {
  credentials: SmartStoreCredentials;
  category: string;
  product: string;
}
