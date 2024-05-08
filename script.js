document.getElementById('verseForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const pageInput = document.getElementById('pageNumber').value; 
    const messageElement = document.getElementById('message');
    const versesContainer = document.getElementById('versesContainer');

    messageElement.textContent = '';
    versesContainer.innerHTML = '';

    
    if (!pageInput || isNaN(pageInput) || parseInt(pageInput) < 1 || parseInt(pageInput) > 604) {
        messageElement.textContent = 'Please enter a valid page number between 1 and 604.';
        return;
    }

    
    const url = `https://api.quran.com/api/v4/quran/verses/uthmani?page_number=${pageInput}`;

    
    fetch(url)
        .then(response => {
            if (!response.ok) { 
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); 
        })
        .then(data => {
            
            if (data && data.verses && data.verses.length > 0) {
                data.verses.forEach(verse => {
                    const p = document.createElement('p');
                    p.textContent = `${verse.text_uthmani}`;
                    versesContainer.appendChild(p);
                });
            } else {
                messageElement.textContent = 'No verses found for this page.';
            }
        })
        .catch(error => {
            
            messageElement.textContent = 'Error fetching data: ' + error.message;
        });
});
