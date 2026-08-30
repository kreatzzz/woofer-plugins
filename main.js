// The registry is the single source of truth; both pages render from it.
// The fetch path stays /registry.json — the app's deep-link flow and any
// tooling pin it, so it does not move.
const deep_link = (id) => "woofer://install?plugin=" + encodeURIComponent(id);

function catalog_card(plugin) {
  const size = Math.round(plugin.size / 1024) + " KB";
  const digest = plugin.sha256.slice(0, 16) + "…";
  const capabilities = plugin.capabilities
    .map((capability) => `<span class="chip">${capability.replace("translation-provider:", "")}</span>`)
    .join("");
  const domains = `<span class="chip">${plugin.domains.join(", ")}</span>`;
  const category = plugin.category ? `<span class="chip cat">${plugin.category}</span>` : "";
  return `
    <div class="row">
      <span class="name">${plugin.name}</span>
      <span class="version">v${plugin.version}</span>
      ${category}
      <span class="publisher">by ${plugin.publisher}</span>
    </div>
    <p class="desc">${plugin.description}</p>
    <div>${capabilities}${domains}</div>
    <div class="actions">
      <a class="button" href="${deep_link(plugin.id)}">Open in Woofer</a>
      <a class="button ghost" href="${plugin.wasm}" download>Download .wasm</a>
      <a class="button ghost" href="${plugin.homepage}">Source</a>
      <span class="digest">${size} · sha256 ${digest}</span>
    </div>`;
}

function featured_card(plugin) {
  return `
    <div class="row">
      <span class="name">${plugin.name}</span>
      <span class="version">v${plugin.version}</span>
      <span class="publisher">by ${plugin.publisher}</span>
    </div>
    <p class="desc">${plugin.description}</p>
    <div class="actions">
      <a class="button" href="${deep_link(plugin.id)}">Open in Woofer</a>
      <a class="button ghost" href="${plugin.homepage}">Source</a>
      <span class="note">requires Woofer running</span>
    </div>`;
}

fetch("registry.json")
  .then((response) => response.json())
  .then((catalog) => {
    const updated = document.getElementById("updated");
    if (updated) updated.textContent = "updated " + catalog.updated;

    const catalog_host = document.getElementById("plugins");
    if (catalog_host) {
      catalog_host.textContent = "";
      for (const plugin of catalog.plugins) {
        const card = document.createElement("div");
        card.className = "plugin";
        card.innerHTML = catalog_card(plugin);
        catalog_host.appendChild(card);
      }
    }

    const featured_host = document.getElementById("featured");
    if (featured_host) {
      featured_host.textContent = "";
      for (const plugin of catalog.plugins) {
        const card = document.createElement("div");
        card.className = "plugin";
        card.innerHTML = featured_card(plugin);
        featured_host.appendChild(card);
      }
    }
  })
  .catch(() => {
    for (const id of ["plugins", "featured"]) {
      const host = document.getElementById(id);
      if (host) host.innerHTML = '<p class="desc">The catalog could not be loaded.</p>';
    }
  });
