const fetch = require('node-fetch');

const testUserEndpoint = async (auth0Id) => {
  if (!auth0Id) {
    console.error('Please provide an auth0Id as an argument');
    process.exit(1);
  }

  const BASE_URL = 'http://localhost:3001/api'; // Adjust port if needed
  
  try {
    console.log(`Testing user endpoint with auth0Id: ${auth0Id}`);
    
    // Test user fetch by auth0Id
    const response = await fetch(`${BASE_URL}/users/test/${auth0Id}`);
    const data = await response.json();
    
    console.log('\nResponse:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Test completed successfully');
    } else {
      console.log('\n❌ Test failed');
    }
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
  } catch (error) {
    console.error('Error during test:', error);
  }
};

// Get auth0Id from command line argument
const auth0Id = process.argv[2];
testUserEndpoint(auth0Id);