function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function() {
    console.log('User signed out.');
  });
}

function updateEnergyValue(val) {
  document.getElementById('energy').textContent = val;
  document.getElementById('energy-number').value = val;
}

function updateEnergyRange(val) {
  document.getElementById('energy-number').textContent = val;
  document.getElementById('energy').value = val;
}

function updateSatisfactionValue(val) {
  document.getElementById('satisfaction').textContent = val;
  document.getElementById('satisfaction-number').value = val;
}

function updateSatisfactionRange(val) {
  document.getElementById('satisfaction-number').textContent = val;
  document.getElementById('satisfaction').value = val;
}

const resultModal = document.querySelector('.resultModal');
const resultModalCloseBtn = document.querySelector('.resultModalClose-btn');

function openResultModal() {
  resultModal.style.display = 'block';
}

function closeResultModal() {
  resultModal.style.display = 'none';
}

document.querySelector('button').addEventListener('click', openResultModal);
resultModalCloseBtn.addEventListener('click', closeResultModal);
window.addEventListener('click', (event) => {
  if (event.target == resultModal) {
    closeResultModal();
  }
});

const emailModal = document.querySelector('.emailModal');
const closeEmailBtn = document.querySelector('.emailModalClose-btn');

function openEmailModal() {
  emailModal.style.display = 'block';
}

function closeEmailModal() {
  emailModal.style.display = 'none';
}

closeEmailBtn.addEventListener('click', closeEmailModal);
window.addEventListener('click', (event) => {
  if (event.target == emailModal) {
    closeEmailModal();
  }
});

function saveUserEmail() {
  const userEmailInput = document.getElementById('emailUserInput').value;
  if (userEmailInput) {
    localStorage.setItem('userEmail', userEmailInput);
  } else {
    alert("Invalid email!");
  }
  closeEmailModal();
  openResultModal();
  sendUserInfo();
}

function calculateMessage() {
  const energy = parseInt(document.getElementById("energy").value);
  const satisfaction = parseInt(document.getElementById("satisfaction").value);

  Papa.parse("data.csv", {
    download: true,
    header: true,
    complete: function(results) {
      const message = results.data.find(m => m.energy_key == energy && m.satisfaction_key == satisfaction);
      const emotion = message ? message.emotion : "Message not found";
      const description = message ? message.description : "";
      const emoji = message ? message.emoji : "";
      const backgroundColor = message ? message.color : "#fff";

      saveSessionEmotion(energy, satisfaction, emotion, description, emoji, backgroundColor);

      const savedUserEmail = localStorage.getItem('userEmail');
      if (savedUserEmail) {
        openResultModal();
        sendUserInfo();
      } else {
        openEmailModal();
      }
    },
    error: function(error) {
      console.error(error);
      document.getElementById("message").textContent = "Error reading the file";
    }
  });
}

function saveSessionEmotion(energy, satisfaction, emotion, description, emoji, backgroundColor) {
  document.getElementById("message").textContent = emotion;
  document.getElementById("description").textContent = description;
  document.getElementById("emoji").textContent = emoji;
  const elements = document.getElementsByClassName("resultModal-content");
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.backgroundColor = backgroundColor;
  }
  var currentDate = new Date();
  var datetime = currentDate.getDate() + "/" +
    (currentDate.getMonth() + 1) + "/" +
    currentDate.getFullYear() + " - " +
    currentDate.getHours() + ":" +
    currentDate.getMinutes();
  sessionStorage.setItem('datetime', datetime);
  sessionStorage.setItem('energy', energy);
  sessionStorage.setItem('satisfaction', satisfaction);
  sessionStorage.setItem('emotion', emotion);
  sessionStorage.setItem('description', description);
  sessionStorage.setItem('emoji', emoji);
  sessionStorage.setItem('backgroundColor', backgroundColor);
}

function sendUserInfo() {
  var datetime = sessionStorage.getItem('datetime');
  var energy = sessionStorage.getItem('energy');
  var satisfaction = sessionStorage.getItem('satisfaction');
  var emotion = sessionStorage.getItem('emotion');
  var description = sessionStorage.getItem('description');
  var emoji = sessionStorage.getItem('emoji');
  var backgroundColor = sessionStorage.getItem('backgroundColor');
  var savedUserEmail = localStorage.getItem('userEmail');
  
  console.log("User Information:");
  console.log(savedUserEmail + " -> " + datetime + " - " +
    "Energy: " + energy + " - " +
    "Satisfaction: " + satisfaction + " - " +
    "Emotion: " + emotion);
}
