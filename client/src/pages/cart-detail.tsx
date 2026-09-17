import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import SiteNavigationHeader from "@/components/header";
import SiteContactFooter from "@/components/footer";
import { isCurrentlyOpen, capitalizeFirst } from "@/lib/utils";
import { ArrowLeft, MapPin, Clock, Globe, Link2, ShoppingBag, FileText, Monitor } from "lucide-react";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import type { FoodCart, MenuItem } from "@shared/schema";

// Utility function to group menu items by category
function groupMenuByCategory(menu: MenuItem[]): Record<string, MenuItem[]> {
  return menu.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);
}

// Standard menu item component
interface MenuItemProps {
  item: MenuItem;
  index: number;
}

function StandardMenuItem({ item, index }: MenuItemProps) {
  const hasDescription = item.description && item.description.trim().length > 0;
  return (
    <div key={index} className="menu-item">
      <div>
        <div className="menu-item-name">{item.name}</div>
        {hasDescription && <div className="menu-item-desc">{item.description}</div>}
      </div>
      {item.price.trim().length > 0 && <span className="menu-item-price">{item.price}</span>}
    </div>
  );
}

// Dual price menu item component (for items with small/large pricing)
interface DualPriceMenuItemProps {
  item: MenuItem;
  index: number;
  smallPrice: string;
  largePrice: string;
  smallLabel?: string;
  largeLabel?: string;
}

function DualPriceMenuItem({ item, index, smallPrice, largePrice, smallLabel = "Small", largeLabel = "Large" }: DualPriceMenuItemProps) {
  const hasDescription = item.description && item.description.trim().length > 0;
  return (
    <div key={index} className="menu-item">
      <div>
        <div className="menu-item-name">{item.name}</div>
        {hasDescription && <div className="menu-item-desc">{item.description}</div>}
      </div>
      <div className="menu-item-price dual">
        <b>{smallPrice}</b>
        <span>{largeLabel} {largePrice}</span>
      </div>
    </div>
  );
}

function MultiPriceMenuItem({ item, index }: MenuItemProps) {
  const prices = item.price.split(", ");
  const hasDescription = item.description && item.description.trim().length > 0;
  return (
    <div key={index} className="menu-item">
      <div>
        <div className="menu-item-name">{item.name}</div>
        {hasDescription && <div className="menu-item-desc">{item.description}</div>}
      </div>
      <div className="menu-item-price dual uniform">
        {prices.map((p, i) => (
          i === 0 ? <b key={i}>{p.trim()}</b> : <span key={i}>{p.trim()}</span>
        ))}
      </div>
    </div>
  );
}

// Menu category component
interface MenuCategoryProps {
  category: string;
  items: MenuItem[];
  renderItem?: (item: MenuItem, index: number) => React.ReactElement;
}

function MenuCategory({ category, items, renderItem }: MenuCategoryProps) {
  const defaultRenderItem = (item: MenuItem, index: number) => (
    <StandardMenuItem item={item} index={index} key={index} />
  );

  return (
    <div className="menu-category">
      <div className="menu-category-title">{category}</div>
      {items.map(renderItem || defaultRenderItem)}
    </div>
  );
}

// Categorized menu renderer
interface CategorizedMenuProps {
  menu: MenuItem[];
  categoryOrder: string[];
  renderItem?: (item: MenuItem, index: number) => React.ReactElement;
}

function CategorizedMenu({ menu, categoryOrder, renderItem }: CategorizedMenuProps) {
  const groupedMenu = groupMenuByCategory(menu);

  return (
    <>
      {categoryOrder
        .filter(category => groupedMenu[category])
        .map(category => (
          <MenuCategory
            key={category}
            category={category}
            items={groupedMenu[category]}
            renderItem={renderItem}
          />
        ))}
    </>
  );
}

// Menu configuration for special cart-specific rendering
interface MenuConfig {
  type: 'external-link' | 'image' | 'categorized' | 'roost-special' | 'surco-special' | 'china-cottage-special' | 'message-only' | 'default';
  externalUrl?: string;
  externalMessage?: string;
  externalLinkText?: string;
  imageSrc?: string;
  imageAlt?: string;
  categoryOrder?: string[];
}

const MENU_CONFIG: Record<string, MenuConfig> = {
  "sandwich-hub": {
    type: 'external-link',
    externalUrl: 'https://www.sandwichhubmadison.com/menu',
    externalMessage: 'Sandwich Hub has a rotating menu and is subject to change. Please check their website to find the menu of the day!',
    externalLinkText: "View Today's Menu"
  },
  "kona-ice": {
    type: 'image',
    imageSrc: '/konaice-menu_pic.jpg',
    imageAlt: 'Kona Ice Menu'
  },
  "roost": {
    type: 'image',
    imageSrc: '/roost-menu_pic.jpg',
    imageAlt: 'The Roost Fried Chicken Menu'
  },
  "toms_coffee": {
    type: 'image',
    imageSrc: '/toms-menu_pic.jpg',
    imageAlt: "Travelin' Tom's Coffee Menu"
  },
  "cinn-city": {
    type: 'image',
    imageSrc: '/cinncity-menu_pic.jpg',
    imageAlt: 'Cinn City Smash Menu'
  },
  "jolly-frog": {
    type: 'categorized',
    categoryOrder: ["Tacos with Rice & Beans (2 per order)", "Burrito / Bowl (chips on the side)", "Tostadas with Rice (2 per order)", "Build Your Own", "Nachos", "Drinks"]
  },
  "surco": {
    type: 'surco-special',
    categoryOrder: ["Chicken Dishes", "Vegetarian Dishes", "Extras", "Beverages"]
  },
  "falafel": {
    type: 'categorized',
    categoryOrder: ["Main Dishes"]
  },
  "bombay": {
    type: 'categorized',
    categoryOrder: ["Bombay Specialties", "Lentil & Bean Dishes", "Drinks"]
  },
  "crepuw": {
    type: 'categorized',
    categoryOrder: ["Crepes", "Crepe Sushi", "Sauces"]
  },
  "mj-jamaican": {
    type: 'categorized',
    categoryOrder: ["Plates", "Sides"]
  },
  "naan_stop": {
    type: 'categorized',
    categoryOrder: ["Naan Folds", "Sides", "Drinks"]
  },
  "stellies": {
    type: 'categorized',
    categoryOrder: ["Ice Cream"]
  },
  "fresh-cool": {
    type: 'categorized',
    categoryOrder: ["Spring Rolls"]
  },
  "toast": {
    type: 'categorized',
    categoryOrder: ["Classic Paninis"]
  },
  "nani": {
    type: 'message-only',
    externalMessage: "Menu rotates frequently — see the in-person board for the daily menu."
  },
  "nirvana": {
  type: 'image',
  imageSrc: '/nirvana_menu.jpg',
  imageAlt: 'Culinary Nirvana Menu'
  },
  "cookies": {
  type: 'categorized',
  categoryOrder: ["Cookies"]
  },
  "china_cottage": {
    type: 'china-cottage-special',
    categoryOrder: ["Appetizers", "Fried Rice (with peas, carrots, & egg)", "Stir-Fried Noodles (Chicken, Tofu, or Vegetable)", "Lunch Specials (with steamed white rice)", "Beverages"]
  },
  "hibachi_hut": {
    type: 'categorized',
    categoryOrder: ["Hibachi", "Drinks"]
  },
  "bulgogi_korean": {
    type: 'categorized',
    categoryOrder: ["Entrees"]
  },
  "pagoda_smoothies": {
    type: 'categorized',
    categoryOrder: ["Smoothies", "Tapioca Freeze", "Boba Milk Tea (Hot / Cold)", "Flavored Ice Tea (with Jelly / Tapioca)", "Other Drinks", "Toppings"]
  }
};

// Menu content component to handle all menu rendering patterns
interface MenuContentProps {
  cart: FoodCart;
}

function MenuContent({ cart }: MenuContentProps) {
  const config = MENU_CONFIG[cart.slug] || { type: 'default' as const };

  switch (config.type) {
    case 'external-link':
      return (
        <div className="menu-category">
          <p className="menu-external-message">{config.externalMessage}</p>
          <a
            href={config.externalUrl}
            className="menu-external-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {config.externalLinkText}
          </a>
        </div>
      );

    case 'message-only':
      return (
        <div className="menu-category">
          <p className="menu-external-message">{config.externalMessage}</p>
        </div>
      );

    case 'image':
      return (
        <div className="menu-category">
          <img
            src={config.imageSrc}
            alt={config.imageAlt}
            className="menu-image"
          />
        </div>
      );

    case 'roost-special':
      return <RoostMenu cart={cart} />;

    case 'surco-special':
      return <SurcoMenu cart={cart} categoryOrder={config.categoryOrder || []} />;

    case 'china-cottage-special':
      return <ChinaCottageMenu cart={cart} categoryOrder={config.categoryOrder || []} />;

    case 'categorized': {
      const renderItem = cart.slug === 'bombay' || cart.slug === 'bulgogi_korean'
        ? (item: MenuItem, index: number) => <MultiPriceMenuItem key={index} item={item} index={index} />
        : undefined;
      return <CategorizedMenu menu={cart.menu} categoryOrder={config.categoryOrder || []} renderItem={renderItem} />;
    }

    case 'default':
      return (
        <div className="menu-category">
          {cart.menu.map((item, index) => (
            <StandardMenuItem key={index} item={item} index={index} />
          ))}
        </div>
      );
  }
}

// Roost special menu (has custom sections and dual-price items)
function RoostMenu({ cart }: { cart: FoodCart }) {
  const groupedMenu = groupMenuByCategory(cart.menu);
  const chickenCategory = groupedMenu["Chicken Tenders & Sandwiches"] || [];
  const extrasCategory = groupedMenu["Extras"] || [];

  return (
    <>
      <div className="menu-category">
        <div className="menu-category-title">Jumbo 1/4 lb Chicken Tenders</div>
        {chickenCategory.slice(0, 3).map((item, index) => (
          <StandardMenuItem key={index} item={item} index={index} />
        ))}
      </div>

      <div className="menu-category">
        <div className="menu-category-title">Chicken Sandwiches</div>
        {chickenCategory.slice(3, 6).map((item, index) => (
          <StandardMenuItem key={index} item={item} index={index} />
        ))}
      </div>

      <div className="menu-category">
        <div className="menu-category-title">Sides</div>
        {chickenCategory.slice(6, 9).map((item, index) => (
          item.name === "French Fries" ? (
            <DualPriceMenuItem key={index} item={item} index={index} smallPrice="$4.00" largePrice="$6.00" />
          ) : (
            <StandardMenuItem key={index} item={item} index={index} />
          )
        ))}
      </div>

      <div className="menu-category">
        <div className="menu-category-title">Extras</div>
        {extrasCategory.map((item, index) => (
          item.name === "Meal - Substitute lemonade" ? (
            <DualPriceMenuItem key={index} item={item} index={index} smallPrice="$1.00" largePrice="$2.00" />
          ) : (
            <StandardMenuItem key={index} item={item} index={index} />
          )
        ))}
      </div>

      <div className="menu-category">
        <div className="menu-category-title">Spice Level</div>
        <div className="menu-spice-levels">
          <div>1) Extreme</div>
          <div>2) Spicy</div>
          <div>3) Mild</div>
          <div>4) No Spice</div>
          <div>5) Naked</div>
        </div>
      </div>
    </>
  );
}

const CHINA_COTTAGE_DUAL_PRICE_ITEMS = new Set([
  "Fresh Squeezed Lemonade",
  "Fresh Squeezed Orange Juice",
  "Combination (Lemonade + Orange Juice)",
  "Thai Iced Tea (w/ Cream + Sugar)",
  "Thai Iced Coffee (w/ Cream + Sugar)",
]);

function ChinaCottageMenu({ cart, categoryOrder }: { cart: FoodCart; categoryOrder: string[] }) {
  const groupedMenu = groupMenuByCategory(cart.menu);

  return (
    <>
      {categoryOrder.map(category => {
        const items = groupedMenu[category];
        if (!items) return null;

        return (
          <div className="menu-category" key={category}>
            <div className="menu-category-title">{category}</div>
            {items.map((item, index) =>
              CHINA_COTTAGE_DUAL_PRICE_ITEMS.has(item.name) ? (
                <DualPriceMenuItem
                  key={index}
                  item={item}
                  index={index}
                  smallPrice={item.price.split(", ")[0]?.trim() ?? ""}
                  largePrice={item.price.split(", ")[1]?.trim() ?? ""}
                  smallLabel="Medium (16 oz)"
                  largeLabel="Large (20 oz)"
                />
              ) : (
                <StandardMenuItem key={index} item={item} index={index} />
              )
            )}
          </div>
        );
      })}
    </>
  );
}

// Surco special menu (has dual-price item)
function SurcoMenu({ cart, categoryOrder }: { cart: FoodCart; categoryOrder: string[] }) {
  const groupedMenu = groupMenuByCategory(cart.menu);

  return (
    <>
      {categoryOrder.map(category => {
        const items = groupedMenu[category];
        if (!items) return null;

        return (
          <div className="menu-category" key={category}>
            <div className="menu-category-title">{category}</div>
            {items.map((item, index) => (
              item.name === "Cilantro Rice, GF" ? (
                <DualPriceMenuItem key={index} item={item} index={index} smallPrice="$8.00" largePrice="$13.00" />
              ) : (
                <StandardMenuItem key={index} item={item} index={index} />
              )
            ))}
          </div>
        );
      })}
    </>
  );
}

// Schedule block — the ticket stub's "Hours" section, with per-cart custom messages
// for carts whose hours are rotating/off-site rather than a fixed weekly schedule.
interface ScheduleBlockProps {
  cart: FoodCart;
}

function ScheduleBlock({ cart }: ScheduleBlockProps) {
  const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = DAYS_OF_WEEK[new Date().getDay()];

  const ROTATING_SCHEDULE_MESSAGES: Record<string, string> = {
    "kona-ice": "Kona Ice travels to various locations on an alternating schedule.",
    "toms_coffee": "Travelin' Tom's Coffee travels to various locations on an alternating schedule.",
    "nirvana": "Culinary Nirvana does weekly stops at specific locations as well as pop up appearances at community and private events.",
    "cinn-city": "Cinn City Smash does weekly stops at specific locations as well as pop up appearances at community and private events.",
  };

  const rotating = ROTATING_SCHEDULE_MESSAGES[cart.slug];
  if (rotating) {
    return <p className="stub-desc">{rotating}</p>;
  }

  if (cart.slug === "stellies") {
    return <p className="stub-desc">{Object.keys(cart.schedule)[0]}</p>;
  }

  return (
    <div className="stub-schedule">
      {DAYS_OF_WEEK.map((day) => {
        const hours = cart.schedule[day];
        const isClosed = !hours || hours.toLowerCase() === "closed";
        return (
          <div key={day} className={`stub-schedule-row ${day === today ? "today" : ""}`}>
            <span className="stub-schedule-day">{day}</span>
            <span className={`stub-schedule-hours ${isClosed ? "closed" : ""}`}>{hours || "Closed"}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function IndividualFoodCartDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: carts, isLoading, error } = useQuery<FoodCart[]>({
    queryKey: ["/carts.json"],
  });

  const cart = carts?.find(t => t.slug === slug);

  useDocumentMeta({
    title: cart
      ? `${cart.name} | Capital City Food Carts, Madison WI`
      : "Capital City Food Carts | Madison, WI Food Cart Directory",
    description: cart
      ? `${cart.name} at ${cart.locationDisplayName} in Madison, WI. ${cart.description}. See menu, hours, and location.`
      : undefined,
  });

  if (error || (carts && !cart)) {
    return (
      <div className="detail-page-container">
        <SiteNavigationHeader />
        <div className="detail-not-found">
          <h1>Food Cart Not Found</h1>
          <p>The food cart you're looking for doesn't exist.</p>
          <Link href="/">
            <button className="detail-not-found-button">
              <ArrowLeft size={16} />
              Back to Home
            </button>
          </Link>
        </div>
        <SiteContactFooter />
      </div>
    );
  }

  const isSaturday = new Date().getDay() === 6;
  const displayLocation = cart && isSaturday && cart.saturdayLocationDisplayName
    ? cart.saturdayLocationDisplayName
    : cart?.locationDisplayName;
  const displayMapsUrl = cart && isSaturday && cart.saturdayMapsUrl
    ? cart.saturdayMapsUrl
    : cart?.mapsUrl;

  const showBusinessLinks = cart && cart.slug !== "fresh-cool" && cart.slug !== "china_cottage" && cart.slug !== "hibachi_hut";
  const hasBusinessLinks = cart?.businessLinks && (
    cart.businessLinks.website || cart.businessLinks.facebook ||
    cart.businessLinks.instagram || cart.businessLinks.orderOnline
  );

  return (
    <div className="detail-page-container">
      <SiteNavigationHeader />

      <div className="back-bar">
        <div className="wrap">
          <Link href="/">
            <button className="back-link">
              <ArrowLeft size={16} />
              Back to All Carts
            </button>
          </Link>
        </div>
      </div>

      {isLoading && (
        <div className="detail-loading">
          <Skeleton className="detail-loading-hero" />
          <div className="wrap detail-loading-grid">
            <Skeleton className="detail-loading-stub" />
            <Skeleton className="detail-loading-menu" />
          </div>
        </div>
      )}

      {cart && (
        <>
          <section className="detail-hero">
            <img src={cart.image} alt={cart.name} />
            <div className="wrap detail-hero-content">
              <span className={`detail-hero-stamp ${isCurrentlyOpen(cart.schedule) ? "open" : "closed"}`}>
                {isCurrentlyOpen(cart.schedule) ? "Open Now" : "Closed"}
              </span>
              <div className="detail-hero-info">
                <span className="detail-hero-cat">{capitalizeFirst(cart.category.replace(/_/g, ' '))}</span>
                <h1>{cart.name}</h1>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <div className="wrap detail-grid">

              <div className="stub">
                <div className="stub-head">
                  <span>Order Ticket</span>
                </div>
                <div className="ticket-perf"></div>
                <div className="stub-body">

                  <div className="stub-block">
                    <div className="stub-block-label">
                      <FileText size={13} />
                      About
                    </div>
                    <p className="stub-desc">{cart.description}</p>
                  </div>

                  <div className="stub-block">
                    <div className="stub-block-label">
                      <MapPin size={13} />
                      Location
                    </div>
                    <div className="stub-location">
                      {displayMapsUrl ? (
                        <a href={displayMapsUrl} target="_blank" rel="noopener noreferrer">
                          {displayLocation}
                        </a>
                      ) : (
                        <span>{displayLocation}</span>
                      )}
                    </div>
                  </div>

                  <div className="stub-block">
                    <div className="stub-block-label">
                      <Clock size={13} />
                      Hours
                    </div>
                    <ScheduleBlock cart={cart} />
                  </div>

                  {showBusinessLinks && hasBusinessLinks && (
                    <div className="stub-block">
                      <div className="stub-block-label">
                        <Monitor size={13} />
                        Find Them Online
                      </div>
                      <div className="stub-links">
                        {cart.businessLinks?.website && (
                          <a className="stub-link" href={cart.businessLinks.website} target="_blank" rel="noopener noreferrer">
                            <Globe size={15} />
                            Website
                          </a>
                        )}
                        {cart.businessLinks?.facebook && (
                          <a className="stub-link" href={cart.businessLinks.facebook} target="_blank" rel="noopener noreferrer">
                            <Link2 size={15} />
                            Facebook
                          </a>
                        )}
                        {cart.businessLinks?.instagram && (
                          <a className="stub-link" href={cart.businessLinks.instagram} target="_blank" rel="noopener noreferrer">
                            <Link2 size={15} />
                            Instagram
                          </a>
                        )}
                        {cart.businessLinks?.orderOnline && (
                          <a className="stub-link" href={cart.businessLinks.orderOnline} target="_blank" rel="noopener noreferrer">
                            <ShoppingBag size={15} />
                            Order Online
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </div>

              <div className="menu-ticket">
                <div className="menu-ticket-head">
                  <div className="kicker">Full Menu</div>
                  <h2>{cart.name}</h2>
                </div>
                <div className="ticket-perf" style={{ marginTop: "1.4rem" }}></div>
                <div className="menu-ticket-body">
                  <MenuContent cart={cart} />
                </div>
              </div>

            </div>
          </section>
        </>
      )}

      <SiteContactFooter />
    </div>
  );
}
