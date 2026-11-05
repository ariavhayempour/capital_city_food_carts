import { useQuery } from "@tanstack/react-query";
import type { FoodCart } from "@shared/schema";

const CUISINE_LABELS: Record<string, string> = {
  american: "American",
  asian: "Asian",
  caribbean: "Caribbean",
  mexican: "Mexican",
  middle_eastern: "Middle Eastern",
  sandwiches: "Sandwiches",
  south_american: "South American",
  south_asian: "South Asian",
  sweet_treats: "Sweet Treats",
  drinks: "Drinks",
};

export default function FoodCartHeroBanner() {
  const { data: carts } = useQuery<FoodCart[]>({
    queryKey: ["/carts.json"],
  });

  const marqueeCarts = carts ?? [];

  return (
    <section id="home" className="hero-section">
      <div className="hero-bg">
        {/* Preloaded from index.html with the same srcset/sizes so this request is reused. */}
        <img
          src="/capitol-state-street-1600.webp"
          srcSet="/capitol-state-street-960.webp 960w, /capitol-state-street-1600.webp 1600w"
          sizes="100vw"
          alt="State Street looking toward the Wisconsin State Capitol in Madison"
          fetchPriority="high"
          decoding="async"
          width={1600}
          height={968}
        />
      </div>

      <div className="hero-content-container">
        <h1 className="hero-main-title">
          Best <em>Capital City.</em> <br />Tastiest <em>Food Carts.</em>
        </h1>
        <p className="hero-description">
          Every cart on State Street, by the Capitol, and beyond. Real hours, real menus, real good food. All in one convenient place.
        </p>
      </div>

      <span className="hero-photo-credit">State Street &amp; the Capitol</span>

      {marqueeCarts.length > 0 && (
        <div className="hero-marquee-ghost" role="presentation">
          <div className="hero-marquee-track">
            {[0, 1].map((copy) => (
              <ul className="hero-marquee-set" key={copy} aria-hidden={copy === 1}>
                {marqueeCarts.map((cart, i) => (
                  <li className="hero-marquee-item" key={`${copy}-${cart.id ?? i}`}>
                    <span className="hero-marquee-name">{cart.name}</span>
                    <span className="hero-marquee-cuisine">
                      {CUISINE_LABELS[cart.category] ?? cart.category}
                    </span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
