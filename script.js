const url = "./bible-study.json";
const memoryUrl = "./memory.json";
let currentDate = new Date();

// Function to format the date into JSON keys (e.g., "January 1")
function formatDate(date) {
  const options = { month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

function loadDevotional(date) {
  fetch('./bible-study.json')
    .then(response => {
      console.log("JSON Response:", response);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const formattedDate = formatDate(date);
      console.log("Formatted Date:", formattedDate);
      console.log("Data for Date:", data[formattedDate]);

      const study = data[formattedDate] || {
        Reference: "No study found for this date.",
        Passage: "No passage available.",
        "Reflective Question": "No reflective question available.",
        "Prayer Prompt": "No prayer prompt available."
      };

      // Update DOM elements
      document.getElementById("current-date").textContent = formattedDate;
      document.getElementById("reference").textContent = study.Reference || "No Reference";
      document.getElementById("passage").textContent = study.Passage || "No Passage";
      document.getElementById("reflection").textContent = study["Reflective Question"] || "No Reflective Question";
      document.getElementById("prayer").textContent = study["Prayer Prompt"] || "No Prayer Prompt";

      // Debugging logs
      console.log("Reflective Question:", study["Reflective Question"]);
      console.log("Prayer Prompt:", study["Prayer Prompt"]);
    })
    .catch(error => {
      console.error("Error loading JSON:", error);
      document.getElementById("bible-study").innerHTML = `
        <p>Error loading data. Please try again later.</p>
      `;
    });
}


function loadMemoryVerse(date) {
  fetch(memoryUrl)
    .then(response => {
      console.log("Memory Verse Response:", response);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(memoryData => {
      console.log("Memory Verse Data:", memoryData);

      // Calculate the current week number
      const weekNumber = Math.ceil((date - new Date(date.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
      console.log("Week Number:", weekNumber);

      const weekData = memoryData[`Week ${weekNumber}`];

      // Display memory verse and reference if available
      if (weekData) {
        const memoryVerseText = weekData.Text || "No memory verse available.";
        const memoryVerseReference = weekData.Reference || "No reference available.";

        document.getElementById("memory-verse").textContent = `${memoryVerseReference} - ${memoryVerseText}`;
      } else {
        document.getElementById("memory-verse").textContent = "No memory verse available for this week.";
      }
    })
    .catch(error => {
      console.error("Error loading memory verse JSON:", error);
      document.getElementById("memory-verse").textContent = "Error loading memory verse.";
    });
}


// Update streak badge
function updateStreakBadge() {
  const streakKey = "dailyDevotionalStreak";
  const lastVisitKey = "lastVisitDate";

  const today = new Date().toDateString();
  const lastVisit = localStorage.getItem(lastVisitKey);
  let streak = parseInt(localStorage.getItem(streakKey)) || 0;

  if (lastVisit && new Date(lastVisit).toDateString() === new Date(new Date().setDate(new Date().getDate() - 1)).toDateString()) {
    streak++;
  } else if (lastVisit !== today) {
    streak = 1;
  }

  localStorage.setItem(lastVisitKey, today);
  localStorage.setItem(streakKey, streak);

  document.getElementById("streak-number").textContent = streak;
}

// Add event listeners for navigation buttons
document.getElementById("prev-day").addEventListener("click", () => {
  currentDate.setDate(currentDate.getDate() - 1);
  loadDevotional(currentDate);
});

document.getElementById("next-day").addEventListener("click", () => {
  currentDate.setDate(currentDate.getDate() + 1);
  loadDevotional(currentDate);
});

// Initial page load
loadDevotional(currentDate);
loadMemoryVerse(currentDate);
updateStreakBadge();
