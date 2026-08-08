async function testEsewaLogin(id, pass) {
  try {
    const res = await fetch('https://rc-epay.esewa.com.np/api/epay/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: id,
        password: pass
      })
    });

    const status = res.status;
    const text = await res.text();
    console.log(`Testing ID: "${id}" | Pass: "${pass}" -> Status: ${status} | Response: ${text.slice(0, 150)}`);
  } catch (e) {
    console.error(`Error testing ${id}:`, e.message);
  }
}

async function run() {
  const credentials = [
    { id: '9711111111', pass: 'Nepal@123' },
    { id: '9711111111', pass: '1122' },
    { id: '9806800001', pass: 'Nepal@123' },
    { id: '9806800001', pass: '1122' },
    { id: '9800000000', pass: 'Nepal@123' },
    { id: '9800000000', pass: '1122' },
    { id: '9711111112', pass: 'Nepal@123' },
    { id: '9711111112', pass: '1122' },
    { id: '9841000000', pass: 'Nepal@123' },
    { id: '9841000000', pass: '1122' }
  ];

  for (const c of credentials) {
    await testEsewaLogin(c.id, c.pass);
  }
}

run();
