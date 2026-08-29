fetch("registry.json")
  .then((response) => response.json())
  .then((catalog) => {
    document.getElementById("updated").textContent = "updated " + catalog.updated;
    const host = document.getElementById("plugins");
    host.textContent = "";
    for (const plugin of catalog.plugins) {
      const card = document.createElement("div");
      card.className = "plugin";
      const size = Math.round(plugin.size / 1024) + " KB";
      const digest = plugin.sha256.slice(0, 16) + "…";
      const capabilities = plugin.capabilities
        .map((capability) => `<span class="chip">${capability.replace("translation-provider:", "")}</span>`)
        .join("");
      const domains = `<span class="chip">${plugin.domains.join(", ")}</span>`;
      card.innerHTML = `
        <div class="row">
          <span class="name">${plugin.name}</span>
          <span class="version">v${plugin.version}</span>
          <span class="publisher">by ${plugin.publisher}</span>
        </div>
        <p class="desc">${plugin.description}</p>
        <div>${capabilities}${domains}</div>
        <div class="actions">
          <a class="button" href="${plugin.wasm}" download>Download .wasm</a>
          <a class="button ghost" href="${plugin.homepage}">Source</a>
          <span class="digest">${size} · sha256 ${digest}</span>
        </div>`;
      host.appendChild(card);
    }
  })
  .catch(() => {
    document.getElementById("plugins").innerHTML =
      '<p class="desc">The catalog could not be loaded.</p>';
  });
