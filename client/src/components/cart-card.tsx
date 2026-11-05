import { Link } from "wouter";
import { Leaf, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { capitalizeFirst, cardImageSources, isCurrentlyOpen } from "@/lib/utils";
import type { FoodCart } from "@shared/schema";

interface CartCardProps {
  cart: FoodCart;
}

export default function IndividualFoodCartCard({ cart }: CartCardProps) {
  const isOpen = isCurrentlyOpen(cart.schedule);

  return (
    <Card className="food-cart-card">
      <div className="cart-card-image-wrapper">
        <img
          {...cardImageSources(cart.image)}
          sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
          alt={`${cart.name} food cart`}
          className="cart-card-image"
          loading="lazy"
          decoding="async"
          width={800}
          height={368}
        />
        <span className="cart-category-badge">
          {capitalizeFirst(cart.category.replace(/_/g, ' '))}
        </span>
        {cart.glutenFree && (
          <span className="cart-gluten-free-badge">
            <Leaf aria-hidden="true" />
            Gluten Free
          </span>
        )}
      </div>
      <div className="ticket-perf" aria-hidden="true"></div>
      <CardContent className="cart-card-content">
        <div className="cart-card-header">
          <h3 className="cart-card-title">{cart.name}</h3>
        </div>
        <p className="cart-card-description">{cart.description}</p>
        <div className="cart-card-location">
          <MapPin className="cart-location-icon" />
          {(() => {
            const isSaturday = new Date().getDay() === 6;
            const displayName = isSaturday && cart.saturdayLocationDisplayName
              ? cart.saturdayLocationDisplayName
              : cart.locationDisplayName;
            const mapsUrl = isSaturday && cart.saturdayMapsUrl
              ? cart.saturdayMapsUrl
              : cart.mapsUrl;
            return mapsUrl ? (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cart-location-text text-primary hover:text-primary/80 transition-colors hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {displayName}
              </a>
            ) : (
              <span className="cart-location-text">{displayName}</span>
            );
          })()}
        </div>
        <div className="cart-card-footer">
          {cart.location !== "traveling" && (
            <span className={`cart-status ${
              isOpen ? 'cart-status-open' : 'cart-status-closed'
            }`}>
              {isOpen ? 'Open Now' : 'Closed'}
            </span>
          )}
          <Link href={`/cart/${cart.slug}`}>
            <Button className="view-menu-button">
              View Menu
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
