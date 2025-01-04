document.addEventListener("DOMContentLoaded", function () {
  const voteButtons = document.querySelectorAll(".vote-option");
  const submitButton = document.getElementById("show-vote");
  voteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove selected class from all options
      voteButtons.forEach((b) => b.classList.remove("selected"));

      // Add 'selected' class to the clicked button
      this.classList.add("selected");

      // Enable the submite button
      submitButton.disabled = false;
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("name-modal");
  const closeBtn = document.querySelector(".close");
  const joinButton = document.getElementById("join-button");
  const playerNameInput = document.getElementById("player-name");
  const playerCardsContainer = document.getElementById("player-cards");
  const roomId = "{{ room.id }}"; // Room ID from Flask context

  // Function to update the player cards
  function updatePlayerCards() {
    fetch(`/game/${roomId}/players`)
      .then((response) => response.json())
      .then((players) => {
        // Clear the current player cards
        playerCardsContainer.innerHTML = "";

        // Add a new player card for each player
        players.forEach((player) => {
          const playerCard = document.createElement("div");
          playerCard.classList.add("player-card");
          playerCard.innerHTML = `<h3>${player}</h3>`;
          playerCardsContainer.appendChild(playerCard);
        });
      })
      .catch((err) => console.error("Error updating player cards:", err));
  }

  // Show the modal when the page loads
  modal.style.display = "block";

  // Close the modal when the user clicks the close button
  closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // Event listener for the "Join Game" button
  joinButton.addEventListener("click", function () {
    const playerName = playerNameInput.value.trim();

    if (playerName === "") {
      alert("Please enter your name!");
      return;
    }

    // Send AJAX request to add the player to the game
    fetch(`/game/${roomId}/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ player_name: playerName }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          modal.style.display = "none"; // Close the modal
          updatePlayerCards(); // Update the player cards
        } else {
          alert("Failed to join game");
        }
      })
      .catch((err) => console.error("Error joining game:", err));
  });

  // Initial player card update
  updatePlayerCards();
});
