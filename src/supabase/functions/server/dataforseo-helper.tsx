// Shared DataForSEO API Helper
// Used by: youtube-seo-helper, trend-hunter-helper, ppc-spy-helper, multi-engine-helper, content-generator-helper

const DATAFORSEO_API_BASE = 'https://api.dataforseo.com';

// Shared function to make DataForSEO API calls
export async function callDataForSEO(endpoint: string, payload: any) {
  const email = Deno.env.get('DATAFORSEO_EMAIL');
  const password = Deno.env.get('DATAFORSEO_PASSWORD');
  
  if (!email || !password) {
    throw new Error('DataForSEO credentials not configured');
  }

  const auth = btoa(`${email}:${password}`);
  
  // For task_get endpoints, use GET method without body
  const isTaskGet = endpoint.includes('/task_get/');
  
  const fetchOptions: any = {
    method: isTaskGet ? 'GET' : 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
  };
  
  // Only add body for POST requests
  if (!isTaskGet) {
    fetchOptions.body = JSON.stringify(payload);
  }
  
  const response = await fetch(`${DATAFORSEO_API_BASE}${endpoint}`, fetchOptions);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DataForSEO API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  
  if (data.status_code !== 20000) {
    // Log full error details for debugging
    console.error(`[DATAFORSEO API] Error Response:`, JSON.stringify(data, null, 2));
    throw new Error(`DataForSEO API returned error: ${data.status_message || 'Unknown error'}`);
  }

  return data;
}
