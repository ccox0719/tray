const url = "./bible-study.json";
const memoryUrl = "./memory.json";
const apiUrl = "/api/daily-prayer";
let currentDate = new Date();

// Function to format the date into JSON keys (e.g., "January 1")
function formatDate(date) {
  const options = { month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

function loadDailyPrayer() {
  // Include the `ROL3Profile=eng` parameter for English-only content
  const apiUrl = 'https://joshuaproject.net/api/v2/upgotd?api_key=5a7a72d15225&ROL3Profile=eng';

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Filtered API Response:", data);

      // Extract the prayer data
      const prayerData = data.data[0]; // Assuming we only need the first entry

      const prayerFocus = document.getElementById('prayer-focus');
      const peopleGroup = document.getElementById('people-group');
      const scriptureReference = document.getElementById('scripture-reference');
      const scripturePrayer = document.getElementById('scripture-prayer');
      const photoElement = document.getElementById('people-photo');

      if (prayerData) {
        prayerFocus.textContent = prayerData.ScripturePrayer || "No prayer focus available.";
        peopleGroup.textContent = prayerData.PeopNameAcrossCountries || "Unknown people group.";
        scriptureReference.textContent = prayerData.ScriptureReference || "No scripture reference available.";
        scripturePrayer.textContent = prayerData.ScripturePrayer || "No prayer text available.";

        if (prayerData.PhotoAddress) {
          photoElement.src = prayerData.PhotoAddress;
          photoElement.alt = `Image of ${prayerData.PeopNameAcrossCountries}`;
        } else {
          photoElement.src = "";
          photoElement.alt = "No image available.";
        }
      } else {
        console.error("No prayer data found.");
        prayerFocus.textContent = "Error loading prayer focus.";
      }
    })
    .catch(error => {
      console.error("Error fetching daily prayer:", error);
      const prayerFocus = document.getElementById('prayer-focus');
      if (prayerFocus) {
        prayerFocus.textContent = "Error loading prayer focus.";
      }
    });
}

// Call the function to load daily prayer
loadDailyPrayer();
// Toggle Prayer Section Visibility
document.getElementById("toggle-prayer").addEventListener("click", function () {
  const prayerSection = document.getElementById("prayer-section");
  const toggleButton = document.getElementById("toggle-prayer");

  if (prayerSection.classList.contains("hidden")) {
    prayerSection.classList.remove("hidden");
    toggleButton.textContent = "Hide Harvest Prayer";
  } else {
    prayerSection.classList.add("hidden");
    toggleButton.textContent = "Harvest Prayer";
  }
});


// Function to Load Devotional for the Current Date
function loadDevotional(date) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const formattedDate = formatDate(date);
      console.log("Formatted Date:", formattedDate);
      console.log("Data for Date:", data[formattedDate]); // Debugging log

      const study = data[formattedDate] || {
        Reference: "No study found for this date.",
        Passage: "No passage available.",
        "Reflective Question": "No reflective question available.",
        "Prayer Prompt": "No prayer prompt available.",
      };

      // Update DOM elements
      document.getElementById("current-date").textContent = formattedDate;
      document.getElementById("reference").textContent = study.Reference;
      document.getElementById("passage").textContent = study.Passage;
      document.getElementById("reflection").textContent = study["Reflective Question"];
      document.getElementById("prayer").textContent = study["Prayer Prompt"];
    })
    .catch((error) => {
      console.error("Error loading devotional:", error);
      document.getElementById("bible-study").innerHTML = `
        <p>Error loading devotional. Please try again later.</p>
      `;
    });
}

// Function to Load Weekly Memory Verse
function loadMemoryVerse(date) {
  fetch(memoryUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((memoryData) => {
      console.log("Memory Verse Data:", memoryData); // Debugging log

      // Calculate the current week number
      const weekNumber = Math.ceil((date - new Date(date.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
      console.log("Week Number:", weekNumber);

      const weekData = memoryData[`Week ${weekNumber}`];

      // Update Memory Verse
      const memoryVerseText = weekData?.Text || "No memory verse available.";
      const memoryVerseReference = weekData?.Reference || "No reference available.";
      document.getElementById("memory-verse").textContent = `${memoryVerseReference} - ${memoryVerseText}`;
    })
    .catch((error) => {
      console.error("Error loading memory verse:", error);
      document.getElementById("memory-verse").textContent = "Error loading memory verse.";
    });
}

// Function to Update Streak Badge
function updateStreakBadge() {
  const streakKey = "dailyDevotionalStreak";
  const lastVisitKey = "lastVisitDate";

  const today = new Date().toDateString();
  const lastVisit = localStorage.getItem(lastVisitKey);
  let streak = parseInt(localStorage.getItem(streakKey), 10) || 0;

  if (lastVisit && new Date(lastVisit).toDateString() === new Date(new Date().setDate(new Date().getDate() - 1)).toDateString()) {
    streak++;
  } else if (lastVisit !== today) {
    streak = 1;
  }

  localStorage.setItem(lastVisitKey, today);
  localStorage.setItem(streakKey, streak);

  document.getElementById("streak-number").textContent = streak;
}

// Event Listeners for Navigation Buttons
document.getElementById("prev-day").addEventListener("click", () => {
  currentDate.setDate(currentDate.getDate() - 1);
  loadDevotional(currentDate);
});

document.getElementById("next-day").addEventListener("click", () => {
  currentDate.setDate(currentDate.getDate() + 1);
  loadDevotional(currentDate);
});

// Initial Page Load
loadDailyPrayer();
loadDevotional(currentDate);
loadMemoryVerse(currentDate);
updateStreakBadge();
