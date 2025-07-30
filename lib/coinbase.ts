import { config } from './config';
import crypto from 'crypto';

interface CoinbaseAccount {
  id: string;
  name: string;
  primary: boolean;
  type: string;
  currency: string;
  balance: {
    amount: string;
    currency: string;
  };
  created_at: string;
  updated_at: string;
  resource: string;
  resource_path: string;
}

interface CoinbaseProduct {
  id: string;
  base_currency: string;
  quote_currency: string;
  base_min_size: string;
  base_max_size: string;
  quote_increment: string;
  base_increment: string;
  display_name: string;
  status: string;
  margin_enabled: boolean;
  status_message: string;
  min_market_funds: string;
  post_only: boolean;
  limit_only: boolean;
  cancel_only: boolean;
}

interface CoinbaseTicker {
  trade_id: number;
  price: string;
  size: string;
  time: string;
  bid: string;
  ask: string;
  volume: string;
}

class CoinbaseService {
  private apiKey: string;
  private apiSecret: string;
  private passphrase: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = config.coinbase.apiKey;
    this.apiSecret = config.coinbase.apiSecret;
    this.passphrase = config.coinbase.passphrase;
    this.baseUrl = config.coinbase.baseUrl;
  }

  private generateSignature(timestamp: string, method: string, requestPath: string, body: string = ''): string {
    const message = timestamp + method + requestPath + body;
    const signature = crypto
      .createHmac('sha256', this.apiSecret)
      .update(message)
      .digest('base64');
    return signature;
  }

  private async makeRequest(endpoint: string, method: string = 'GET', body?: any): Promise<any> {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const requestPath = endpoint;
    const bodyString = body ? JSON.stringify(body) : '';
    
    const signature = this.generateSignature(timestamp, method, requestPath, bodyString);

    const headers = {
      'CB-ACCESS-KEY': this.apiKey,
      'CB-ACCESS-SIGN': signature,
      'CB-ACCESS-TIMESTAMP': timestamp,
      'CB-ACCESS-PASSPHRASE': this.passphrase,
      'Content-Type': 'application/json',
    };

    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method,
        headers,
        body: bodyString || undefined,
      });

      if (!response.ok) {
        throw new Error(`Coinbase API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Coinbase API request failed:', error);
      throw error;
    }
  }

  // Get user accounts
  async getAccounts(): Promise<CoinbaseAccount[]> {
    return this.makeRequest('/accounts');
  }

  // Get account by ID
  async getAccount(accountId: string): Promise<CoinbaseAccount> {
    return this.makeRequest(`/accounts/${accountId}`);
  }

  // Get account history
  async getAccountHistory(accountId: string, limit: number = 100): Promise<any[]> {
    return this.makeRequest(`/accounts/${accountId}/ledger?limit=${limit}`);
  }

  // Get account holds
  async getAccountHolds(accountId: string): Promise<any[]> {
    return this.makeRequest(`/accounts/${accountId}/holds`);
  }

  // Get products
  async getProducts(): Promise<CoinbaseProduct[]> {
    return this.makeRequest('/products');
  }

  // Get product by ID
  async getProduct(productId: string): Promise<CoinbaseProduct> {
    return this.makeRequest(`/products/${productId}`);
  }

  // Get product ticker
  async getProductTicker(productId: string): Promise<CoinbaseTicker> {
    return this.makeRequest(`/products/${productId}/ticker`);
  }

  // Get product trades
  async getProductTrades(productId: string, limit: number = 100): Promise<any[]> {
    return this.makeRequest(`/products/${productId}/trades?limit=${limit}`);
  }

  // Get product order book
  async getProductOrderBook(productId: string, level: number = 1): Promise<any> {
    return this.makeRequest(`/products/${productId}/book?level=${level}`);
  }

  // Get current user
  async getCurrentUser(): Promise<any> {
    return this.makeRequest('/user');
  }

  // Get user authorization info
  async getUserAuth(): Promise<any> {
    return this.makeRequest('/user/auth');
  }

  // Place a new order
  async placeOrder(order: {
    product_id: string;
    side: 'buy' | 'sell';
    size?: string;
    funds?: string;
    price?: string;
    type: 'market' | 'limit';
    time_in_force?: 'GTC' | 'GTT' | 'IOC' | 'FOK';
    cancel_after?: string;
    post_only?: boolean;
    client_oid?: string;
  }): Promise<any> {
    return this.makeRequest('/orders', 'POST', order);
  }

  // Cancel an order
  async cancelOrder(orderId: string): Promise<any> {
    return this.makeRequest(`/orders/${orderId}`, 'DELETE');
  }

  // Get order by ID
  async getOrder(orderId: string): Promise<any> {
    return this.makeRequest(`/orders/${orderId}`);
  }

  // Get orders
  async getOrders(status?: string, productId?: string): Promise<any[]> {
    let endpoint = '/orders';
    const params = new URLSearchParams();
    
    if (status) params.append('status', status);
    if (productId) params.append('product_id', productId);
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
    
    return this.makeRequest(endpoint);
  }

  // Get fills
  async getFills(orderId?: string, productId?: string): Promise<any[]> {
    let endpoint = '/fills';
    const params = new URLSearchParams();
    
    if (orderId) params.append('order_id', orderId);
    if (productId) params.append('product_id', productId);
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
    
    return this.makeRequest(endpoint);
  }

  // Get payment methods
  async getPaymentMethods(): Promise<any[]> {
    return this.makeRequest('/payment-methods');
  }

  // Get coinbase accounts
  async getCoinbaseAccounts(): Promise<any[]> {
    return this.makeRequest('/coinbase-accounts');
  }

  // Get exchange rates
  async getExchangeRates(): Promise<any> {
    return this.makeRequest('/products/stats');
  }

  // Get time
  async getTime(): Promise<any> {
    return this.makeRequest('/time');
  }

  // Get currencies
  async getCurrencies(): Promise<any[]> {
    return this.makeRequest('/currencies');
  }
}

export const coinbaseService = new CoinbaseService();
export default coinbaseService; 