// ---------- Plain JavaScript interaction (Index page) ----------
(function () {
  const btn = document.getElementById("pickGuardianBtn");
  const box = document.querySelector(".feature-result");

  if (btn && box) {
    const guardians = [
      { name: "Azure Dragon", vibe: "East • Spring • Wood", signal: "Growth, renewal, and storm control." },
      { name: "Vermilion Bird", vibe: "South • Summer • Fire", signal: "Vitality, ceremony, and rising energy." },
      { name: "White Tiger", vibe: "West • Autumn • Metal", signal: "Justice, courage, and disciplined protection." },
      { name: "Black Tortoise", vibe: "North • Winter • Water", signal: "Endurance, wisdom, and resilience." }
    ];

    btn.addEventListener("click", () => {
      const pick = guardians[Math.floor(Math.random() * guardians.length)];
      box.innerHTML = `
        <h3>${pick.name}</h3>
        <p class="small">${pick.vibe}</p>
        <p>${pick.signal}</p>
      `;
    });
  }
})();

// ---------- jQuery interaction (Animation page filter) ----------
(function () {
  if (typeof window.jQuery === "undefined") return;

  const $buttons = $(".chip-btn");
  const $cards = $(".beast");

  $buttons.on("click", function () {
    $buttons.removeClass("is-on");
    $(this).addClass("is-on");

    const filter = $(this).data("filter");

    if (filter === "all") {
      $cards.removeClass("is-hidden");
      return;
    }

    $cards.each(function () {
      const dir = $(this).data("direction");
      $(this).toggleClass("is-hidden", dir !== filter);
    });
  });
})();
