document.addEventListener("DOMContentLoaded", () => {
  console.log("Script loaded successfully.");

  const url = "./bible-study.json";
  const memoryUrl = "./memory.json";
  let currentDate = new Date();
  let currentContent = {};

  // DOM Elements
  const toggleEditButton = document.getElementById("toggle-edit");
  const editor = document.getElementById("editor");
  const saveChangesButton = document.getElementById("save-changes");

  console.log("Toggle Edit Button:", toggleEditButton);
  console.log("Editor:", editor);
  console.log("Save Changes Button:", saveChangesButton);

  // Check if Edit Mode Elements Exist
  if (toggleEditButton && editor && saveChangesButton) {
    console.log("Edit Mode: Enabled");

    // Toggle Edit Mode
    toggleEditButton.addEventListener("click", () => {
      const isEditorVisible = editor.style.display === "block";
      editor.style.display = isEditorVisible ? "none" : "block";

      if (!isEditorVisible) {
        populateEditorFields(currentContent); // Populate editor fields on open
      } else {
        reloadContent(currentContent); // Reload content on close
      }

      console.log("Editor Visibility:", editor.style.display);
    });

    // Save Changes
    saveChangesButton.addEventListener("click", () => {
      const updatedData = {
        Reference: document.getElementById("edit-reference").value,
        Passage: document.getElementById("edit-passage").value,
        "Reflective Question": document.getElementById("edit-question").value,
        "Prayer Prompt": document.getElementById("edit-prayer").value,
      };

      console.log("Updated Data:", updatedData);

      // Update current content and reload content
      currentContent = updatedData;
      reloadContent(updatedData);

      // Hide editor after saving
      editor.style.display = "none";
      console.log("Changes saved successfully.");
    });
  } else {
    console.log("Edit Mode: Not Enabled (Viewer Mode).");
  }

  // Utility Functions
  function populateEditorFields(dayData) {
    document.getElementById("edit-reference").value = dayData.Reference || "";
    document.getElementById("edit-passage").value = dayData.Passage || "";
    document.getElementById("edit-question").value = dayData["Reflective Question"] || "";
    document.getElementById("edit-prayer").value = dayData["Prayer Prompt"] || "";
  }

  function reloadContent(dayData) {
    document.getElementById("reference").textContent = dayData.Reference || "No reference available.";
    document.getElementById("passage").textContent = dayData.Passage || "No passage available.";
    document.getElementById("reflection").textContent = dayData["Reflective Question"] || "No reflective question available.";
    document.getElementById("prayer").textContent = dayData["Prayer Prompt"] || "No prayer prompt available.";
  }

  // Format Date
  function formatDate(date) {
    const options = { month: "long", day: "numeric" }; // Match JSON key format
    return date.toLocaleDateString("en-US", options);
  }
  

  // Load Devotional
  function loadDevotional(date) {
    console.log("Loading devotional for date:", date);

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch devotional: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        const formattedDate = formatDate(date);
        console.log("Formatted Date:", formattedDate);

        const study = data[formattedDate] || {
          Reference: "No study found for this date.",
          Passage: "No passage available.",
          "Reflective Question": "No reflective question available.",
          "Prayer Prompt": "No prayer prompt available.",
        };

        currentContent = study; // Save current content globally
        reloadContent(study);

        // Update displayed date
        document.getElementById("current-date").textContent = formattedDate;
      })
      .catch((error) => {
        console.error("Error loading devotional:", error);
        document.getElementById("current-date").textContent = "Error loading date.";
        reloadContent({});
      });
  }

  // Load Memory Verse
  function loadMemoryVerse(date) {
    console.log("Loading memory verse for date:", date);

    fetch(memoryUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch memory verse: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((memoryData) => {
        const weekNumber = Math.ceil((date - new Date(date.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
        const weekData = memoryData[`Week ${weekNumber}`] || {
          Reference: "No reference available.",
          Text: "No memory verse available.",
        };

        document.getElementById("memory-verse").textContent = `${weekData.Reference} - ${weekData.Text}`;
      })
      .catch((error) => {
        console.error("Error loading memory verse:", error);
        document.getElementById("memory-verse").textContent = "Error loading memory verse.";
      });
  }

  // Update Streak Badge
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

  // Navigation Buttons
  document.getElementById("prev-day")?.addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() - 1);
    loadDevotional(currentDate);
    loadMemoryVerse(currentDate);
  });

  document.getElementById("next-day")?.addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() + 1);
    loadDevotional(currentDate);
    loadMemoryVerse(currentDate);
  });

  // Initial Page Load
  loadDevotional(currentDate);
  loadMemoryVerse(currentDate);
  updateStreakBadge();
});
