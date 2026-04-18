import { initHomePapers, initProjectsGrid } from "./content.js";

initHomePapers("#home-papers-grid", 3);
initProjectsGrid("#home-projects-grid", { mode: "home", limit: 3 });
