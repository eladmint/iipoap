let iiWindow;

document.getElementById('iiButton').addEventListener('click', function() {
    iiWindow = window.open('https://identity.ic0.app/#authorize', 'II Window', 'width=500,height=600');
});

window.addEventListener('message', function(event) {
    if (event.origin !== "https://identity.ic0.app") return;

    console.log('Received message:', event.data);

    if (event.data.kind === "authorize-ready") {
        // II is ready, send the authorization request
        iiWindow.postMessage({
            kind: "authorize-client",
            sessionPublicKey: new Uint8Array(32), // Replace with actual public key if needed
            maxTimeToLive: BigInt(600000000000) // 10 minutes in nanoseconds
        }, "https://identity.ic0.app");
    } else if (event.data.kind === "authorize-client-success") {
        const userPublicKey = event.data.userPublicKey;
        localStorage.setItem('iiNumber', userPublicKey);
        document.getElementById('status').textContent = 'Internet Identity created successfully! You will receive your LCT digital asset after the event.';
        iiWindow.close();
        
        // Here you could also send the II number to your backend if you prefer server-side storage
        // This is just a placeholder and won't work without a proper backend setup
        /*
        fetch('https://script.google.com/macros/s/AKfycbw9Bh3EpiZl9Fxnn92YCRDhRd4ZPZW1rmJ5-TNATAz5qOqYWI8SuX64e0o-wfiazvps/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ iiNumber: userPublicKey }),
        });
        */
    }
});
