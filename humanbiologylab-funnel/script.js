"use strict";

const conceptSummaries = [
  [
    "01",
    "Metabolic flexibility",
    "Why your body switches between stored and available energy."
  ],
  [
    "02",
    "Insulin signalling",
    "How cells respond to fuel—and what resistance actually means."
  ],
  [
    "03",
    "AMPK",
    "The cellular signal that responds when energy availability runs low."
  ],
  [
    "04",
    "Mitochondria",
    "How cells convert fuel into usable energy."
  ],
  [
    "05",
    "NAD+",
    "Why this coenzyme matters for energy transfer and cellular repair."
  ],
  [
    "06",
    "Autophagy",
    "The regulated recycling process cells use to clear damaged material."
  ],
  [
    "07",
    "Circadian biology",
    "How timing coordinates metabolism, repair, and sleep."
  ],
  [
    "08",
    "Collagen turnover",
    "Why skin structure changes with age and environmental exposure."
  ],
  [
    "09",
    "Hair-growth cycles",
    "The biology behind growth, transition, rest, and shedding."
  ],
  [
    "10",
    "Biological ageing",
    "How accumulated cellular changes shape function over time."
  ]
];

const guideConcepts = [
  {
    number: "01",
    title: "Metabolic flexibility",
    body:
      "Your body continuously chooses among fuels. Metabolic flexibility describes how effectively it shifts between carbohydrate and fat oxidation as availability and demand change.",
    lens:
      "Useful lens: sleep, movement, muscle mass, meal composition, and energy balance all influence this system."
  },
  {
    number: "02",
    title: "Insulin signalling",
    body:
      "Insulin helps cells respond to circulating glucose and coordinates storage. Insulin resistance means that some tissues need a stronger signal to produce the same response.",
    lens:
      "Useful lens: resistance is a system-level adaptation—not a simple verdict about one food."
  },
  {
    number: "03",
    title: "AMPK",
    body:
      "AMP-activated protein kinase senses low cellular energy. When activated, it helps cells prioritize energy production over energy-consuming growth processes.",
    lens:
      "Useful lens: exercise is one well-studied context in which AMPK activity changes."
  },
  {
    number: "04",
    title: "Mitochondria",
    body:
      "Mitochondria convert energy from nutrients into ATP, the form cells can readily use. Their function adapts to demand and differs across tissues.",
    lens:
      "Useful lens: more mitochondria is not the whole story; quality, turnover, and context matter."
  },
  {
    number: "05",
    title: "NAD+",
    body:
      "NAD+ transfers electrons during energy metabolism and participates in cellular signalling and repair. Levels and recycling vary by tissue, age, and metabolic state.",
    lens:
      "Useful lens: biological importance does not automatically validate every supplement claim."
  },
  {
    number: "06",
    title: "Autophagy",
    body:
      "Autophagy is a regulated cellular recycling system. Cells use it to break down selected components and recover useful building blocks.",
    lens:
      "Useful lens: it is always occurring at different rates—not a switch that only turns on during fasting."
  },
  {
    number: "07",
    title: "Circadian biology",
    body:
      "Internal clocks coordinate daily rhythms in hormones, temperature, digestion, alertness, and repair. Light is the strongest timing signal for the central clock.",
    lens:
      "Useful lens: consistency and light timing often matter before optimization tactics."
  },
  {
    number: "08",
    title: "Collagen turnover",
    body:
      "Collagen gives skin much of its tensile structure. Production, breakdown, sun exposure, hormones, nutrition, and age all shape the net result.",
    lens:
      "Useful lens: visible change reflects long-term turnover, not instant replacement."
  },
  {
    number: "09",
    title: "Hair-growth cycles",
    body:
      "Follicles move through growth, transition, rest, and shedding phases. Different follicles cycle independently, which is why shedding and regrowth can overlap.",
    lens:
      "Useful lens: pattern, duration, and context matter more than a single day of shedding."
  },
  {
    number: "10",
    title: "Biological ageing",
    body:
      "Ageing reflects interacting changes in repair, signalling, cellular identity, inflammation, and tissue resilience. No single pathway explains the whole process.",
    lens:
      "Useful lens: strong evidence usually supports systems and behaviours more than one magic molecule."
  }
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function renderConcepts() {
  const conceptGrid = document.querySelector("#concept-grid");
  const guideList = document.querySelector("#guide-list");

  conceptGrid.replaceChildren(
    ...conceptSummaries.map(([number, title, description]) => {
      const article = document.createElement("article");
      article.className = "concept-card";

      const numberElement = document.createElement("span");
      numberElement.textContent = number;

      const content = document.createElement("div");
      const heading = document.createElement("h3");
      const paragraph = document.createElement("p");

      heading.textContent = title;
      paragraph.textContent = description;
      content.append(heading, paragraph);
      article.append(numberElement, content);

      return article;
    })
  );

  guideList.replaceChildren(
    ...guideConcepts.map(({ number, title, body, lens }) => {
      const article = document.createElement("article");

      const numberElement = document.createElement("span");
      numberElement.className = "guide-num";
      numberElement.textContent = number;

      const content = document.createElement("div");
      const heading = document.createElement("h2");
      const bodyElement = document.createElement("p");
      const lensElement = document.createElement("p");

      heading.textContent = title;
      bodyElement.textContent = body;
      lensElement.className = "useful-lens";
      lensElement.textContent = lens;

      content.append(heading, bodyElement, lensElement);
      article.append(numberElement, content);

      return article;
    })
  );
}

function getTrackingParameters() {
  const parameters = new URLSearchParams(window.location.search);

  return {
    source: parameters.get("utm_source") || "direct",
    medium: parameters.get("utm_medium") || "none",
    campaign: parameters.get("utm_campaign") || "starter-guide",
    content: parameters.get("utm_content") || "unknown"
  };
}

function setFormError(form, message) {
  const error = form.querySelector(".form-error");
  const emailInput = form.elements.email;

  error.textContent = message;
  error.hidden = !message;
  emailInput.setAttribute("aria-invalid", message ? "true" : "false");
}

function setLoading(form, loading) {
  const button = form.querySelector('button[type="submit"]');
  const label = button.querySelector(".button-label");

  button.disabled = loading;
  label.textContent = loading ? "Preparing…" : "Get the free guide";
}

function showSuccess(form) {
  const success = document.createElement("div");
  success.className = "form-success";
  success.setAttribute("role", "status");

  const icon = document.createElement("span");
  icon.className = "form-success-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "✓";

  const content = document.createElement("div");
  const heading = document.createElement("strong");
  const message = document.createElement("span");

  heading.textContent = "Your guide is ready.";
  message.textContent = "Opening it now…";

  content.append(heading, message);
  success.append(icon, content);
  form.replaceWith(success);
}

async function submitLead(form) {
  const formData = new FormData(form);
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const consent = formData.get("consent") === "on";
  const company = String(formData.get("company") || "").trim();

  setFormError(form, "");

  if (!emailPattern.test(email)) {
    setFormError(form, "Enter a valid email address.");
    form.elements.email.focus();
    return;
  }

  if (!consent) {
    setFormError(
      form,
      "Please agree to receive the guide and educational emails."
    );
    form.elements.consent.focus();
    return;
  }

  setLoading(form, true);

  try {
    const response = await fetch("/api/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        consent,
        company,
        placement: form.dataset.placement || "unknown",
        ...getTrackingParameters()
      })
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.error || "Please try again.");
    }

    showSuccess(form);

    window.setTimeout(() => {
      window.location.hash = result.guideUrl || "#starter-guide";
    }, 650);
  } catch (error) {
    setLoading(form, false);
    setFormError(
      form,
      error instanceof Error
        ? error.message
        : "We couldn't save your request. Please try again."
    );
  }
}

function configureForms() {
  document.querySelectorAll(".lead-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submitLead(form);
    });
  });
}

function route() {
  const landing = document.querySelector("#landing-view");
  const guide = document.querySelector("#guide-view");
  const privacy = document.querySelector("#privacy-view");
  const routeName = window.location.hash.toLowerCase();

  const showGuide =
    routeName === "#starter-guide" ||
    routeName === "#guide-content";

  const showPrivacy = routeName === "#privacy";

  landing.hidden = showGuide || showPrivacy;
  guide.hidden = !showGuide;
  privacy.hidden = !showPrivacy;

  document.body.classList.toggle("guide-open", showGuide);
  document.body.classList.toggle("privacy-open", showPrivacy);

  if (showGuide) {
    document.title = "The Human Biology Starter Guide — HumanBiologyLab";
  } else if (showPrivacy) {
    document.title = "Privacy — HumanBiologyLab";
  } else {
    document.title = "HumanBiologyLab — Understand Your Biology";
  }

  if (showGuide || showPrivacy) {
    window.scrollTo({ top: 0, behavior: "instant" });
  }
}

renderConcepts();
configureForms();
route();

window.addEventListener("hashchange", route);