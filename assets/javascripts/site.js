(() => {
  const MOBILE_NAVIGATION = "(max-width: 76.234375em)";

  const updateCopyrightYear = () => {
    const currentYear = String(new Date().getFullYear());

    document.querySelectorAll("[data-current-year]").forEach((element) => {
      element.textContent = currentYear;
    });
  };

  const setupNavigationAccordion = () => {
    const mobileNavigation = window.matchMedia(MOBILE_NAVIGATION);
    const controls = [];

    document
      .querySelectorAll(".md-nav--primary .md-nav__toggle:not(#__toc)")
      .forEach((toggle) => {
        const item = toggle.parentElement;
        const trigger = item?.querySelector(`label[for="${toggle.id}"]`);
        const panel = Array.from(item?.children ?? []).find(
          (element) => element.matches("nav.md-nav"),
        );

        if (!trigger || !panel) return;

        const panelId = `${toggle.id}_panel`;
        panel.id = panelId;
        trigger.setAttribute("aria-controls", panelId);
        trigger.setAttribute("role", "button");
        trigger.setAttribute("tabindex", "0");

        const synchronize = () => {
          const expanded = toggle.checked;
          trigger.setAttribute("aria-expanded", String(expanded));
          panel.setAttribute("aria-expanded", String(expanded));

          if (mobileNavigation.matches) {
            panel.hidden = !expanded;
          } else {
            panel.hidden = false;
          }
        };

        trigger.addEventListener("keydown", (event) => {
          if (event.key !== "Enter" && event.key !== " ") return;

          event.preventDefault();
          event.stopPropagation();
          toggle.indeterminate = false;
          toggle.checked = !toggle.checked;
          toggle.dispatchEvent(new Event("change", { bubbles: true }));
        });

        toggle.addEventListener("change", synchronize);
        controls.push(synchronize);
        synchronize();
      });

    mobileNavigation.addEventListener("change", () => {
      controls.forEach((synchronize) => synchronize());
    });

    document
      .querySelectorAll(
        ".md-nav--primary .md-nav__item--active > a.md-nav__link--active",
      )
      .forEach((link) => link.setAttribute("aria-current", "page"));
  };

  const initialize = () => {
    updateCopyrightYear();
    setupNavigationAccordion();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();
