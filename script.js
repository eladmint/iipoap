window.addEventListener('message', function(event) {
    if (event.origin !== "https://identity.ic0.app") return;

    if (event.data.kind === "authorize-client-success") {
        const iiNumber = event.data.userPublicKey; // This might need adjustment based on the actual message format
        localStorage.setItem('iiNumber', iiNumber);
        document.getElementById('status').textContent = 'Internet Identity created successfully! You will receive your LCT digital asset after the event.';
        
        // Here you could also send the II number to your backend if you prefer server-side storage
        fetch('/store-ii-number', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ iiNumber: iiNumber }),
        });
    }
});
