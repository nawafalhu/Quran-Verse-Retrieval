document.getElementById('verseForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const surahSelect = document.getElementById('surahSelect');
    const surahNumber = surahSelect.value;
    const ayahNumber = document.getElementById('ayahNumber').value;
    const messageElement = document.getElementById('message');
    const versesContainer = document.getElementById('versesContainer');

    messageElement.textContent = '';
    versesContainer.innerHTML = '';

    let apiUrl = `https://api.alquran.cloud/v1/surah/${surahNumber}`;

    // Explicitly check if Ayah number is provided and valid
    if (ayahNumber.trim() !== "" && !isNaN(ayahNumber) && parseInt(ayahNumber) > 0) {
        // If Ayah number is valid, modify the URL to fetch only that specific Ayah
        apiUrl = `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}`;
    }

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Determine what type of data is expected based on the API request
            if (ayahNumber.trim() !== "" && data.data && !data.data.ayahs) {
                // Handling single Ayah
                const p = document.createElement('p');
                p.textContent = `${data.data.numberInSurah}: ${data.data.text}`;
                versesContainer.appendChild(p);
            } else if (data.data && data.data.ayahs) {
                // Handling all Ayahs in the Surah
                data.data.ayahs.forEach(ayah => {
                    const p = document.createElement('p');
                    p.textContent = `${ayah.numberInSurah}: ${ayah.text}`;
                    versesContainer.appendChild(p);
                });
            } else {
                messageElement.textContent = 'No verses found for this Surah or Ayah.';
            }
        })
        .catch(error => {
            messageElement.textContent = 'Error retrieving data: ' + error.message;
        });
});
