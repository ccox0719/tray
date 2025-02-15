document.addEventListener("DOMContentLoaded", () => {
  console.log("Script loaded successfully.");

  const url = "devotionals.json"; // Ensure the file path matches your setup
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

  // Function to sanitize text (fixes encoding issues)
function sanitizeText(text) {
  if (!text) return ""; // Handle empty cases

  return text
    .replace(/^\s*[\u200B-\u200F\uFEFF]/g, "") // Remove hidden characters at the start
    .replace(/\u2019/g, "'")  // Curly apostrophe → Straight apostrophe
    .replace(/\u2013|\u2014/g, "-")  // En-dash/Em-dash → Hyphen
    .replace(/\u201C/g, '"')  // Left curly quote → Straight double quote
    .replace(/\u201D/g, '"')  // Right curly quote → Straight double quote
    .replace(/\u2026/g, "...")  // Ellipsis → Three dots
    .trim(); // Remove leading/trailing spaces
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
        
        // ✅ Fix: Apply sanitizeText() inside loadDevotional()
        document.getElementById("reference").textContent = sanitizeText(study.Reference);
        document.getElementById("passage").textContent = sanitizeText(study.Passage);
        document.getElementById("reflection").textContent = sanitizeText(study["Reflective Question"]);
        document.getElementById("prayer").textContent = sanitizeText(study["Prayer Prompt"]);

        // Format and display the date with the suffix
        document.getElementById("current-date").textContent = formatDateWithSuffix(date);
      })
      .catch(error => console.error("❌ Error loading devotional:", error));
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

  // ✅ Remove incorrect `study` references here. They only exist inside `loadDevotional()`

  // Initial Page Load
  loadDevotional(currentDate);
});
