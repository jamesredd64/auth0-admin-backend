const axios = require('axios');

const AUTH0_ID = 'auth0|67bb70c5eedb5c4b0ea1ec93';
const API_URL = 'http://localhost:5000/api'; // Adjust port if needed

async function testFetchUser() {
  try {
    console.log(`Fetching user with Auth0 ID: ${AUTH0_ID}`);
    
    // Test GET request
    const response = await axios.get(`${API_URL}/users/${AUTH0_ID}`);
    console.log('Response status:', response.status);
    
    console.log('\nResponse data:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testFetchUser();
