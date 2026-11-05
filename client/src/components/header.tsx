import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { scrollToSectionId } from "@/lib/utils";

export default function SiteNavigationHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToSection = (sectionId: string) => {
    // If we're not on the homepage, navigate there first with hash
    if (location !== '/') {
      setLocation(`/#${sectionId}`);
      return;
    }

    // If we're on the homepage, scroll to the section
    scrollToSectionId(sectionId);
    setIsMobileMenuOpen(false);
  };

  // Handle scrolling when page loads with a hash
  useEffect(() => {
    const hash = window.location.hash.slice(1); // Remove the # character
    if (hash && location === '/') {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        scrollToSectionId(hash);
      }, 100);
    }
  }, [location]);

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="header-content">
          <div className="brand-logo-section">
            <Link href="/">
              <div className="brand-logo-link">
                <h1 className="brand-logo-text">
                  Capital City Food Carts
                </h1>
              </div>
            </Link>
          </div>

          <nav className="desktop-navigation">
            <div className="desktop-nav-links">
              <Link href="/">
                {/* home */}
                <button
                  className="home-nav-button"
                  onClick={() => scrollToSection('home')}
                  >
                  Home
                </button>
              </Link>
              {/* carts */}
              <button
                className="food-carts-nav-button"
                onClick={() => scrollToSection('carts')}
              >
                Food Carts
              </button>
              {/* about */}
              <button
                className="about-nav-button"
                onClick={() => scrollToSection('about')}
              >
                About
              </button>
              {/* contact */}
              <button
                className="contact-nav-button"
                onClick={() => scrollToSection('contact')}
              >
                Contact
              </button>
            </div>
          </nav>

          <div className="mobile-menu-section">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="mobile-menu-toggle"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-dropdown-menu"
            >
              {isMobileMenuOpen ? <X className="mobile-menu-close-icon" /> : <Menu className="mobile-menu-open-icon" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div id="mobile-dropdown-menu" className="mobile-dropdown-menu">
          <div className="mobile-menu-container">
            <button className="mobile-home-button" onClick={() => { setIsMobileMenuOpen(false); scrollToSection('home'); }}>
              Home
            </button>
            <button className="mobile-food-carts-button" onClick={() => scrollToSection('carts')}>
              Food Carts
            </button>
            <button className="mobile-about-button" onClick={() => scrollToSection('about')}>
              About
            </button>
            <button className="mobile-contact-button" onClick={() => scrollToSection('contact')}>
              Contact
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
