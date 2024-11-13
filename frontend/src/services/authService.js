export const getAzureADToken = async () => {
    const response = await fetch('/api/ai/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    if (!response.ok) {
      throw new Error('Failed to obtain Azure AD token');
    }
  
    const data = await response.json();
    return data.access_token;
  };
  