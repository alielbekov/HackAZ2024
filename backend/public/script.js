document.getElementById('getWordButton').addEventListener('click', function() {
    fetch('/get-word')
        .then(response => response.json())
        .then(data => {
            const wordContainer = document.getElementById('wordContainer');
            wordContainer.textContent = `Fetched Word: ${data.currentWord}`;
        })
        .catch(error => console.error('Error fetching word:', error));
});

document.getElementById('getSentenceButton').addEventListener('click', function() {
    fetch('/get-sentence')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const sentenceContainer = document.getElementById('sentenceContainer');
            sentenceContainer.textContent = `Fetched Sentence: ${data.currentSentence}`;
        })
        .catch(error => console.error('Error fetching sentence:', error));
});


document.getElementById('uploadButton').addEventListener('click', function() {
    const imageInput = document.getElementById('imageInput');
    if(imageInput.files.length > 0) {
        const formData = new FormData();
        formData.append('image', imageInput.files[0]);

        fetch('/image', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('uploadStatus').textContent = `Letters found: ${data.lettersFound.join(', ')}`;
        })
        .catch(error => {
            console.error('Error uploading image:', error);
            document.getElementById('uploadStatus').textContent = 'Error uploading image.';
        });
    } else {
        document.getElementById('uploadStatus').textContent = 'Please select an image to upload.';
    }
});
