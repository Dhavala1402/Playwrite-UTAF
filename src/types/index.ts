// Global type definitions for IGS Playwright Framework

export interface TestConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  headless: boolean;
  viewport: {
    width: number;
    height: number;
  };
}

export interface UserCredentials {
  username: string;
  password: string;
  email?: string;
}

export interface ApiResponse<T = any> {
  status: number;
  statusText: string;
  data: T;
  headers: Record<string, string>;
}

export interface TestData {
  users: UserCredentials[];
  products: Product[];
  orders: Order[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  description?: string;
}

export interface Order {
  id: string;
  userId: string;
  products: Product[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
}

export interface PageElement {
  selector: string;
  text?: string;
  role?: string;
  testId?: string;
}

export interface TestStep {
  action: string;
  element?: PageElement;
  data?: any;
  expected?: any;
}

export interface BrowserContext {
  name: string;
  viewport: { width: number; height: number };
  userAgent: string;
  deviceScaleFactor: number;
  isMobile: boolean;
  hasTouch: boolean;
}

export interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
}

export interface VisualTestOptions {
  threshold: number;
  maxDiffPixels?: number;
  animations?: 'disabled' | 'allow';
  clip?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface TestManifestCase {
  testCaseId: string;
  title: string;
  description: string;
  tags: string[];
  enabled: boolean;
}

export interface TestManifest {
  testSuiteId: string;
  testSuiteName: string;
  domain: string;
  description: string;
  baseURL: string;
  owner: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  dataFile: string;
  testCases: TestManifestCase[];
}

export interface MobileTestOptions {
  device: string;
  orientation: 'portrait' | 'landscape';
  touchEnabled: boolean;
  geolocation?: {
    latitude: number;
    longitude: number;
  };
}

// Extend Playwright types
declare global {
  namespace PlaywrightTest {
    interface TestInfo {
      customTestId?: string;
      priority?: 'low' | 'medium' | 'high' | 'critical';
      customTags?: string[];
    }
  }
}
