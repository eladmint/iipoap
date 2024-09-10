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
        
        // Send data to Google Sheets using POST request
        const url = 'https://script.google.com/macros/s/AKfycbyEDhkrCoLoH1GTBo8M_eyeot0RE4HJsmzUj5xsDYhs4jcU8yJA9t4GaSQkylpZzxTp/exec';
        
        fetch(url, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ iiNumber: userPublicKey }),
        })
        .then(response => console.log('Success:', response))
        .catch(error => console.error('Error:', error));
    }
});
