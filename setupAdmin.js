async function createAdmin() {
    try {
        const response = await fetch('http://localhost:5000/api/auth/create-admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username: 'kiran', 
                password: 'Kiran@1980' // Yahan tum papa ka password set kar sakte ho
            }) 
        });
        const data = await response.json();
        console.log("👉 Server ka Jawab:", data);
    } catch (error) {
        console.log("❌ Error:", error);
    }
}

createAdmin();