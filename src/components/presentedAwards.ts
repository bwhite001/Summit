import { HasPropAtPath } from "@/helpers";
import { fetchAchievements } from "@/services";
import { TerrainAchievements } from "@/types/terrainTypes";
import { Route } from "vue-router";

export async function CheckAward(params: { name: string; path?: string; value?: string | number | boolean; parent?: JQuery<HTMLElement>; awardsPrefetched?: TerrainAchievements[] }) {
  const awards = params.awardsPrefetched ?? (await fetchAchievements(params.name));
  let presented = false;
  if (!awards) return;
  for (const award of awards) {
    if (params.path && HasPropAtPath(award, params.path, params.value)) continue;
    if (!window.$nuxt.$store.state.Summit.presentedAwards.includes(award.id)) continue;
    presented = true;
    break;
  }
  if (presented) {
    const ListItemStatus = params.parent ? params.parent.find(".ListItem__status-col").first() : $("span.v-chip__content:contains(Awarded)").parent().parent();
    const PresentedListItemStatus = ListItemStatus.clone();
    PresentedListItemStatus.addClass("presentedAwardListItem");
    ListItemStatus.after(PresentedListItemStatus);
    PresentedListItemStatus.find("span.v-chip__content").addClass("presentedAward").text("Presented ✅").css("color", "white").parent().css("background", "green");
    ListItemStatus.siblings(".ListItem__action-btn-col").remove();
  }
}

export function AwardObserverRouter(watchElement: JQuery<HTMLElement>, removeElement: string, currentRoute: Route, pageChecks: (to: Route) => void) {
  if (watchElement.length === 0 || watchElement[0].id === "awardObserver") return;
  watchElement[0].id = "awardObserver";
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      $(removeElement).remove();
      pageChecks(currentRoute);
    });
  });
  observer.observe(watchElement[0], { attributes: true, childList: true, subtree: true });
}
