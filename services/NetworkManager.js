import ApiWrapper from '../constants/ApiWrapper';

class NetworkManager {
  static debugRequest = true;

  static getUrl(endpoint, customBaseUrl = null) {
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }
    const base = customBaseUrl || ApiWrapper.BASE_URL;
    return `${base}${endpoint}`;
  }

  static async post(endpoint, data = {}, headers = {}, customBaseUrl = null) {
    const url = this.getUrl(endpoint, customBaseUrl);
    
    const requestHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (NetworkManager.debugRequest) {
      console.log('--- [Network Request] ---');
      console.log(`URL: ${url}`);
      console.log('Method: POST');
      console.log('Headers:', JSON.stringify(requestHeaders, null, 2));
      console.log('Payload:', JSON.stringify(data, null, 2));
      console.log('-------------------------');
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (NetworkManager.debugRequest) {
          console.log('--- [Network Response (Error)] ---');
          console.log(`Status: ${response.status}`);
          console.log('----------------------------------');
        }
        return { success: false, error: 'network_error', statusCode: response.status };
      }

      const json = await response.json();

      if (NetworkManager.debugRequest) {
        console.log('--- [Network Response (Success)] ---');
        console.log('Received Data:', JSON.stringify(json, null, 2));
        console.log('------------------------------------');
      }

      return { success: true, data: json };
    } catch (error) {
      if (NetworkManager.debugRequest) {
        console.log('--- [Network Response (Exception)] ---');
        console.log('Message:', error.message);
        console.log('--------------------------------------');
      }
      console.error('Network POST Error:', error);
      return { success: false, error: 'exception', message: error.message };
    }
  }

  static async get(endpoint, params = {}, headers = {}, customBaseUrl = null) {
    let url = this.getUrl(endpoint, customBaseUrl);
    
    const queryKeys = Object.keys(params);
    if (queryKeys.length > 0) {
      const queryString = queryKeys
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
      url = url.includes('?') ? `${url}&${queryString}` : `${url}?${queryString}`;
    }

    if (NetworkManager.debugRequest) {
      console.log('--- [Network Request] ---');
      console.log(`URL: ${url}`);
      console.log('Method: GET');
      console.log('Headers:', JSON.stringify(headers, null, 2));
      console.log('-------------------------');
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        if (NetworkManager.debugRequest) {
          console.log('--- [Network Response (Error)] ---');
          console.log(`Status: ${response.status}`);
          console.log('----------------------------------');
        }
        return { success: false, error: 'network_error', statusCode: response.status };
      }

      const json = await response.json();

      if (NetworkManager.debugRequest) {
        console.log('--- [Network Response (Success)] ---');
        console.log('Received Data:', JSON.stringify(json, null, 2));
        console.log('------------------------------------');
      }

      return { success: true, data: json };
    } catch (error) {
      if (NetworkManager.debugRequest) {
        console.log('--- [Network Response (Exception)] ---');
        console.log('Message:', error.message);
        console.log('--------------------------------------');
      }
      console.error('Network GET Error:', error);
      return { success: false, error: 'exception', message: error.message };
    }
  }
}

export default NetworkManager;
