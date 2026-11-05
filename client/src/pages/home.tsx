import SiteNavigationHeader from "@/components/header";
import FoodCartHeroBanner from "@/components/hero";
import FoodCartSearchAndFilter from "@/components/search-filter";
import IndividualFoodCartCard from "@/components/cart-card";
import CapitalCityFoodCartsAboutSection from "@/components/about";
import FoodCartNewsletterSignup from "@/components/newsletter";
import SiteContactFooter from "@/components/footer";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import type { FoodCart } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { scrollToSectionId } from "@/lib/utils";
import { cartMatchesFilters, effectiveLocationFor as locationForCart } from "@/lib/filters";

const SEARCH_SCROLL_DEBOUNCE_MS = 500;

export default function MadisonFoodCartHomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [glutenFreeOnly, setGlutenFreeOnly] = useState(false);
  const searchScrollTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(searchScrollTimeout.current), []);

  // Scroll only when a search begins — re-scrolling on every keystroke pause
  // yanks the viewport (and on mobile, the input itself) away mid-typing.
  const handleSearchChange = (query: string) => {
    const isStartingSearch = searchQuery.trim() === "" && query.trim() !== "";
    setSearchQuery(query);

    if (!isStartingSearch) return;
    clearTimeout(searchScrollTimeout.current);
    searchScrollTimeout.current = setTimeout(() => {
      scrollToSectionId("carts");
    }, SEARCH_SCROLL_DEBOUNCE_MS);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    scrollToSectionId("carts");
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    scrollToSectionId("carts");
  };

  const handleGlutenFreeChange = (value: boolean) => {
    setGlutenFreeOnly(value);
    scrollToSectionId("carts");
  };

  const { data: carts, isLoading, error } = useQuery<FoodCart[]>({
    queryKey: ["/carts.json"],
  });

  const isSaturday = new Date().getDay() === 6;

  const effectiveLocationFor = (cart: FoodCart) => locationForCart(cart, isSaturday);

  const filteredCarts = (carts?.filter((cart) =>
    cartMatchesFilters(
      cart,
      { searchQuery, selectedCategory, selectedLocation, glutenFreeOnly },
      effectiveLocationFor,
    ),
  ) || []).sort((a, b) => {
    if (a.location === "traveling" && b.location !== "traveling") return 1;
    if (a.location !== "traveling" && b.location === "traveling") return -1;
    return 0;
  });

  return (
    <div className="home-page-container">
      <SiteNavigationHeader />
      <main>
      <FoodCartHeroBanner />
      <div id="carts" className="food-carts-section-wrapper">
        <FoodCartSearchAndFilter
          carts={carts ?? []}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          selectedLocation={selectedLocation}
          onLocationChange={handleLocationChange}
          glutenFreeOnly={glutenFreeOnly}
          onGlutenFreeChange={handleGlutenFreeChange}
          effectiveLocationFor={effectiveLocationFor}
          matchingCartCount={filteredCarts.length}
        />

        <section className="home-carts-section">
        <div className="home-carts-container">
          <div className="home-carts-header">
            <h2 className="home-carts-title">
              Featured Food Carts
            </h2>
            <p className="home-carts-description">
              Each cart brings unique flavors and experiences to Madison's streets. Tap through for menu, hours, and directions.
            </p>
            <p className="home-carts-disclaimer">
              Schedule changes due to weather or unforeseen circumstances may not be accurately reflected
            </p>
          </div>
          
          {error && (
            <div className="home-carts-error">
              <p className="home-carts-error-message">Failed to load food carts. Please try again later.</p>
            </div>
          )}
          
          {isLoading && (
            <div className="home-carts-loading-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="home-cart-skeleton-card">
                  <Skeleton className="home-cart-skeleton-image" />
                  <div className="home-cart-skeleton-content">
                    <Skeleton className="home-cart-skeleton-title" />
                    <Skeleton className="home-cart-skeleton-description" />
                    <Skeleton className="home-cart-skeleton-location" />
                    <div className="home-cart-skeleton-footer">
                      <Skeleton className="home-cart-skeleton-status" />
                      <Skeleton className="home-cart-skeleton-button" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {carts && filteredCarts.length === 0 && !isLoading && (
            <div className="home-carts-empty-state">
              <p className="home-carts-empty-message">
                {searchQuery || selectedCategory !== "all"
                  ? "No food carts match your search criteria."
                  : "No food carts available at the moment."}
              </p>
            </div>
          )}
          
          {carts && filteredCarts.length > 0 && (
            <div className="home-carts-active-grid">
              {filteredCarts.map((cart) => (
                <IndividualFoodCartCard key={cart.id} cart={cart} />
              ))}
            </div>
          )}
        </div>
      </section>
      </div>

      <CapitalCityFoodCartsAboutSection />
      <FoodCartNewsletterSignup />
      </main>
      <SiteContactFooter />
    </div>
  );
}
