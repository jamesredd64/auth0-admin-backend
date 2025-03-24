const getAuthHeaders = useCallback(async () => {
  const token = await getAccessTokenSilently({
    authorizationParams: {
      audience: 'https://dev-uizu7j8qzflxzjpy.us.auth0.com/api/v2/',
      scope: 'openid profile email'
    }
  });
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  };
}, [getAccessTokenSilently]);

const getUserById = useCallback(async (auth0Id: string) => {
  console.group('getUserById Operation');
  try {
    const headers = await getAuthHeaders();
    const encodedAuth0Id = encodeURIComponent(auth0Id);
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_BY_ID(encodedAuth0Id)}`;
    
    console.log('Fetching from URL:', url);
    console.log('Headers:', headers);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    console.log('Response status:', response.status);

    // Handle 204 No Content
    if (response.status === 204) {
      console.log('No user found');
      return null;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('User data received:', result);
    return result;
  } catch (error) {
    console.error('Error in getUserById:', error);
    throw error;
  } finally {
    console.groupEnd();
  }
}, [getAuthHeaders]);

