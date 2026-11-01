// COLDY WORLD – simple interactions
// 1. Cart counter (add to cart)
var cartCount = 0;
var countEl = document.getElementById("cart-count");
document.querySelectorAll(".add-to-cart").forEach(function (btn) {
  btn.addEventListener("click", function () {
    cartCount++;
    countEl.textContent = cartCount;
    var old = btn.textContent;
    btn.textContent = "Added!";
    setTimeout(function () { btn.textContent = old; }, 900);
  });
});

// 2. Product filtering, sorting and pagination
var grid = document.getElementById("product-grid");

if (grid) {
  var cards = Array.from(grid.querySelectorAll(".product-card"));
  var original = cards.slice();

  var currentPage = 1;
  var pageSize = 6;

  var pagination = document.getElementById("pagination");

  function update() {
    var cat = document.querySelector('input[name="cat"]:checked').value;

    var ranges = Array.from(document.querySelectorAll(".price-filter:checked"))
      .map(function (c) {
        return c.value.split("-").map(Number);
      });

    var shown = original.filter(function (c) {
      var p = Number(c.dataset.price);
      var okCat = cat === "all" || c.dataset.category === cat;
      var okPrice = ranges.length === 0 ||
        ranges.some(function (r) {
          return p >= r[0] && p <= r[1];
        });

      return okCat && okPrice;
    });

    var sort = document.getElementById("sort").value;

    if (sort === "low") {
      shown.sort(function (a, b) {
        return Number(a.dataset.price) - Number(b.dataset.price);
      });
    }

    if (sort === "high") {
      shown.sort(function (a, b) {
        return Number(b.dataset.price) - Number(a.dataset.price);
      });
    }

    // Calculate pagination
    var totalPages = Math.ceil(shown.length / pageSize);

    if (currentPage > totalPages) {
      currentPage = 1;
    }

    var start = (currentPage - 1) * pageSize;
    var end = start + pageSize;

    var pageProducts = shown.slice(start, end);

    // Hide all products first
    original.forEach(function (c) {
      c.hidden = true;
    });

    // Display products for current page
    pageProducts.forEach(function (c) {
      c.hidden = false;
      grid.appendChild(c);
    });

    // No results message
    document.getElementById("no-results").hidden = shown.length > 0;

    // Update pagination buttons
    if (pagination) {
      pagination.innerHTML = "";

      for (var i = 1; i <= totalPages; i++) {
        var button = document.createElement("button");
        button.type = "button";
        button.textContent = i;
        button.className = i === currentPage ? "active" : "";

        button.addEventListener("click", function (page) {
          return function () {
            currentPage = page;
            update();
          };
        }(i));

        pagination.appendChild(button);
      }
    }
  }

  // Reset to page 1 when filters or sorting change
  document.querySelectorAll('input[name="cat"], .price-filter, #sort')
    .forEach(function (el) {
      el.addEventListener("change", function () {
        currentPage = 1;
        update();
      });
    });

  update();
}

// 3. Contact form validation (contact page only)
var form = document.getElementById("contact-form");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var msg = document.getElementById("form-msg");
    var fields = ["name", "email", "subject", "message"].map(function (id) { return document.getElementById(id); });
    var ok = true;
    fields.forEach(function (f) {
      var bad = f.value.trim() === "";
      f.classList.toggle("invalid", bad);
      if (bad) ok = false;
    });
    var email = document.getElementById("email");
    if (email.value.trim() !== "" && !/^\S+@\S+\.\S+$/.test(email.value)) {
      email.classList.add("invalid"); ok = false;
      msg.className = "form-msg error"; msg.textContent = "Please enter a valid email address."; return;
    }
    if (!ok) { msg.className = "form-msg error"; msg.textContent = "Please fill in all fields."; return; }
    msg.className = "form-msg ok"; msg.textContent = "Thank you! Your message has been sent (demo).";
    form.reset();
  });
}
