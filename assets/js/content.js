const PAPERS_URL = new URL("../data/papers.json", import.meta.url);
const PROJECTS_URL = new URL("../data/projects.json", import.meta.url);

function showError(container, message) {
  container.textContent = "";
  const p = document.createElement("p");
  p.className = "text-sm text-ink/70";
  p.textContent = message;
  container.appendChild(p);
}

export async function fetchPapers() {
  const res = await fetch(PAPERS_URL);
  if (!res.ok) throw new Error(`Failed to load papers (${res.status})`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("Invalid papers data");
  return data;
}

export async function fetchProjects() {
  const res = await fetch(PROJECTS_URL);
  if (!res.ok) throw new Error(`Failed to load projects (${res.status})`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("Invalid projects data");
  return data;
}

function repoLabelFromUrl(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    const path = u.pathname.replace(/\/$/, "") || "";
    return host + path;
  } catch {
    return url;
  }
}

function normalizeProjectLinks(project) {
  const raw = Array.isArray(project.links) ? project.links : [];
  if (raw.length) {
    return raw.map((link) => ({
      url: link.url || "",
      label: (link.label ?? "").trim() || repoLabelFromUrl(link.url || ""),
    }));
  }
  if (project.url) {
    return [
      {
        url: project.url,
        label: project.repoLabel?.trim() || repoLabelFromUrl(project.url),
      },
    ];
  }
  return [];
}

function appendPaperListItem(ul, paper) {
  const li = document.createElement("li");
  const article = document.createElement("article");
  article.className =
    "rounded-xl border border-accent/30 bg-white p-6 shadow-sm transition hover:border-secondary/35";

  const h2 = document.createElement("h2");
  h2.className = "text-lg font-semibold leading-snug text-ink";
  h2.textContent = paper.title ?? "";

  const authorsTrim = (paper.authorsLine ?? "").trim();

  const meta = document.createElement("p");
  meta.className = "mt-2 text-sm text-ink/65";
  meta.textContent = paper.venueLine ?? "";

  const linksRow = document.createElement("p");
  linksRow.className = "mt-4 flex flex-wrap gap-3 text-sm font-semibold";
  const links = Array.isArray(paper.links) ? paper.links : [];
  links.forEach((link) => {
    const a = document.createElement("a");
    a.href = link.url || "#";
    a.className = "text-secondary hover:text-primary";
    a.textContent = link.label ?? "";
    linksRow.appendChild(a);
  });

  article.appendChild(h2);
  if (authorsTrim) {
    const authorsEl = document.createElement("p");
    authorsEl.className = "mt-2 text-sm text-ink/60";
    authorsEl.textContent = authorsTrim;
    article.appendChild(authorsEl);
  }
  article.appendChild(meta);
  if (links.length) article.appendChild(linksRow);
  li.appendChild(article);
  ul.appendChild(li);
}

function appendPaperHomeCard(grid, paper) {
  const article = document.createElement("article");
  article.className =
    "flex flex-col rounded-xl border border-accent/30 bg-white p-6 shadow-sm transition hover:border-secondary/40 hover:shadow-md";

  const h3 = document.createElement("h3");
  h3.className = "text-base font-semibold leading-snug text-ink";
  h3.textContent = paper.title ?? "";

  const authorsTrim = (paper.authorsLine ?? "").trim();

  const meta = document.createElement("p");
  meta.className = "mt-2 text-sm text-ink/60";
  meta.textContent = paper.venueLine ?? "";

  const linksWrap = document.createElement("p");
  linksWrap.className = "mt-auto pt-4";
  const links = Array.isArray(paper.links) ? paper.links : [];
  links.forEach((link, i) => {
    if (i > 0) {
      const sep = document.createElement("span");
      sep.className = "text-ink/40";
      sep.textContent = " · ";
      linksWrap.appendChild(sep);
    }
    const a = document.createElement("a");
    a.href = link.url || "#";
    a.className = "text-sm font-semibold text-secondary";
    a.textContent = link.label ?? "";
    linksWrap.appendChild(a);
  });

  article.appendChild(h3);
  if (authorsTrim) {
    const authorsEl = document.createElement("p");
    authorsEl.className = "mt-2 text-sm text-ink/55";
    authorsEl.textContent = authorsTrim;
    article.appendChild(authorsEl);
  }
  article.appendChild(meta);
  if (links.length) article.appendChild(linksWrap);
  grid.appendChild(article);
}

function appendProjectCard(grid, project, options) {
  const { mode } = options;
  const isHome = mode === "home";
  const links = normalizeProjectLinks(project);

  const article = document.createElement("article");
  article.className = isHome
    ? "flex flex-col rounded-xl border border-accent/30 bg-white p-6 shadow-sm transition hover:border-secondary/40 hover:shadow-md"
    : "flex h-full flex-col rounded-xl border border-accent/30 bg-white p-6 shadow-sm transition hover:border-secondary/35";

  const title = document.createElement(isHome ? "h3" : "h2");
  title.className = isHome
    ? "text-base font-semibold leading-snug text-ink"
    : "text-lg font-semibold leading-snug text-ink";
  title.textContent = project.title ?? "";

  const desc = document.createElement("p");
  desc.className = isHome
    ? "mt-2 flex-1 text-sm leading-relaxed text-ink/70"
    : "mt-2 text-sm leading-relaxed text-ink/70";
  desc.textContent = project.description ?? "";

  article.appendChild(title);
  article.appendChild(desc);

  if (isHome) {
    const linksWrap = document.createElement("p");
    linksWrap.className = "mt-auto pt-4";
    links.forEach((link, i) => {
      if (i > 0) {
        const sep = document.createElement("span");
        sep.className = "text-ink/40";
        sep.textContent = " · ";
        linksWrap.appendChild(sep);
      }
      const a = document.createElement("a");
      a.href = link.url || "#";
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "text-sm font-semibold text-secondary hover:text-primary";
      a.textContent = link.label ?? "";
      linksWrap.appendChild(a);
    });
    if (links.length) article.appendChild(linksWrap);
  } else {
    const linksRow = document.createElement("p");
    linksRow.className =
      "mt-auto flex flex-wrap gap-3 pt-4 text-sm font-semibold";
    links.forEach((link) => {
      const a = document.createElement("a");
      a.href = link.url || "#";
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "text-secondary hover:text-primary";
      a.textContent = link.label ?? "";
      linksRow.appendChild(a);
    });
    if (links.length) article.appendChild(linksRow);
  }

  grid.appendChild(article);
}

export async function initPapersList(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  try {
    const papers = await fetchPapers();
    el.textContent = "";
    papers.forEach((p) => appendPaperListItem(el, p));
  } catch (e) {
    console.error(e);
    showError(el, "Could not load publications.");
  }
}

export async function initHomePapers(selector, limit = 3) {
  const el = document.querySelector(selector);
  if (!el) return;
  try {
    const papers = (await fetchPapers()).slice(0, limit);
    el.textContent = "";
    papers.forEach((p) => appendPaperHomeCard(el, p));
  } catch (e) {
    console.error(e);
    showError(el, "Could not load publications.");
  }
}

export async function initProjectsGrid(selector, options = {}) {
  const { mode = "page" } = options;
  const el = document.querySelector(selector);
  if (!el) return;
  try {
    const projects =
      mode === "home"
        ? (await fetchProjects()).slice(0, options.limit ?? 3)
        : await fetchProjects();
    el.textContent = "";
    projects.forEach((p) => appendProjectCard(el, p, { mode: mode === "home" ? "home" : "page" }));
  } catch (e) {
    console.error(e);
    showError(el, "Could not load projects.");
  }
}
