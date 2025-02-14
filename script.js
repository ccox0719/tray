document.addEventListener("DOMContentLoaded", () => {
  console.log("Script loaded successfully.");

  const url = "devotionals.json"; // Make sure the file path matches your setup
  let currentDate = new Date();
  let currentContent = {};

  // Helper function to format the date as Month Day (st, nd, rd, th)
  function formatDateWithSuffix(date) {
    const day = date.getDate();
    let suffix = "th";

    if (day === 1 || day === 21 || day === 31) {
      suffix = "st";
    } else if (day === 2 || day === 22) {
      suffix = "nd";
    } else if (day === 3 || day === 23) {
      suffix = "rd";
    }

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = monthNames[date.getMonth()];

    return `${month} ${day}${suffix}`;
  }

  function loadDevotional(date) {
    console.log("Loading devotional for date:", date);

    fetch(url)
      .then(response => response.json())
      .then(data => {
        // Get the date part (without time) to match the JSON date format
        const simpleFormattedDate = date.toISOString().split("T")[0];
        console.log("Formatted Date:", simpleFormattedDate);

        // Find the devotional entry for the specific date
        const study = data.find(entry => entry.Date.split("T")[0] === simpleFormattedDate) || {
          Reference: "No study found for this date.",
          Passage: "No passage available.",
          "Reflective Question": "No reflective question available.",
          "Prayer Prompt": "No prayer prompt available.",
        };

        currentContent = study;
        reloadContent(study);

        // Format and display the date with the suffix
        document.getElementById("current-date").textContent = formatDateWithSuffix(date);
      })
      .catch(error => console.error("❌ Error loading devotional:", error));
  }

  function reloadContent(dayData) {
    document.getElementById("reference").textContent = dayData.Reference || "No reference available.";
    document.getElementById("passage").textContent = dayData.Passage || "No passage available.";
    document.getElementById("reflection").textContent = dayData["Reflective Question"] || "No reflective question available.";
    document.getElementById("prayer").textContent = dayData["Prayer Prompt"] || "No prayer prompt available.";
  }

  // Navigation Buttons
  document.getElementById("prev-day")?.addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() - 1);
    loadDevotional(currentDate);
  });

  document.getElementById("next-day")?.addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() + 1);
    loadDevotional(currentDate);
  });

  // Initial Page Load
  loadDevotional(currentDate);
});
