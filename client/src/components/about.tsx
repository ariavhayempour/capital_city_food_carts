import { useQuery } from "@tanstack/react-query";
import type { FoodCart } from "@shared/schema";

export default function CapitalCityFoodCartsAboutSection() {
  const { data: carts } = useQuery<FoodCart[]>({
    queryKey: ["/carts.json"],
  });

  const cartCount = carts?.length;
  const zoneCount = carts
    ? new Set(carts.map((c) => c.location).filter((l) => l !== "TBD")).size
    : undefined;

  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <div className="about-content-grid">
          <div className="about-text-content">
            <div className="kicker">Story</div>
            <h2 className="about-section-title">
              Built by a student who got tired of guessing.
            </h2>
            <p className="about-description-first">
              Capital City Food Carts started with one simple problem: no single place tracked what was actually open. I built the map, the hours, and the menus — so you don't have to check ten different Instagram bios before lunch.
            </p>
            <p className="about-description-second">
              Carts move depending on the day. Some go to Capitol Square, some go traveling. That's tracked too.
            </p>
            <div className="about-stats-container">
              <div className="food-carts-stat">
                <p className="food-carts-stat-number">{cartCount ?? "—"}</p>
                <p className="food-carts-stat-label">Carts Added</p>
              </div>
              <div className="locations-stat">
                <p className="locations-stat-number">{zoneCount ?? "—"}</p>
                <p className="locations-stat-label">Madison Areas</p>
              </div>
            </div>
          </div>
          <div className="about-image-container">
            <img
              src="/capitol-state-street-960.webp"
              srcSet="/capitol-state-street-960.webp 960w, /capitol-state-street-1600.webp 1600w"
              sizes="(min-width: 1024px) 50vw, 100vw"
              alt="Madison Wisconsin Capitol building at the end of State Street"
              className="about-hero-image"
              loading="lazy"
              decoding="async"
              width={1600}
              height={968}
            />
            <span className="about-image-tag">📍 Madison, Wisconsin</span>
          </div>
        </div>
      </div>
    </section>
  );
}
