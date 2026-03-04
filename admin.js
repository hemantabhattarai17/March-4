(function () {
  const ADMIN_USERNAME = "hemantabhattarai17";
  const ADMIN_PASSWORD = "Bhattarai";
  const AUTH_KEY = "studentAdminAuth";

  const loginView = document.getElementById("login-view");
  const dataView = document.getElementById("data-view");
  const loginForm = document.getElementById("admin-login-form");
  const loginStatus = document.getElementById("admin-login-status");
  const logoutBtn = document.getElementById("admin-logout-btn");

  function isAuthenticated() {
    return sessionStorage.getItem(AUTH_KEY) === "true";
  }

  function showLogin() {
    loginView.classList.remove("hidden");
    dataView.classList.add("hidden");
  }

  function showDataView() {
    loginView.classList.add("hidden");
    dataView.classList.remove("hidden");
    loadStudents();
  }

  function getApiBase() {
    if (window.location.protocol === "file:") return null;
    return "";
  }

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("admin-username").value.trim();
      const password = document.getElementById("admin-password").value;
      loginStatus.textContent = "";
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        sessionStorage.setItem(AUTH_KEY, "true");
        showDataView();
      } else {
        loginStatus.textContent = "Incorrect username or password.";
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      sessionStorage.removeItem(AUTH_KEY);
      showLogin();
    });
  }

  function loadStudents() {
    const tableBody = document.querySelector("#students-table tbody");
    const statusEl = document.getElementById("admin-data-status");
    if (!tableBody) return;

    const base = getApiBase();
    if (base === null) {
      if (statusEl) statusEl.textContent = "Open this page from the Node server (http://localhost:3000/admin.html) to load data.";
      return;
    }

    statusEl.textContent = "Loading...";
    fetch(base + "/api/students")
      .then(function (res) { return res.json(); })
      .then(function (rows) {
        if (!Array.isArray(rows)) {
          statusEl.textContent = "Could not load data.";
          return;
        }
        tableBody.innerHTML = "";
        rows.forEach(function (row) {
          const tr = document.createElement("tr");
          tr.innerHTML =
            "<td>" + row.id + "</td>" +
            "<td data-field=\"name\">" + escapeHtml(row.name) + "</td>" +
            "<td data-field=\"phone\">" + escapeHtml(row.phone) + "</td>" +
            "<td data-field=\"major\">" + escapeHtml(row.major) + "</td>" +
            "<td data-field=\"year\">" + escapeHtml(row.year) + "</td>" +
            "<td data-field=\"feedback\">" + escapeHtml(row.feedback || "") + "</td>" +
            "<td><button class=\"admin-action-btn delete\" data-id=\"" + row.id + "\">Delete</button></td>";
          tableBody.appendChild(tr);
        });
        statusEl.textContent = rows.length === 0 ? "No entries yet." : "Loaded " + rows.length + " entries.";
        attachTableHandlers();
      })
      .catch(function () {
        statusEl.textContent = "Server unavailable. Start the Node server and open this page from http://localhost:3000/admin.html";
      });
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function getCellValue(cell) {
    var input = cell.querySelector("input");
    return input ? input.value.trim() : cell.textContent;
  }

  function attachTableHandlers() {
    const table = document.getElementById("students-table");
    const statusEl = document.getElementById("admin-data-status");
    if (!table) return;

    table.addEventListener("click", function (e) {
      if (!e.target.classList.contains("delete")) return;
      var id = e.target.getAttribute("data-id");
      if (!id || !confirm("Delete this entry?")) return;
      var base = getApiBase();
      if (base === null) return;
      fetch(base + "/api/students/" + id, { method: "DELETE" })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data && data.success) {
            statusEl.textContent = "Entry deleted.";
            loadStudents();
          } else {
            statusEl.textContent = "Delete failed.";
          }
        })
        .catch(function () {
          statusEl.textContent = "Server error.";
        });
    });

    table.addEventListener("dblclick", function (e) {
      var cell = e.target.closest("td[data-field]");
      if (!cell) return;
      var row = cell.parentElement;
      var id = row.querySelector("td:first-child").textContent.trim();
      var field = cell.getAttribute("data-field");
      var oldValue = cell.textContent;
      var input = document.createElement("input");
      input.type = "text";
      input.value = oldValue;
      input.style.width = "100%";
      input.style.boxSizing = "border-box";
      cell.textContent = "";
      cell.appendChild(input);
      input.focus();

      function finish(save) {
        var newValue = input.value.trim();
        input.removeEventListener("blur", onBlur);
        input.removeEventListener("keydown", onKey);
        if (!save) {
          cell.textContent = oldValue;
          return;
        }
        var name = getCellValue(row.querySelector('td[data-field="name"]'));
        var phone = getCellValue(row.querySelector('td[data-field="phone"]'));
        var major = getCellValue(row.querySelector('td[data-field="major"]'));
        var year = getCellValue(row.querySelector('td[data-field="year"]'));
        var feedback = getCellValue(row.querySelector('td[data-field="feedback"]'));
        if (field === "name") name = newValue;
        else if (field === "phone") phone = newValue;
        else if (field === "major") major = newValue;
        else if (field === "year") year = newValue;
        else if (field === "feedback") feedback = newValue;

        var base = getApiBase();
        if (base === null) {
          cell.textContent = oldValue;
          return;
        }
        fetch(base + "/api/students/" + id, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name, phone: phone, major: major, year: year, feedback: feedback })
        })
          .then(function (res) { return res.json(); })
          .then(function (data) {
            if (data && !data.error) {
              cell.textContent = newValue;
              statusEl.textContent = "Updated.";
            } else {
              cell.textContent = oldValue;
              statusEl.textContent = "Update failed.";
            }
          })
          .catch(function () {
            cell.textContent = oldValue;
            statusEl.textContent = "Server error.";
          });
      }

      function onBlur() { finish(true); }
      function onKey(ev) {
        if (ev.key === "Enter") finish(true);
        else if (ev.key === "Escape") finish(false);
      }
      input.addEventListener("blur", onBlur);
      input.addEventListener("keydown", onKey);
    });
  }

  if (isAuthenticated()) {
    showDataView();
  } else {
    showLogin();
  }
})();
