const axios = require('axios');

const testUserEndpoint = async (auth0Id) => {
  if (!auth0Id) {
    console.error('Please provide an auth0Id as an argument');
    process.exit(1);
  }

  const BASE_URL = 'http://localhost:5000/api'; // Updated to port 5000
  
  try {
    console.log(`Testing user endpoint with auth0Id: ${auth0Id}`);
    
    // Test user fetch by auth0Id
    const response = await axios.get(`${BASE_URL}/users/${auth0Id}`);
    
    console.log('\nResponse:', JSON.stringify(response.data, null, 2));
    
    if (response.status === 200) {
      console.log('\n✅ Test completed successfully');
    } else {
      console.log('\n❌ Test failed');
    }
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
  } catch (error) {
    console.error('Error during test:', error.response?.data || error.message);
  }
};

// Get auth0Id from command line argument
const auth0Id = process.argv[2];
testUserEndpoint(auth0Id);

