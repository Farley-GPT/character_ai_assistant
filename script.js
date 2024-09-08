document.addEventListener('DOMContentLoaded', () => {
    const charCounters = document.querySelectorAll('.char-count');
    const copyButtons = document.querySelectorAll('.copy-btn');
    const addDialogueBtn = document.getElementById('add-dialogue');
    const clearDialogueBtn = document.getElementById('clear-dialogue');
    const backgroundImageInput = document.getElementById('background-image');
    const resetBackgroundBtn = document.getElementById('reset-background');
    const profilePictureInput = document.getElementById('profile-picture');
    const removeProfilePictureBtn = document.getElementById('remove-profile-picture');
    const generateBtn = document.getElementById('generate-btn');
    const saveBtn = document.getElementById('save-btn');
    const copyProfileBtn = document.getElementById('copy-profile-btn');
    const generatedProfile = document.getElementById('generated-profile');
    const characterList = document.getElementById('character-list');
    const characterSelect = document.getElementById('character-select');
    const deleteCharacterBtn = document.getElementById('delete-character-btn');
    const resetAllBtn = document.getElementById('reset-all-btn');
    const backgroundWrapper = document.getElementById('background-wrapper');

    // Character count
    charCounters.forEach(counter => {
        const input = counter.previousElementSibling;
        input.addEventListener('input', () => {
            const count = input.value.length;
            const max = input.getAttribute('maxlength');
            counter.textContent = `${count}/${max}`;
            if (count >= max) {
                counter.style.color = 'red';
            } else {
                counter.style.color = '#666';
            }
        });
    });

    // Copy buttons
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            targetElement.select();
            document.execCommand('copy');
            alert('Copied to clipboard!');
        });
    });

    // Dialogue creator
    addDialogueBtn.addEventListener('click', () => {
        const userInput = document.getElementById('user-input').value;
        const characterInput = document.getElementById('character-input').value;
        const dialoguePreview = document.getElementById('dialogue-preview');
        const formattedDialogue = `{{User}}: ${userInput}\n{{Char}}: ${characterInput}\n\n`;
        dialoguePreview.textContent += formattedDialogue;

        const definitionTextarea = document.getElementById('definition');
        definitionTextarea.value += formattedDialogue;
        updateCharCount(definitionTextarea);
    });

    clearDialogueBtn.addEventListener('click', () => {
        document.getElementById('user-input').value = '';
        document.getElementById('character-input').value = '';
        document.getElementById('dialogue-preview').textContent = '';
    });

    // Background image
    backgroundImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                backgroundWrapper.style.backgroundImage = `url(${e.target.result})`;
                updateBackgroundStyle();
            };
            reader.readAsDataURL(file);
        }
    });

    resetBackgroundBtn.addEventListener('click', () => {
        backgroundWrapper.style.backgroundImage = 'none';
        backgroundWrapper.style.backgroundAttachment = 'scroll';
        backgroundImageInput.value = '';
    });

    // Background style
    document.getElementById('background-style').addEventListener('change', updateBackgroundStyle);

    function updateBackgroundStyle() {
        const backgroundStyle = document.getElementById('background-style').value;
        backgroundWrapper.style.backgroundAttachment = backgroundStyle;
        backgroundWrapper.style.backgroundSize = 'cover';
        backgroundWrapper.style.backgroundPosition = 'center';
    }

    // Profile picture
    profilePictureInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.getElementById('profile-picture-preview');
                preview.innerHTML = `<img src="${e.target.result}" alt="Profile Picture">`;
            };
            reader.readAsDataURL(file);
        }
    });

    removeProfilePictureBtn.addEventListener('click', () => {
        document.getElementById('profile-picture-preview').innerHTML = '';
        profilePictureInput.value = '';
    });

    generateBtn.addEventListener('click', generateProfile);
    saveBtn.addEventListener('click', saveCharacter);
    copyProfileBtn.addEventListener('click', copyGeneratedProfile);
    deleteCharacterBtn.addEventListener('click', deleteSelectedCharacter);
    resetAllBtn.addEventListener('click', resetAll);

    function generateProfile() {
        const name = document.getElementById('character-name').value;
        const tagline = document.getElementById('tagline').value;
        const description = document.getElementById('description').value;
        const greeting = document.getElementById('greeting').value;
        const definition = document.getElementById('definition').value;
        const profilePic = document.querySelector('#profile-picture-preview img');

        let profileHTML = '';
        if (profilePic) {
            profileHTML += `<img src="${profilePic.src}" alt="Profile Picture" style="max-width: 200px; max-height: 200px;"><br>`;
        }
        profileHTML += `<strong>Name:</strong> ${name}<br>`;
        profileHTML += `<strong>Tagline:</strong> ${tagline}<br>`;
        profileHTML += `<strong>Description:</strong> ${description}<br>`;
        profileHTML += `<strong>Greeting:</strong> ${greeting}<br>`;
        profileHTML += `<strong>Definition:</strong> ${definition}<br>`;

        generatedProfile.innerHTML = profileHTML;
        copyProfileBtn.style.display = 'inline-block';
    }

    function saveCharacter() {
        const character = {
            name: document.getElementById('character-name').value,
            tagline: document.getElementById('tagline').value,
            description: document.getElementById('description').value,
            greeting: document.getElementById('greeting').value,
            definition: document.getElementById('definition').value,
            profilePic: document.querySelector('#profile-picture-preview img')?.src
        };

        if (!character.name) {
            alert('Please enter a character name before saving.');
            return;
        }

        let savedCharacters = JSON.parse(localStorage.getItem('savedCharacters')) || [];
        savedCharacters.push(character);
        localStorage.setItem('savedCharacters', JSON.stringify(savedCharacters));

        updateCharacterList();
        updateCharacterSelect();
        alert(`Character "${character.name}" has been saved.`);
    }

    function copyGeneratedProfile() {
        const range = document.createRange();
        range.selectNode(generatedProfile);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
        alert('Profile copied to clipboard!');
    }

    function updateCharacterList() {
        const savedCharacters = JSON.parse(localStorage.getItem('savedCharacters')) || [];
        characterList.innerHTML = '';

        savedCharacters.forEach((character, index) => {
            const characterDiv = document.createElement('div');
            characterDiv.className = 'saved-character';
            characterDiv.style.display = 'inline-block';
            characterDiv.style.margin = '10px';
            characterDiv.style.textAlign = 'center';

            const thumbnail = document.createElement('img');
            thumbnail.src = character.profilePic || 'placeholder.png';
            thumbnail.alt = character.name;
            thumbnail.style.width = '100px';
            thumbnail.style.height = '100px';
            thumbnail.style.objectFit = 'cover';

            const nameSpan = document.createElement('span');
            nameSpan.textContent = character.name;

            characterDiv.appendChild(thumbnail);
            characterDiv.appendChild(document.createElement('br'));
            characterDiv.appendChild(nameSpan);

            characterDiv.addEventListener('click', () => loadCharacter(index));

            characterList.appendChild(characterDiv);
        });
    }

    function updateCharacterSelect() {
        const savedCharacters = JSON.parse(localStorage.getItem('savedCharacters')) || [];
        characterSelect.innerHTML = '<option value="">Select a character</option>';

        savedCharacters.forEach((character, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = character.name;
            characterSelect.appendChild(option);
        });
    }

    function loadCharacter(index) {
        const savedCharacters = JSON.parse(localStorage.getItem('savedCharacters')) || [];
        const character = savedCharacters[index];

        document.getElementById('character-name').value = character.name;
        document.getElementById('tagline').value = character.tagline;
        document.getElementById('description').value = character.description;
        document.getElementById('greeting').value = character.greeting;
        document.getElementById('definition').value = character.definition;

        const profilePicPreview = document.getElementById('profile-picture-preview');
        if (character.profilePic) {
            profilePicPreview.innerHTML = `<img src="${character.profilePic}" alt="Profile Picture">`;
        } else {
            profilePicPreview.innerHTML = '';
        }

        // Update character counts
        document.querySelectorAll('.char-count').forEach(counter => {
            const input = counter.previousElementSibling;
            const count = input.value.length;
            const max = input.getAttribute('maxlength');
            counter.textContent = `${count}/${max}`;
            counter.style.color = count >= max ? 'red' : '#666';
        });
    }

    function deleteSelectedCharacter() {
        const selectedIndex = characterSelect.value;
        if (selectedIndex === '') {
            alert('Please select a character to delete.');
            return;
        }

        const savedCharacters = JSON.parse(localStorage.getItem('savedCharacters')) || [];
        const characterName = savedCharacters[selectedIndex].name;

        if (confirm(`Are you sure you want to delete "${characterName}"?`)) {
            savedCharacters.splice(selectedIndex, 1);
            localStorage.setItem('savedCharacters', JSON.stringify(savedCharacters));
            updateCharacterList();
            updateCharacterSelect();
            alert(`"${characterName}" has been deleted.`);
        }
    }

    function resetAll() {
        const inputs = [
            'character-name',
            'tagline',
            'description',
            'greeting',
            'definition',
            'user-input',
            'character-input'
        ];

        inputs.forEach(id => {
            document.getElementById(id).value = '';
        });

        document.getElementById('profile-picture-preview').innerHTML = '';
        document.getElementById('profile-picture').value = '';
        document.getElementById('dialogue-preview').textContent = '';
        document.getElementById('generated-profile').innerHTML = '';
        document.getElementById('copy-profile-btn').style.display = 'none';

        // Reset character counts
        document.querySelectorAll('.char-count').forEach(counter => {
            const input = counter.previousElementSibling;
            const max = input.getAttribute('maxlength');
            counter.textContent = `0/${max}`;
            counter.style.color = '#666';
        });

        alert('All fields have been reset.');
    }

    function updateCharCount(element) {
        const count = element.value.length;
        const max = element.getAttribute('maxlength');
        const counter = element.nextElementSibling;
        counter.textContent = `${count}/${max}`;
        if (count >= max) {
            counter.style.color = 'red';
        } else {
            counter.style.color = '#666';
        }
    }

    // Initialize the character list and select
    updateCharacterList();
    updateCharacterSelect();
    updateBackgroundStyle();
});