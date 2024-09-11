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
        
        // Send data to Google Sheets using JSONP
        const script = document.createElement('script');
        script.src = `https://script.google.com/macros/s/AKfycbxn6-9LVMwbC-4-xvGL6jtGjM8eb-lf79Md6UrCvLvlJb0OPZoQ8oOSmaF9otrOBdtF/exec`;
        document.body.appendChild(script);
    }
});

// Callback function for JSONP
window.handleResponse = function(response) {
    console.log('Response from Google Apps Script:', response);
    // You can handle the response here if needed
};
