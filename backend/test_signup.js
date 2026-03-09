async function testAPI() {
  const email = `testuser_1773079279103@example.com`;
  
  try {
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: 'password123'
      })
    });
    
    const data = await res.json();
    console.log("Login Response:", data);
  } catch(e) {
    console.error("Fetch Error:", e);
  }
}

testAPI();
