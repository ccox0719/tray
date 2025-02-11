document.addEventListener("DOMContentLoaded", () => {
  console.log("Script loaded successfully.");

  const url = "/bible-study.json";
  let currentDate = new Date();
  let currentContent = {};

  // DOM Elements
  const toggleEditButton = document.getElementById("toggle-edit");
  const editor = document.getElementById("editor");
  const saveChangesButton = document.getElementById("save-changes");

  console.log("Toggle Edit Button:", toggleEditButton);
  console.log("Editor:", editor);
  console.log("Save Changes Button:", saveChangesButton);

  if (toggleEditButton && editor && saveChangesButton) {
    console.log("Edit Mode: Enabled");

    toggleEditButton.addEventListener("click", () => {
      editor.style.display = editor.style.display === "block" ? "none" : "block";

      if (editor.style.display === "block") {
        populateEditorFields(currentContent); // Populate editor when opening
      } else {
        reloadContent(currentContent); // Reload on close
      }

      console.log("Editor Visibility:", editor.style.display);
    });

    saveChangesButton.addEventListener("click", () => {
      const updatedData = {
        Reference: document.getElementById("edit-reference").value,
        Passage: document.getElementById("edit-passage").value,
        "Reflective Question": document.getElementById("edit-question").value,
        "Prayer Prompt": document.getElementById("edit-prayer").value,
      };

      console.log("Updated Data:", updatedData);

      fetch("/update-json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: formatDate(currentDate), updatedData })
      })
      .then(response => response.text())
      .then(message => {
        console.log(message);
        editor.style.display = "none";
        loadDevotional(currentDate);
      })
      .catch(error => console.error("❌ Error saving JSON:", error));
    });
  } else {
    console.log("Edit Mode: Not Enabled (Viewer Mode).");
  }

  function populateEditorFields(dayData) {
    document.getElementById("edit-reference").value = dayData.Reference || "";
    document.getElementById("edit-passage").value = dayData.Passage || "";
    document.getElementById("edit-question").value = dayData["Reflective Question"] || "";
    document.getElementById("edit-prayer").value = dayData["Prayer Prompt"] || "";
  }

  function formatDate(date) {
    const options = { month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  function loadDevotional(date) {
    console.log("Loading devotional for date:", date);

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const formattedDate = formatDate(date);
        console.log("Formatted Date:", formattedDate);

        const study = data[formattedDate] || {
          Reference: "No study found for this date.",
          Passage: "No passage available.",
          "Reflective Question": "No reflective question available.",
          "Prayer Prompt": "No prayer prompt available.",
        };

        currentContent = study;
        reloadContent(study);
        document.getElementById("current-date").textContent = formattedDate;
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