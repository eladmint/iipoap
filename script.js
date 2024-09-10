let iiWindow;

document.getElementById('iiButton').addEventListener('click', function() {
    iiWindow = window.open('https://identity.ic0.app/#authorize', 'II Window', 'width=500,height=600');
});

window.addEventListener('message', function(event) {
    if (event.origin !== "https://identity.ic0.app") return;

    console.log('Received message:', event.data);

    if (event.data.kind === "authorize-ready") {
        iiWindow.postMessage({
            kind: "authorize-client",
            sessionPublicKey: new Uint8Array(32),
            maxTimeToLive: BigInt(600000000000)
        }, "https://identity.ic0.app");
    } else if (event.data.kind === "authorize-client-success") {
        const userPublicKey = event.data.userPublicKey;
        localStorage.setItem('iiNumber', userPublicKey);
        document.getElementById('status').textContent = 'Internet Identity created successfully! You will receive your LCT digital asset after the event.';
        iiWindow.close();
        
        // Send data to Google Sheets using GET request
        const url = `https://script.google.com/macros/s/AKfycbyv_rVxmOWib3yWW18Q-lr_iM723xymuatYYxh-bjo9RHEzHO2y3rf9W1V8U_pqVJPO/exec?iiNumber=${encodeURIComponent(userPublicKey)}`;
        
        fetch(url, { mode: 'no-cors' })
        .then(response => console.log('Success:', response))
        .catch(error => console.error('Error:', error));
    }
});
