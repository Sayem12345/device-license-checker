
const GITHUB_JSON_URL = "https://raw.githubusercontent.com/Sayem12345/license-system/refs/heads/main/userdata.json";

async function checkLicense(){
    const inputEl = document.getElementById("deviceId");
    const btnEl = document.getElementById("checkBtn");
    const resultDiv = document.getElementById("result");
    const cardEl = document.querySelector('.card');
    
    const deviceId = inputEl.value.trim();

    // Reset classes
    resultDiv.className = "result";
    cardEl.classList.remove("shake");

    // Basic Validation
    if(deviceId.length < 5){
        resultDiv.innerHTML = "⚠️ Enter a valid Device ID";
        resultDiv.classList.add("error");
        cardEl.classList.add("shake"); // Shake animation on error
        return;
    }

    // Loading State
    btnEl.disabled = true;
    btnEl.innerHTML = '<div class="spinner"></div> Checking...';
    resultDiv.innerHTML = "";
    resultDiv.style.color = "var(--text-muted)";

    try{
        const response = await fetch(GITHUB_JSON_URL);
        
        if (!response.ok) throw new Error("Network response was not ok");
        
        const data = await response.json();
        const found = data.find(item => item.device_id === deviceId);

        // Reset Button
        btnEl.disabled = false;
        btnEl.innerHTML = 'Verify License';

        if(!found){
            resultDiv.innerHTML = "❌ Device Not Found";
            resultDiv.classList.add("error");
            cardEl.classList.add("shake");
            return;
        }

        const today = new Date();
        today.setHours(0,0,0,0); // Reset time for accurate date comparison

        // Handle date format dd-mm-yyyy
        const parts = found.expirydate.split("-");
        const expiryDate = new Date(parts[2], parts[1]-1, parts[0]);

        if(expiryDate < today){
            resultDiv.innerHTML = "⚠️ License Expired";
            resultDiv.classList.add("warning");
        } else {
            resultDiv.innerHTML = "✅ Activation Valid";
            resultDiv.classList.add("success");
        }

    } catch(error){
        console.error(error);
        btnEl.disabled = false;
        btnEl.innerHTML = 'Verify License';
        resultDiv.innerHTML = "❌ Server Connection Error";
        resultDiv.classList.add("error");
        cardEl.classList.add("shake");
    }
}

// Allow "Enter" key to submit
document.getElementById("deviceId").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        checkLicense();
    }
});
