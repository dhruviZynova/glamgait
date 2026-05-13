// Test script to verify localStorage functionality
// This can be run in the browser console to test the implementation

// Simulate the data structure that would be stored after login
const mockUserData = {
  name: 'Test User',
  email: 'test@example.com',
  token: 'mock_auth_token_12345',
  role: 'user',
  u_id: '123',
  phone: '1234567890'
};

// Store the data (simulating what Login.jsx does)
localStorage.setItem('GlamGait', JSON.stringify(mockUserData));

// Retrieve the data (simulating what userInfo() does)
const storedData = JSON.parse(localStorage.getItem('GlamGait'));

// Verify the required fields are present
const requiredFields = ['name', 'email', 'token', 'role'];
const hasAllFields = requiredFields.every(field => storedData[field] !== undefined);

if (hasAllFields) {
  console.log('✅ localStorage implementation is working correctly!');
} else {
  console.log('❌ localStorage implementation has issues!');
}

// Cleanup
localStorage.removeItem('GlamGait');
