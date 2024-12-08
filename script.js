document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const elements = {
    searchInput: document.getElementById("searchInput"),
    dropdown: document.getElementById("dropdown"),
    eventForm: document.getElementById("eventForm"),
    clearAllButton: document.getElementById("clearAll"),
    selectedEventsContainer: document.getElementById("selectedEventsContainer"),
    sortOrder: document.getElementById("sortOrder"),
    submitButton: document.querySelector(".submit-button"),
  };

  // Data
  const events = [
    { id: 1, name: "Music Festival", date: "2024-12-15", time: "18:00" },
    { id: 2, name: "Art Exhibition", date: "2024-12-20", time: "14:00" },
    { id: 3, name: "Tech Conference", date: "2024-12-25", time: "10:00" },
    { id: 4, name: "Food Fair", date: "2024-12-30", time: "12:00" },
    { id: 5, name: "Film Screening", date: "2024-12-10", time: "19:30" },
    { id: 6, name: "Book Launch", date: "2024-12-18", time: "17:00" },
    { id: 7, name: "Charity Run", date: "2024-12-22", time: "08:00" },
    { id: 8, name: "Comedy Night", date: "2024-12-12", time: "20:00" },
    { id: 9, name: "Craft Workshop", date: "2024-12-16", time: "11:00" },
    { id: 10, name: "Wine Tasting", date: "2024-12-19", time: "18:30" },
    { id: 11, name: "Yoga Retreat", date: "2024-12-21", time: "07:00" },
    { id: 12, name: "Jazz Concert", date: "2024-12-13", time: "21:00" },
    { id: 13, name: "Dance Showcase", date: "2024-12-27", time: "15:00" },
    { id: 14, name: "Outdoor Movie Night", date: "2024-12-14", time: "18:30" },
    { id: 15, name: "Fitness Bootcamp", date: "2024-12-11", time: "06:30" },
  ];
  const selectedEvents = new Set();
  let lastSubmittedEvents = new Set();
  let dropdownChanges = false;
  let selectionChanged = false;

  // Functions
  const toggleSubmitButton = () => {
    const hasChanges =
      selectedEvents.size !== lastSubmittedEvents.size ||
      Array.from(selectedEvents).some((id) => !lastSubmittedEvents.has(id));

    elements.submitButton.disabled = !dropdownChanges || !hasChanges;
    elements.clearAllButton.disabled = selectedEvents.size === 0;
  };

  const toggleSortOrderState = () => {
    elements.sortOrder.disabled = elements.dropdown.style.display !== "block";
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const sortEvents = (events, sortOrderValue) => {
    const sortedEvents = [...events];
    switch (sortOrderValue) {
      case "az":
        return sortedEvents.sort((a, b) => a.name.localeCompare(b.name));
      case "za":
        return sortedEvents.sort((a, b) => b.name.localeCompare(a.name));
      case "nearest":
        return sortedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
      case "furthest":
        return sortedEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
      default:
        return events;
    }
  };

  const filterEvents = (query) => {
    if (!query.trim()) return events;
    return events.filter((event) =>
      event.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const createListItem = (event) => {
    const li = document.createElement("li");
    li.classList.toggle("selected", selectedEvents.has(event.id));

    const tickIcon = document.createElement("i");
    tickIcon.className = "fa fa-check";
    tickIcon.style.color = "green";
    tickIcon.style.marginLeft = "10px";
    tickIcon.style.display = selectedEvents.has(event.id)
      ? "inline-block"
      : "none";

    const label = document.createElement("span");
    label.innerHTML = `<strong>${event.name}</strong><small>${formatDate(
      event.date
    )} at ${event.time}</small>`;

    li.appendChild(label);
    li.appendChild(tickIcon);

    li.addEventListener("click", () => {
      selectionChanged = true;
      if (selectedEvents.has(event.id)) {
        selectedEvents.delete(event.id);
        li.classList.remove("selected");
        tickIcon.style.display = "none";
      } else {
        selectedEvents.add(event.id);
        li.classList.add("selected");
        tickIcon.style.display = "inline-block";
      }

      elements.searchInput.value = "";
      dropdownChanges = true;
      toggleSubmitButton();
    });

    return li;
  };

  const renderDropdown = (query) => {
    elements.dropdown.innerHTML = "";
    const filteredItems = sortEvents(
      filterEvents(query),
      elements.sortOrder.value
    );

    if (filteredItems.length) {
      filteredItems.forEach((event) =>
        elements.dropdown.appendChild(createListItem(event))
      );
    } else {
      const noResults = document.createElement("li");
      noResults.textContent = "No results found";
      noResults.className = "no-results";
      elements.dropdown.appendChild(noResults);
    }

    elements.dropdown.style.display = "block";
    toggleSortOrderState();
    elements.dropdown.scrollTop = 0;
  };

  const renderSelectedEvents = () => {
    elements.selectedEventsContainer.innerHTML = "";
    Array.from(selectedEvents).forEach((eventId) => {
      const event = events.find((e) => e.id === eventId);

      const div = document.createElement("div");
      div.className = "selected-event";

      const span = document.createElement("span");
      span.textContent = event.name;

      const closeButton = document.createElement("i");
      closeButton.className = "fa fa-times remove-event";
      closeButton.style.marginLeft = "6px";
      closeButton.style.cursor = "pointer";
      closeButton.addEventListener("click", () => {
        selectedEvents.delete(event.id);
        console.log(`Removed event ID: ${event.id}`);
        toggleSubmitButton();
        renderSelectedEvents();
      });

      div.appendChild(span);
      div.appendChild(closeButton);
      elements.selectedEventsContainer.appendChild(div);
    });
  };

  // Event Listeners
  elements.searchInput.addEventListener("focus", () =>
    renderDropdown(elements.searchInput.value.trim())
  );

  elements.searchInput.addEventListener("input", () =>
    renderDropdown(elements.searchInput.value.trim())
  );

  elements.sortOrder.addEventListener("change", () =>
    renderDropdown(elements.searchInput.value.trim())
  );

  elements.clearAllButton.addEventListener("click", () => {
    selectedEvents.clear();
    console.log("All events cleared.");
    lastSubmittedEvents.clear();
    dropdownChanges = true;
    elements.searchInput.value = "";
    toggleSubmitButton();
    renderSelectedEvents();
    elements.dropdown.style.display = "none";
    toggleSortOrderState();
  });

  elements.eventForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Simulate posting the IDs as a comma-separated list
    const selectedIds = Array.from(selectedEvents).join(",");
    console.log(`Submitted Event IDs: ${selectedIds}`);

    lastSubmittedEvents = new Set(selectedEvents);
    dropdownChanges = false;
    selectionChanged = false;
    renderSelectedEvents();
    elements.dropdown.style.display = "none";
    toggleSubmitButton();
    toggleSortOrderState();
  });

  document.addEventListener("click", (event) => {
    if (
      !event.target.closest(".search-container") &&
      elements.dropdown.style.display === "block"
    ) {
      if (!selectionChanged) {
        elements.dropdown.style.display = "none";
        toggleSortOrderState();
      }
    }
  });

  // Initial State
  elements.sortOrder.disabled = true;
  elements.submitButton.textContent = "Apply";
  toggleSubmitButton();
});
