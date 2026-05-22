import ApiWrapper from '../constants/ApiWrapper';

class NetworkManager {
  static debugRequest = true;

  static async post(endpoint, data = {}, headers = {}) {
    const url = `${ApiWrapper.BASE_URL}${endpoint}`;
    
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
}

export default NetworkManager;
