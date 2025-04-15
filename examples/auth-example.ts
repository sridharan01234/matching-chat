import { authenticateUser } from '../lib/auth';

async function demonstrateAuth() {
  console.log('🔐 Testing Authentication');
  
  // Successful login attempt
  const aliceLogin = await authenticateUser('alice@example.com', 'alicepassword');
  console.log('\n1. Trying to login as Alice with correct credentials:');
  if (aliceLogin.success) {
    console.log('✅ Authentication successful!');
    console.log('User details:', aliceLogin.user);
  } else {
    console.log('❌ Authentication failed');
    console.log('Error:', aliceLogin.error);
  }

  // Failed login attempt - wrong password
  const bobLoginWrongPass = await authenticateUser('bob@example.com', 'wrongpass');
  console.log('\n2. Trying to login as Bob with wrong password:');
  if (bobLoginWrongPass.success) {
    console.log('✅ Authentication successful!');
    console.log('User details:', bobLoginWrongPass.user);
  } else {
    console.log('❌ Authentication failed');
    console.log('Error:', bobLoginWrongPass.error);
  }

  // Failed login attempt - non-existent user
  const nonExistentUser = await authenticateUser('nobody@example.com', 'password');
  console.log('\n3. Trying to login with non-existent email:');
  if (nonExistentUser.success) {
    console.log('✅ Authentication successful!');
    console.log('User details:', nonExistentUser.user);
  } else {
    console.log('❌ Authentication failed');
    console.log('Error:', nonExistentUser.error);
  }

  // Invalid email format
  const invalidEmail = await authenticateUser('notanemail', 'password');
  console.log('\n4. Trying to login with invalid email format:');
  if (invalidEmail.success) {
    console.log('✅ Authentication successful!');
    console.log('User details:', invalidEmail.user);
  } else {
    console.log('❌ Authentication failed');
    console.log('Error:', invalidEmail.error);
  }

  // Missing credentials
  const missingCreds = await authenticateUser('', '');
  console.log('\n5. Trying to login with missing credentials:');
  if (missingCreds.success) {
    console.log('✅ Authentication successful!');
    console.log('User details:', missingCreds.user);
  } else {
    console.log('❌ Authentication failed');
    console.log('Error:', missingCreds.error);
  }
}

demonstrateAuth()
  .catch(console.error)
  .finally(() => process.exit());
