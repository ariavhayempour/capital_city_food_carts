import type { FoodCart, InsertFoodCart } from "@shared/schema";

export interface IStorage {
  getFoodCarts(): Promise<FoodCart[]>;
  getFoodCartBySlug(slug: string): Promise<FoodCart | undefined>;
  createFoodCart(cart: InsertFoodCart): Promise<FoodCart>;
  searchFoodCarts(query: string): Promise<FoodCart[]>;
  filterFoodCartsByCategory(category: string): Promise<FoodCart[]>;
}

export class MemStorage implements IStorage {
  private carts: Map<number, FoodCart>;
  private currentId: number;

  constructor() {
    this.carts = new Map();
    this.currentId = 1;
    this.seedData();
  }

  private seedData() {
    const sampleCarts: InsertFoodCart[] = [
      {
        // Fresh cool drinks
        slug: "fresh-cool",
        name: "Fresh Cool Drinks",
        description: "Cold smoothies and authentic spring rolls",
        image: "https://badgerherald.com/wp-content/uploads/2024/03/BMW_7422-Enhanced-NR-scaled-1-1200x801.jpg",
        category: "asian",
        location: "state-street-library-mall",
        locationDisplayName: "State Street & Library Mall",
        mapsUrl: "https://maps.google.com/?q=43.075000,-89.398361",
        saturdayLocation: "capitol-square",
        saturdayLocationDisplayName: "Dane County Farmers' Market",
        saturdayMapsUrl: "https://maps.google.com/?q=Capitol+Square+Madison+WI",
        businessLinks: {},
        menu: [
          { name: "Avocado", price: "$6.00", description: "Lettuce, cucumber, carrot, cabbage, rice noodles, peanut sauce.", category: "Spring Rolls" },
          { name: "Avocado Chicken", price: "$7.00", description: "Chicken, lettuce, cucumber, carrot, cabbage, rice noodles, peanut sauce.", category: "Spring Rolls" },
          { name: "Avocado Tofu", price: "$7.00", description: "Tofu, lettuce, cucumber, carrot, cabbage, rice noodles, peanut sauce.", category: "Spring Rolls" },
          { name: "Avocado Shrimp", price: "$7.00", description: "Shrimp, lettuce, cucumber, carrot, cabbage, rice noodles, peanut sauce.", category: "Spring Rolls" },
          { name: "Avocado BBQ Pork", price: "$7.00", description: "BBQ pork, lettuce, cucumber, carrot, cabbage, rice noodles, peanut sauce.", category: "Spring Rolls" },
          { name: "Avocado Beef", price: "$7.00", description: "Beef, lettuce, cucumber, carrot, cabbage, rice noodles, peanut sauce.", category: "Spring Rolls" },
          { name: "Salad Bowl", price: "$8.00", description: "Lettuce, cucumber, carrot, cabbage, rice noodles, peanut sauce, avocado, choice of protein (chicken, tofu, shrimp, BBQ pork, beef).", category: "Spring Rolls" }
        ],
        schedule: {
          "Monday": "10:00 am - 6:00 pm",
          "Tuesday": "10:00 am - 6:00 pm",
          "Wednesday": "10:00 am - 6:00 pm",
          "Thursday": "10:00 am - 6:00 pm",
          "Friday": "10:00 am - 6:00 pm",
          "Saturday": "8:30 am - 1:00 pm",
          "Sunday": "Closed"
        }
      },

      // Toast
      {
        slug: "toast",
        name: "Toast",
        description: "Made-to-order paninis with homemade sauces",
        image: "https://www.toastmadison.com/wp-content/themes/gili/images/toast-madison-with-bucky.jpg",
        category: "sandwiches",
        location: "state-street-library-mall",
        locationDisplayName: "State Street & Library Mall",
        mapsUrl: "https://maps.google.com/?q=43.075000,-89.398361",
        businessLinks: {
          website: "https://toastmadison.com",
          instagram: "https://www.instagram.com/toastmadison?igsh=bDRmNjJzZm5sdWIy",
          facebook: "https://www.facebook.com/toastmadison?mibextid=wwXIfr"
        },
        menu: [
          { name: "Turkey", price: "$11.00", description: "Honey-smoked turkey, pesto, garlic mayo, provolone, tomatoes, red onions, black olives, spinach.", category: "Classic Paninis" },
          { name: "Italian Mixed Meat", price: "$11.00", description: "Pastrami, ham, garlic mayo, sriracha, provolone, tomatoes, black & green olives.", category: "Classic Paninis" },
          { name: "Pollo", price: "$11.00", description: "Smoked chicken, pesto, garlic mayo, mozzarella, tomaotes, spinach.", category: "Classic Paninis" },
          { name: "Club", price: "$11.00", description: "Ham, honey-smoked turkey, spicy brown mustard, BBQ sauce, provolone, tomatoes, red onions & spinach.", category: "Classic Paninis" },
          { name: "Spicy", price: "$11.00", description: "Ham, pastrami, garlic mayo, spicy brown mustard, sriracha, provolone, tomatoes, red onions, black olives, hot giardiniera.", category: "Classic Paninis" },
          { name: "Chicken", price: "$11.00", description: "Smoked chicken, BBQ sauce, red bell, mayo, cheddar, tomatoes, red onions.", category: "Classic Paninis" },
          { name: "Cuban", price: "$11.00", description: "Ham, garlic mayo, spicy brown mustard, provolone, tomatoes, pickles.", category: "Classic Paninis" },
          { name: "Bacon & Egg", price: "$11.00", description: "Bacon, homemade omelette, garlic mayo, sriracha, mozzarella, tomatoes, red onions, spinach.", category: "Classic Paninis" },
          { name: "Veggie", price: "$11.00", description: "Provolone & mozzarella cheeses, pesto, garlic mayo, red bell mayo, tomatoes, red onions, black & green olives, spinach.", category: "Classic Paninis" },
          { name: "Classic Pesto", price: "$11.00", description: "Pesto, garlic mayo, mozzarella cheese, tomatoes, spinach.", category: "Classic Paninis" },
          { name: "Grilled Cheese", price: "$11.00", description: "Cheddar cheese on a French roll.", category: "Classic Paninis" },
        ],
        schedule: {
          "Monday": "11:00 am - 4:00 pm",
          "Tuesday": "11:00 am - 4:00 pm",
          "Wednesday": "11:00 am - 4:00 pm",
          "Thursday": "11:00 am - 4:00 pm",
          "Friday": "11:00 am - 4:00 pm",
          "Saturday": "11:00 am - 4:00 pm",
          "Sunday": "11:00 am - 4:00 pm"
        }
      },

      // Sandwich Hub
      {
        slug: "sandwich-hub",
        name: "Sandwich Hub",
        description: "Sandwich pop-up food cart with in-house daily baked bread",
        image: "https://bloximages.chicago2.vip.townnews.com/captimes.com/content/tncms/assets/v3/editorial/2/b2/2b236bbb-3e8a-5bdf-835e-ef9a2ac09809/669806c2aa375.image.jpg?resize=1396%2C930",
        category: "sandwiches",
        location: "state-street-library-mall",
        locationDisplayName: "State Street & Library Mall",
        mapsUrl: "https://maps.google.com/?q=43.075000,-89.398361",
        businessLinks: {
          website: "https://www.sandwichhubmadison.com",
          instagram: "https://www.instagram.com/sandwich.hub.madison?igsh=cWFsdmVkMHBqenM4",
        },
        menu: [
          
        ],
        schedule: {
          "Monday": "11:00 am - 2:00 pm",
          "Tuesday": "11:00 am - 2:00 pm",
          "Wednesday": "11:00 am - 2:00 pm",
          "Thursday": "11:00 AM - 2:00 PM",
          "Friday": "11:00 AM - 2:00 PM",
          "Saturday": "Closed",
          "Sunday": "Closed"
        }
      },
      
      // Surco Food Cart
      {
        slug: "surco",
        name: "Surco Food Cart",
        description: "A flavorful twist on classic Peruvian dishes",
        image: "https://bloximages.chicago2.vip.townnews.com/wiscnews.com/content/tncms/assets/v3/editorial/8/01/8012f089-6556-50d8-8dc0-847ada21877a/6719d0d705f72.image.jpg?crop=1920%2C1008%2C0%2C35&resize=1200%2C630&order=crop%2Cresize",
        category: "south_american",
        location: "state-street-library-mall",
        locationDisplayName: "State Street & Library Mall",
        mapsUrl: "https://maps.google.com/?q=43.075000,-89.398361",
        businessLinks: {
          website: "https://www.surcocart.com",
          facebook: "https://www.facebook.com/SurcoCart/",
          instagram: "https://www.instagram.com/surcocart?utm_source=ig_web_button_share_sheet&igsh=MThpNXhnaTk4eWFhYw==",
        },
        menu: [
          { name: "Arroz Con Pollo (Chicken & Rice), GF", price: "$13.00", description: "Aromatic Jasmine rice bursting with fresh cilantro, grilled chicken, cabbage, and organic spring mix with homemade passion fruit dressing.", category: "Chicken Dishes" },
          { name: "Aji de Gallina (Chili Chicken), Mild", price: "$13.00", description: "Shredded chicken in creamy sauce with a mild kick of yellow chili pepper, jasmine rice, boiled potatoes, hard boiled egg, cabbage, and organic spring mix with homemade passion fruit dressing.", category: "Chicken Dishes" },
          { name: "Chicken Adobo, GF", price: "$13.00", description: "Pan-seared chicken strips in a tangy adobo sauce, brown lentils, jasmine rice, cabbage, and organic spring mix with passion fruit dressing.", category: "Chicken Dishes" },
          { name: "Pastel De Papa (Scalloped Potatoes)", price: "$13.00", description: "Golden-baked potatoes slices layered with cheese, grilled chicken, cabbage, and organic spring mix with homemade passion fruit dressing.", category: "Chicken Dishes" },
          { name: "Arroz Chaufa, GF", price: "$13.00", description: "Wok stir-fried rice elevated with unique blends of homemade sauces (including sesame oil, soy sauce, & scrambled eggs), grilled chicken, cabbage, and organic spring mix with passion fruit dressing.", category: "Chicken Dishes" },

          // Start of vegetarian section
          { name: "Cilantro Rice, GF", price: "$8.00 / $13.00", description: "Flavorful fluffy jasmine rice cooked with fresh cilantro, herbs, cabbage, and organic spring mix with passion fruit dressing.", category: "Vegetarian Dishes" },
          { name: "Arroz Chaufa", price: "$12.00", description: "Wok stir-fried rice elevated with unique blends of homemade sauces (including sesame oil, soy sauce, & scrambled eggs), cabbage, and organic spring mix with passion fruit dressing.", category: "Vegetarian Dishes" },
          { name: "Pastel De Papa (Scalloped Potatoes)", price: "$12.00", description: "Golden-baked potatoes slices layered with cheese, sliced avocado, cabbage, and organic spring mix with passion fruit dressing.", category: "Vegetarian Dishes" },

          // Add Ons
          { name: "Extra avocado", price: "$2.00", description: "", category: "Add Ons" },
          { name: "Extra chicken", price: "$6.00", description: "", category: "Add Ons" },
          { name: "Switch to cilantro rice", price: "$3.00", description: "", category: "Add Ons" },
          { name: "Switch to chaufa rice", price: "$3.00", description: "", category: "Add Ons" },

          // Beverages
          { name: "Inka Cola", price: "$3.00", description: "", category: "Beverages" },
          { name: "San Pellegrino", price: "$3.00", description: "", category: "Beverages" },
          { name: "Coke", price: "$2.00", description: "", category: "Beverages" },
          { name: "LaCroix", price: "$2.00", description: "", category: "Beverages" },
          { name: "Water", price: "$2.00", description: "", category: "Beverages" },
        ],
        schedule: {
          "Monday": "11:30 am - 2:30 pm",
          "Tuesday": "11:30 am - 2:30 pm",
          "Wednesday": "11:30 am - 2:30 pm",
          "Thursday": "11:30 am - 2:30 pm",
          "Friday": "11:30 am - 2:30 pm",
          "Saturday": "Closed",
          "Sunday": "Closed"
        }
      },

      // Bombay Fast
      {
        slug: "bombay",
        name: "Bombay Fast",
        description: "Hearty dishes from the streets of Bombay",
        image: "https://bloximages.chicago2.vip.townnews.com/captimes.com/content/tncms/assets/v3/editorial/6/86/686e01e1-6dcf-5678-bba6-30383ae84644/60f6c1e8cf21f.image.jpg?resize=1396%2C930",
        category: "south_asian",
        location: "state-street-library-mall",
        locationDisplayName: "State Street & Library Mall",
        mapsUrl: "https://maps.google.com/?q=43.075000,-89.398361",
        saturdayLocation: "capitol-square",
        saturdayLocationDisplayName: "Dane County Farmers' Market",
        saturdayMapsUrl: "https://maps.google.com/?q=Capitol+Square+Madison+WI",
        businessLinks: {
          instagram: "https://www.instagram.com/bombayfastcafe?utm_source=ig_web_button_share_sheet&igsh=enJzc25kaWZodTZt",
        },
        menu: [
          // Specialties
          { name: "Bombay Vada Pav", price: "$10.00", description: "Bombay potato burger topped with sweet and spicy relish. Served with garlic chutney and flavored green chilies.", category: "Bombay Specialties" },
          { name: "Bombay Misal Pav", price: "$10.00", description: "Indian pluses cooked with authentic home-style spices topped with Bombay Trail mix. Garnished with chopped onions, cilantro, and lemon. Served with bread.", category: "Bombay Specialties" },
          { name: "Bombay Pav Bhaji", price: "$10.00", description: "Medley of vegetables cooked with authentic home-style spices. Garnished with butter, chopped onions, cilantro, and lemon. Served with bread.", category: "Bombay Specialties" },
          
          //Lentil & Bean Dishes
          { name: "Bombay Falafel Meal", price: "$10.00", description: "Bombay style falafel completed with pulav, gravy, and salad. Served with a side of sweet and green chutney.", category: "Bombay Specialties" },
          { name: "Chole", price: "$10.00", description: "One pot recipe of garbanzo beans (chickpeas) cooked with authentic home-style spices. Garnished with chopped onions, cilantro, and lime. Served with naan, rice, and chutney.", category: "Lentil & Bean Dishes"},
          { name: "Chole Samosa", price: "$10.00", description: "Chatt recipe made with samosas, chana masala, various chutneys, and spices. Popular recipe from North India", category: "Lentil & Bean Dishes" },
          { name: "Dal Makhani (Black Gram)", price: "$10.00", description: "Black Gram cooked with authentic home-style spices. Garnished with chopped onions, cilantro, and lemon. Served with naan, rice, and chutney.", category: "Lentil & Bean Dishes"},
          { name: "Rajma (Kidney Beans)", price: "$10.00", description: "Kidney beans cooked with authentic home style spices garnished with chopped onions, cilantro, and lime. Served with naan, rice, and chutney.", category: "Lentil & Bean Dishes"},

          // Drinks
          { name: "Mango Lassi", price: "10 oz: $5.00, 12 oz: $6.00, 16 oz: $8.00", description: "Creamy, sweet smoothie made with ripe mangoes and yogurt.", category: "Drinks" }
        ],
        schedule: {
        "Monday": "11:00 am - 4:00 pm",
        "Tuesday": "11:00 am - 4:00 pm",
        "Wednesday": "11:00 am - 4:00 pm",
        "Thursday": "11:00 am - 4:00 pm",
        "Friday": "11:00 am - 4:00 pm",
        "Saturday": "8:30 am - 1:45 pm",
        "Sunday": "Closed"
        }
      },

      // Nani
      {
        slug: "nani",
        name: "Nani",
        description: "Chinese dim sum and Sichuan-style stir-fry",
        image: "https://bloximages.chicago2.vip.townnews.com/captimes.com/content/tncms/assets/v3/editorial/5/ec/5ec217a6-6952-5dac-a466-a881079c50ae/61d8c56fd9a7f.image.jpg?resize=780%2C500",
        category: "asian",
        location: "southeast-campus",
        locationDisplayName: "1225 W Dayton St, Madison, WI 53706",
        mapsUrl: "https://maps.google.com/?q=1225+W+Dayton+St+Madison+WI+53706",
        businessLinks: {
          website: "https://nani.restaurant",
          instagram: "https://www.instagram.com/nani.restaurant/?utm_source=ig_web_button_share_sheet",
        },
        menu: [
          { name: "TBD", price: "$TBD", description: "TBD" },
          { name: "TBD", price: "$TBD", description: "TBD" },
          { name: "TBD", price: "$TBD", description: "TBD" },
          { name: "TBD", price: "$TBD", description: "TBD" },
          { name: "TBD", price: "$TBD", description: "TBD" },
          { name: "TBD", price: "$TBD", description: "TBD" }
        ],
        schedule: {
          "Monday": "11:00 am - 2:00 pm",
          "Tuesday": "11:00 am - 2:00 pm",
          "Wednesday": "11:00 am - 2:00 pm",
          "Thursday": "11:00 am - 2:00 pm",
          "Friday": "11:00 am - 2:00 pm",
          "Saturday": "Closed",
          "Sunday": "Closed"
        }
      },

      // Jolly Frog
      {
        slug: "jolly-frog",
        name: "Jolly Frog",
        description: "Authentic Mexican food with fresh ingredients",
        image: "/jollyfrog_pic.jpg",
        category: "mexican",
        location: "state-street-library-mall",
        locationDisplayName: "State Street & Library Mall",
        mapsUrl: "https://maps.google.com/?q=43.075000,-89.398361",
        businessLinks: {
          facebook: "https://www.facebook.com/jollyfrogllc?mibextid=wwXIfr"
        },
        menu: [
          // Tacos
          { name: "Steak and/or Pork", price: "$10.00", description: "Corn tortilla, onion, cilantro, lime.", category: "Tacos with Rice & Beans (2 per order)" },
          { name: "Chicken", price: "$10.00", description: "Corn tortilla, lettuce, sour cream, cheese.", category: "Tacos with Rice & Beans (2 per order)" },
          { name: "Veggie", price: "$10.00", description: "Corn tortilla, onion, cilantro, lettuce, tomato, sour cream, cheese, avocado.", category: "Tacos with Rice & Beans (2 per order)" },

          // Burritos / Bowls
          { name: "Steak, Chicken, and/or Pork", price: "$12.00", description: "Flour tortilla, rice, beans, onion, cilantro, lettuce, cheese, sour cream.", category: "Burrito / Bowl (chips on the side)" },
          { name: "Veggie", price: "$12.00", description: "Flour tortilla, rice, beans, onion, cilantro, lettuce, tomato, avocado, cheese, sour cream.", category: "Burrito / Bowl (chips on the side)" },

          // Nachos
          { name: "Steak, Chicken, and/or Pork", price: "$10.00", description: "Nacho cheese, beans, onion, cilantro, lettuce, shredded cheddar cheese, monterrey jack, sour cream, jalapeños.", category: "Tostadas with Rice (2 per order)" },
          { name: "Veggie", price: "$10.00", description: "Nacho cheese, beans, onion, cilantro, lettuce, shredded cheddar cheese, monterrey jack, sour cream, jalapeños.", category: "Tostadas with Rice (2 per order)" },

          // Tostadas
          { name: "Taco", price: "$3.50", description: "Choice of meat, onion, cilantro, lettuce, tomato, mozzarella cheese, sour cream.", category: "Build Your Own" },
          { name: "Steak, Chicken, and/or Pork", price: "$12.00", description: "Corn hard flat tortilla, beans, lettuce, onion, cilantro, sour cream mozzarella cheese.", category: "Nachos" },
          { name: "Veggie", price: "$12.00", description: "Corn hard flat tortilla, beans, lettuce, onion, cilantro, tomato, sour cream, mozzarella cheese, avocado.", category: "Nachos" },

          // Drinks
          { name: "Soda", price: "$2.00", description: " ", category: "Drinks" },
          { name: "Water", price: "$1.00", description: " ", category: "Drinks" }
        ],
        schedule: {
          "Monday": "11:00 am - 3:00 pm",
          "Tuesday": "11:00 am - 3:00 pm",
          "Wednesday": "11:00 am - 3:00 pm",
          "Thursday": "11:00 am - 3:00 pm",
          "Friday": "11:00 am - 3:00 pm",
          "Saturday": "Closed",
          "Sunday": "Closed"
        }
      },

      // The Roost Fried Chicken
      {
        slug: "roost",
        name: "The Roost Fried Chicken",
        description: "Crispy fried chicken with spicy dry rubs",
        image: "/roost_pic.jpg",
        category: "american",
        location: "state-street-library-mall",
        locationDisplayName: "State Street & Library Mall",
        mapsUrl: "https://maps.google.com/?q=43.075000,-89.398361",
        businessLinks: {
          website: "https://www.theroostfriedchicken.com",
          instagram: "https://www.instagram.com/theroostfriedchicken?utm_source=ig_web_button_share_sheet&igsh=MTdueWhrd3BnMjdzcw==",
          facebook: "https://www.facebook.com/TheRoostFriedChicken/"
        },
        menu: [
          // Chicken Tenders
          { name: "2-Piece Tenders", price: "$8.00 / $12.00", description: " ", category: "Chicken Tenders & Sandwiches" },
          { name: "3-Piece Tenders", price: "$12.00 / $15.00", description: " ", category: "Chicken Tenders & Sandwiches" },
          { name: "4-Piece Tenders", price: "$16.00 / $18.00", description: " ", category: "Chicken Tenders & Sandwiches" },

          // Chicken Sandwiches
          { name: "Badgerville Spicy", price: "$10.00 / $14.00", description: "Fried chicken dipped in honey butter and seasoned with spicy dry rub. Topped with pickles and coleslaw on a brioche bun.", category: "Chicken Tenders & Sandwiches" },
          { name: "Original", price: "$9.00 / $13.00", description: "Signature fried chicken topped with mayo and pickles on a brioche bun.", category: "Chicken Tenders & Sandwiches" },
          { name: "Deluxe", price: "$10.00 / $14.00", description: "Signature fried chicken topped with lettuce, tomato, pickles, cheese, and mayo on a brioche bun.", category: "Chicken Tenders & Sandwiches" },

          // Sides
          { name: "French Fries", price: "$4.00 / $6.00", description: " ", category: "Chicken Tenders & Sandwiches" },
          { name: "Cheese Curds", price: "$6.00", description: " ", category: "Chicken Tenders & Sandwiches" },
          { name: "Coleslaw", price: "$3.00", description: " ", category: "Chicken Tenders & Sandwiches" },

          // Add Ons
          { name: "Make it a Meal", price: " ", description: "Includes french fries and a drink.", category: "Add Ons" },
          { name: "Meal - Substitute Cheese Curds", price: "$2.00 ", description: " ", category: "Add Ons" },
          { name: "Meal - Substitute Lemonade", price: "$1.00 / $2.00", description: " ", category: "Add Ons" },
          { name: "Roost Style", price: "Free", description: "Substitute mayo for Roost Sauce.", category: "Add Ons" },
          { name: "Dip Chicken in Honey Butter", price: "$1.00", description: " ", category: "Add Ons" }
        ],
        
        schedule: {
          "Monday": "Closed",
          "Tuesday": "11:00 am - 2:00 pm",
          "Wednesday": "11:00 am - 2:00 pm",
          "Thursday": "11:00 am - 2:00 pm",
          "Friday": "11:00 am - 2:00 pm",
          "Saturday": "Closed",
          "Sunday": "Closed"
        }
      },

      // M & J Jamaican Kitch'n
      {
        slug: "mj-jamaican",
        name: "M & J Jamaican Kitch'n",
        description: "Jamaican combination plates",
        image: "/mj_pic.jpg",
        category: "caribbean",
        location: "state-street-library-mall",
        locationDisplayName: "State Street & Library Mall",
        mapsUrl: "https://maps.google.com/?q=43.075000,-89.398361",
        businessLinks: {
          instagram: "https://www.instagram.com/mjjamaicankitchn/?hl=en",
          facebook: "https://www.facebook.com/MJJamaicanK/"
        },
        menu: [
          // Plates
          { name: "Jerk BBQ Chicken Tenders", price: "$13.00", description: "Served with mac & cheese.", category: "Plates" },
          { name: "Jerk Chicken", price: "$12.00", description: "Served with rice, beans, and cabbage mix.", category: "Plates" },
          { name: "Jerk Pork", price: "$12.00", description: "Served with rice, beans, and cabbage mix.", category: "Plates" },
          { name: "Brown Stew Chicken", price: "$13.00", description: "Served with carrots, bell peppers.", category: "Plates" },
          { name: "Vegetable Coconut Stew", price: "$13.00", description: " ", category: "Plates" },

          // Sides
          { name: "Mac & Cheese", price: "$5.00", description: " ", category: "Sides" },
          { name: "Fried Plantains", price: "$5.00", description: " ", category: "Sides" },
          { name: "Drinks", price: "$4.00", description: "Variety of bottled drinks available.", category: "Sides" }
        ],
        schedule: {
          "Monday": "TBD",
          "Tuesday": "TBD",
          "Wednesday": "TBD",
          "Thursday": "TBD",
          "Friday": "TBD",
          "Saturday": "TBD",
          "Sunday": "TBD"
        }
      },

      // King of Falafel
      {
        slug: "falafel",
        name: "King of Falafel",
        description: "Fresh falafel and pitas",
        image: "/kof.jpg",
        category: "middle_eastern",
        location: "state-street-library-mall",
        locationDisplayName: "State Street & Library Mall",
        mapsUrl: "https://maps.google.com/?q=43.075000,-89.398361",
        businessLinks: {
          website: "https://kingoffalafel.dine.online/locations/2964238?fulfillment=pickup",

        },
        menu: [
          { name: "Falafel Sandwich", price: "$9.00", description: "Hummus, tomato, tahini.", category: "Main Dishes" },
          { name: "Falafel Sandwich", price: "$10.00", description: "Taziki, tomato, onion.", category: "Main Dishes" },
          { name: "Chicken Shawarma", price: "$10.00", description: "Grilled onion, tomato, pickle, lettuce, tahini.", category: "Main Dishes" },
          { name: "Veggie Plate", price: "$12.00", description: "Baba ghanoush, hummus, basmati rice, falafel (x2).", category: "Main Dishes" },
        ],
        schedule: {
          "Monday": "11:00 am - 3:00 pm",
          "Tuesday": "11:00 am - 3:00 pm",
          "Wednesday": "11:00 am - 3:00 pm",
          "Thursday": "11:00 am - 3:00 pm",
          "Friday": "11:00 am - 3:00 pm",
          "Saturday": "11:00 pm - 3:00 pm",
          "Sunday": "11:00 pm - 3:00 pm"
        }
      },

      // Crepuw
      {
        slug: "crepuw",
        name: "Crepuw",
        description: "Gluten-free sweet and savory crepes",
        image: "/crepuw.jpg",
        category: "sweet_treats",
        location: "state-street-library-mall",
        locationDisplayName: "State Street & Library Mall",
        mapsUrl: "https://maps.google.com/?q=43.075000,-89.398361",
        saturdayLocation: "capitol-square",
        saturdayLocationDisplayName: "Dane County Farmers' Market",
        saturdayMapsUrl: "https://maps.google.com/?q=Capitol+Square+Madison+WI",
        glutenFree: true,
        businessLinks: {
          instagram: "https://www.instagram.com/crepuwmadison?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
          facebook: "https://www.facebook.com/crepuwmadison"
        },
        menu: [

          // crepes
          { name: "Strawberry Banana", price: "$8.00", description: "Strawberries, bananas, custard, cream, nutella, selection of sauce.", category: "Crepes" },
          { name: "Strawberry Nutella", price: "$8.00", description: "Strawberries, nutella selection of sauce.", category: "Crepes" },
          { name: "Banana Nutella", price: "$8.00", description: "Banana, nutella selection of sauce.", category: "Crepes" },
          { name: "Mediterranean Breeze", price: "$9.00", description: "Avocado, lettuce, feta cheese, olive oil, tomatoes.", category: "Crepes" },

          // crepe sushi
          { name: "Dubai Chocolate Strawberry", price: "$9.00", description: "Strawberry, pistachio cream, kataifi, chocolate sauce.", category: "Crepe Sushi" },
          { name: "Strawberry Brownie", price: "$8.00", description: "Strawberry, brownie, selection of sauce.", category: "Crepe Sushi" },
          { name: "Nutella Banana", price: "$8.00", description: "Banana, nutella, selection of sauce.", category: "Crepe Sushi" },

          // sauces
          { name: "Chocolate", price: " ", description: " ", category: "Sauces" },
          { name: "White Chocolate", price: " ", description: " ", category: "Sauces" },
          { name: "Caramel", price: " ", description: " ", category: "Sauces" },
          { name: "Pistachio", price: " ", description: " ", category: "Sauces" }

        ],
        schedule: {
          "Monday": "11:00 am - 4:00 pm",
          "Tuesday": "11:00 am - 4:00 pm",
          "Wednesday": "11:00 am - 4:00 pm",
          "Thursday": "11:00 am - 4:00 pm",
          "Friday": "11:00 am - 4:00 pm",
          "Saturday": "8:00 am - 1:00 pm",
          "Sunday": "Closed"
        }
      },

      // Naan stop
      {
        slug: "naan_stop",
        name: "Naan Stop Fusion",
        description: "Warm naan sandwiches",
        image: "/naan_pic.jpg",
        category: "south_asian",
        location: "west-side",
        locationDisplayName: "6640 Odana Rd, Madison, WI 53719",
        mapsUrl: "https://maps.google.com/?q=6640+Odana+Rd+Madison+WI+53719",
        businessLinks: {
          instagram: "https://www.instagram.com/naanstop.fusion",
          facebook: "https://www.facebook.com/profile.php?id=100087276965434&sk=about"
        },
        menu: [
          { name: "Bacon Bliss", price: "$12.00", description: "Sliced bacon, mixed greens, shredded cheese, and diced tomatoes. Topped with garlic aioli on folded, grilled 8 inch naan bread.", category: "Naan Folds" },
          { name: "Firecracker (Spicy)", price: "$14.00", description: "Shaved steak, giardiniera, and shredded cheese. Topped with garlic aioli on folded, grilled 8 inch naan bread.", category: "Naan Folds" },
          { name: "Naan-Rito", price: "$12.00", description: "Roasted chicken, green peppers, mixed greens, and shredded cheese. Topped with garlic chipotle mayo on folded, grilled 8 inch naan bread.", category: "Naan Folds" },
          { name: "Naan of the Above (vegetarian)", price: "$10.00", description: "Fire-roasted vegetables, mixed greens, and shredded cheese. Topped with garlic chipotle mayo on folded, grilled 8 inch naan bread.", category: "Naan Folds" },

          // Sides
          { name: "Chips", price: "$3.00", description: " ", category: "Sides" },

          // Drinks
          { name: "Bottled Water", price: "$2.00", description: " ", category: "Drinks" },
          { name: "Soda", price: "$2.00", description: " ", category: "Drinks" }
        ],
        schedule: {
          "Monday": "6:30 pm - 11:30 pm",
          "Tuesday": "Closed",
          "Wednesday": "Closed",
          "Thursday": "Closed",
          "Friday": "Closed",
          "Saturday": "Closed",
          "Sunday": "Closed"
        }
      },

      // Stellies Ice Cream
      {
        slug: "stellies",
        name: "Stellies Ice Cream",
        description: "Premium ice cream made with local ingredients",
        image: "/stellies_pic.jpg",
        category: "sweet_treats",
        location: "capitol-square",
        locationDisplayName: "Dane County Farmers' Market",
        mapsUrl: "https://maps.google.com/?q=Capitol+Square+Madison+WI",
        businessLinks: {
          website: "https://www.stelliesicecream.com",
          instagram: "https://www.instagram.com/stelliesicecream/",
          facebook: "https://www.facebook.com/stelliesicecream"
        },
        menu: [
          { name: "Single-Serve Ice Cream Containers", price: "$6.00", description: "Flavors vary on what is available.", category: "Ice Cream" }
        ],
        schedule: {
          "Open on Saturdays at the Dane County Farmers' Market!": ""
        }
      },

      // Toms Coffee
      {
        slug: "toms_coffee",
        name: "Travelin' Tom's Coffee",
        description: "Hot and cold brews made to order",
        image: "/tomscoffee_pic.jpg",
        category: "drinks",
        location: "traveling",
        locationDisplayName: "Traveling",
        businessLinks: {
          website: "https://travelintomscoffee.com/local-site/travelin-toms-coffee-of-central-madison/",
          instagram: "https://www.instagram.com/travelintomscoffee/",
          facebook: "https://www.facebook.com/TravelinTomsCoffeeofCentralMadison/"
        },
        menu: [
          { name: "TBD", price: "$TBD", description: "TBD" },
          { name: "TBD", price: "$TBD", description: "TBD" },
          { name: "TBD", price: "$TBD", description: "TBD" },
          { name: "TBD", price: "$TBD", description: "TBD" },
          { name: "TBD", price: "$TBD", description: "TBD" }
        ],
        schedule: {
          "Monday": "TBD",
          "Tuesday": "TBD",
          "Wednesday": "TBD",
          "Thursday": "TBD",
          "Friday": "TBD",
          "Saturday": "TBD",
          "Sunday": "TBD"
        }
      },

      // Kona Ice
      {
        slug: "kona-ice",
        name: "Kona Ice",
        description: "Snow cones and shaved ice",
        image: "/konaice_pic.jpg",
        category: "sweet_treats",
        location: "traveling",
        locationDisplayName: "Traveling",
        businessLinks: {
          website: "https://www.kona-ice.com/local-site/kona-ice-of-madison/",
          instagram: "https://www.instagram.com/konaice/?hl=en",
          facebook: "https://www.facebook.com/KonaIceofMadison/"
        },
        menu: [
          { name: "TBD", price: "$TBD", description: "TBD" },
          { name: "TBD", price: "$TBD", description: "TBD" },
          { name: "TBD", price: "$TBD", description: "TBD" },
          { name: "TBD", price: "$TBD", description: "TBD" },
          { name: "TBD", price: "$TBD", description: "TBD" }
        ],
        schedule: {
          "Monday": "TBD",
          "Tuesday": "TBD",
          "Wednesday": "TBD",
          "Thursday": "TBD",
          "Friday": "TBD",
          "Saturday": "TBD",
          "Sunday": "TBD"
        }
      },

      // Cinn City Smash
      {
        slug: "cinn-city",
        name: "Cinn City Smash",
        description: "Smash burgers and sweet churros",
        image: "/cinncity_pic.jpg",
        category: "american",
        location: "traveling",
        locationDisplayName: "Traveling",
        businessLinks: {
          website: "https://cinncitysmash.com/",
          instagram: "https://www.instagram.com/cinncitysmash/",
          facebook: "https://www.facebook.com/cinncitysmash/"
        },
        menu: [
          // Smash burgers
          { name: "Classic", price: "$TBD", description: "Smash sauce, tomato, lettuce, onions, pickles, & american cheese on a brioche bun.", category: "Smash Burgers" },
          { name: "Veggie", price: "$TBD", description: "Smash sauce, tomato, lettuce, onions, pickles, & american cheese on a brioche bun.", category: "Smash Burgers" },
          { name: "Vegan", price: "$TBD", description: "Smash sauce, tomato, lettuce, onions, pickles, & american cheese on a brioche bun.", category: "Smash Burgers" },

          // City fries
          { name: "Regular", price: "$5.00", description: "Tossed with salt.", category: "City Fries" },
          { name: "Truffle", price: "$6.00", description: "Tossed with truffle oil, parmesan, crushed red pepper, garlic powder, & parsley.", category: "City Fries" },

          // Fresh churros
          { name: "Plain (Vegan)", price: "$5.00", description: "Rolled in cinnamon sugar.", category: "Fresh Churros" },
          { name: "Raspberry (Vegan)", price: "$6.00", description: "Rolled in cinnamon sugar. Filled with raspberry puree.", category: "Fresh Churros" },
          { name: "Nutella", price: "$6.00", description: "Rolled in cinnamon sugar. Filled with nutella.", category: "Fresh Churros" },

          // Add Ons
          { name: "Smash Burger - Add Fries", price: "$3.00", description: " ", category: "Add Ons" },
          { name: "Smash Burger - Add Truffle Fries", price: "$4.00", description: " ", category: "Add Ons" },
          { name: "Smash Burger - Gluten Free Bun", price: "$2.00", description: " ", category: "Add Ons" },
          { name: "City Fries - Add Smash Sauce", price: "$0.75", description: " ", category: "Add Ons" },

          // Drinks
          { name: "Pepsi", price: "$2.00", description: " ", category: "Drinks" },
          { name: "Diet Pepsi", price: "$2.00", description: " ", category: "Drinks" },
          { name: "Squirt", price: "$2.00", description: " ", category: "Drinks" },
          { name: "Root Beer", price: "$2.00", description: " ", category: "Drinks" },
          { name: "Water", price: "$1.00", description: " ", category: "Drinks" },

        ],
        schedule: {
          "Monday": "TBD",
          "Tuesday": "TBD",
          "Wednesday": "TBD",
          "Thursday": "TBD",
          "Friday": "TBD",
          "Saturday": "TBD",
          "Sunday": "TBD"
        }
      },

      // Culinary Nirvana
      {
        slug: "nirvana",
        name: "Culinary Nirvana",
        description: "A unique farm-to-fork culinary experience",
        image: "/nirvana_pic.jpg",
        category: "american",
        location: "traveling",
        locationDisplayName: "Traveling",
        businessLinks: {
          website: "https://www.culinarynirvanallc.com",
          instagram: "https://www.instagram.com/culinary.nirvana/?hl=en",
          facebook: "https://www.facebook.com/p/Culinary-Nirvana-61556890915815/"
        },
        menu: [
          { name: "TBD", price: "$TBD", description: "TBD" },
          { name: "TBD", price: "$TBD", description: "TBD" },
          { name: "TBD", price: "$TBD", description: "TBD" },
          { name: "TBD", price: "$TBD", description: "TBD" },
          { name: "TBD", price: "$TBD", description: "TBD" }
        ],
        schedule: {
          "Monday": "TBD",
          "Tuesday": "TBD",
          "Wednesday": "TBD",
          "Thursday": "TBD",
          "Friday": "TBD",
          "Saturday": "TBD",
          "Sunday": "TBD"
        }
      },

      // Little sister cookies
      {
        slug: "cookies",
        name: "Little Sister Cookies",
        description: "Warm, gooey cookies baked fresh daily",
        image: "/cookies_pic.jpg",
        category: "sweet_treats",
        location: "TBD",
        locationDisplayName: "TBD",
        businessLinks: {
          website: "https://sites.google.com/littlesistercookies.com/little-sister-cookies",
          facebook: "https://www.facebook.com/littlesistercookies/"
        },
        menu: [
          { name: "One", price: "$2.00", description: "Flavors: Chocolate Chip, Seasonal (vary by event)", category: "Cookies" },
          { name: "Three", price: "$5.00", description: "Flavors: Chocolate Chip, Seasonal (vary by event)", category: "Cookies" },
          { name: "Six", price: "$9.00", description: "Flavors: Chocolate Chip, Seasonal (vary by event)", category: "Cookies" },
          { name: "Bakers Dozen", price: "$18.00", description: "Flavors: Chocolate Chip, Seasonal (vary by event)", category: "Cookies" },
        ],
        schedule: {
          "Monday": "TBD",
          "Tuesday": "TBD",
          "Wednesday": "TBD",
          "Thursday": "TBD",
          "Friday": "TBD",
          "Saturday": "TBD",
          "Sunday": "TBD"
        }
      },

      // china cottage
      {
        slug: "china_cottage",
        name: "China Cottage",
        description: "Authentic Chinese cuisine",
        image: "/china_cottage.jpg",
        category: "asian",
        location: "state-street-library-mall",
        locationDisplayName: "State Street & Library Mall",
        mapsUrl: "https://maps.google.com/?q=43.075000,-89.398361",

        menu: [
          // Appetizers
          { name: "Egg Rolls (Pork or Vegetable)", price: "$2.00 each", description: "Contains carrots and cabbage.", category: "Appetizers" },
          { name: "Crabmeat Rangoons", price: "$5.00 / 4 pieces", description: "Contains cream cheese, imitation crabmeat, and onion filling.", category: "Appetizers" },
          { name: "Steamed Dumplings (Pork or Chicken)", price: "$6.00 / 6 pieces", description: "Contains cabbage and onions", category: "Appetizers" },

          // Fried Rice
          { name: "Ground Beef", price: "$9.00", description: " ", category: "Fried Rice (with peas, carrots, & egg)" },
          { name: "Tofu, Chicken, BBQ Pork, or Vegetables", price: "$10.00", description: " ", category: "Fried Rice (with peas, carrots, & egg)" },
          { name: "Shrimp or Beef", price: "$11.00", description: " ", category: "Fried Rice (with peas, carrots, & egg)" },
          { name: "Combination (Chicken, BBQ Pork, & Shrimp)", price: "$12.00", description: " ", category: "Fried Rice (with peas, carrots, & egg)" },

          // Stir-Fried Noodles
          { name: "Lo-Mein", price: "$10.00", description: "Chinese-style, thin, flour noodles. ", category: "Stir-Fried Noodles (Chicken, Tofu, or Vegetable)" },
          { name: "Udon", price: "$10.00", description: "Thick, round, chewy rice noodles.", category: "Stir-Fried Noodles (Chicken, Tofu, or Vegetable)" },
          { name: "Chow Fun", price: "$10.00", description: "Flat, rice noodles.", category: "Stir-Fried Noodles (Chicken, Tofu, or Vegetable)" },

          // Lunch Specials
          
          // $10.00 Lunch Specials
          { name: "Governor's Chicken (Spicy)", price: "$10.00", description: " ", category: "Lunch Specials (with steamed white rice)" },
          { name: "Hunan Chicken (Spicy)", price: "$10.00", description: " ", category: "Lunch Specials (with steamed white rice)" },
          { name: "Chicken Cashew", price: "$10.00", description: " ", category: "Lunch Specials (with steamed white rice)" },
          { name: "Chicken with Vegetables", price: "$10.00", description: " ", category: "Lunch Specials (with steamed white rice)" },
          { name: "Chicken Broccoli", price: "$10.00", description: " ", category: "Lunch Specials (with steamed white rice)" },
          { name: "Szechuan Style Chicken", price: "$10.00", description: " ", category: "Lunch Specials (with steamed white rice)" },
          { name: "Fresh Vegetables & Tofu Mix", price: "$10.00", description: " ", category: "Lunch Specials (with steamed white rice)" },
          { name: "Vegetables & Tofu Cashew Mix", price: "$10.00", description: " ", category: "Lunch Specials (with steamed white rice)" },
          { name: "Hunan Tofu (Spicy)", price: "$10.00", description: " ", category: "Lunch Specials (with steamed white rice)" },
          { name: "Fresh Vegetables Mix", price: "$10.00", description: " ", category: "Lunch Specials (with steamed white rice)" },
          { name: "Szechuan Style Tofu", price: "$10.00", description: " ", category: "Lunch Specials (with steamed white rice)" },
          { name: "Sesame Tofu", price: "$10.00", description: " ", category: "Lunch Specials (with steamed white rice)" },
          { name: "General Tofu", price: "$10.00", description: " ", category: "Lunch Specials (with steamed white rice)" },

          // $11.00 Lunch Specials
          { name: "Hunan Beef (Spicy)", price: "$11.00", description: " ", category: "Lunch Specials (with steamed white rice)" },
          { name: "Governor's Beef (Spicy)", price: "$11.00", description: " ", category: "Lunch Specials (with steamed white rice)" },
          { name: "Beef with Broccoli", price: "$11.00", description: " ", category: "Lunch Specials (with steamed white rice)" },
          { name: "Szechuan Beef", price: "$11.00", description: " ", category: "Lunch Specials (with steamed white rice)" },
          { name: "Beef with Vegetables", price: "$11.00", description: " ", category: "Lunch Specials (with steamed white rice)" },
          { name: "Sesame Chicken", price: "$11.00", description: " ", category: "Lunch Specials (with steamed white rice)" },
          { name: "General Tso's Chicken", price: "$11.00", description: " ", category: "Lunch Specials (with steamed white rice)" },
          { name: "Orange Chicken", price: "$11.00", description: " ", category: "Lunch Specials (with steamed white rice)" },
          { name: "Sweet & Sour Chicken", price: "$11.00", description: " ", category: "Lunch Specials (with steamed white rice)" },

          // Beverages
          { name: "12 oz Soda Can", price: "$2.00", description: "Pepsi, Diet Pepsi, Mountain Dew, Sprite, Coca-Cola, Diet Coke", category: "Beverages" },
          { name: "16.9 oz Bottled Water", price: "$1.50", description: " ", category: "Beverages" },

          // Duel pricing (small, large)
          { name: "Fresh Squeezed Lemonade", price: "$5.00, $6.00", description: " ", category: "Beverages" },
          { name: "Fresh Squeezed Orange Juice", price: "$6.00, $7.00", description: " ", category: "Beverages" },
          { name: "Combination (Lemonade + Orange Juice)", price: "$6.00, $7.00", description: " ", category: "Beverages" },
          { name: "Thai Iced Tea (w/ Cream + Sugar)", price: "$4.00, $5.00", description: " ", category: "Beverages" },
          { name: "Thai Iced Coffee (w/ Cream + Sugar)", price: "$4.00, $5.00", description: " ", category: "Beverages" },
        ],

        schedule: {
          "Monday": "11:00 am - 3:00 pm",
          "Tuesday": "11:00 am - 3:00 pm",
          "Wednesday": "11:00 am - 3:00 pm",
          "Thursday": "11:00 am - 3:00 pm",
          "Friday": "11:00 am - 3:00 pm",
          "Saturday": "Closed",
          "Sunday": "Closed"
        }
      },

      // hibachi hut
      {
        slug: "hibachi_hut",
        name: "Hibachi Hut",
        description: "Hot hibachi made-to-order",
        image: "/hibachi_hut.jpg",
        category: "asian",
        location: "state-street-library-mall",
        locationDisplayName: "State Street & Library Mall",
        mapsUrl: "https://maps.google.com/?q=43.075000,-89.398361",

        menu: [
          { name: "Teriyaki Chicken", price: "$13.00", description: "Grilled chicken glazed with a sweet and savory teriyaki sauce. Served with sir-fried zucchini, broccoli, and carrots over white rice.", category: "Hibachi" },
          { name: "Teriyaki Steak", price: "$15.00", description: "Grilled steak glazed with a sweet and savory teriyaki sauce. Served with sir-fried zucchini, broccoli, and carrots over white rice.", category: "Hibachi" },
          { name: "Hibachi Chicken", price: "$13.00", description: "Flat-top grilled chicken with butter, sake, and soy sauce. Served with sir-fried zucchini, broccoli, and carrots over white rice.", category: "Hibachi" },
          { name: "Hibachi Steak", price: "$15.00", description: "Flat-top grilled steak with butter, sake, and soy sauce. Served with sir-fried zucchini, broccoli, and carrots over white rice", category: "Hibachi" },
          { name: "Vegetarian Combo", price: "$13.00", description: "Seared-fried tofu, stir-fried mushroom, zucchini, broccoli, and carrots with teriyaki sauce served over white rice.", category: "Hibachi" },
          { name: "Hibachi Fried Rice", price: "$13.00", description: "Hibachi egg fried rice with chicken and vegetables.", category: "Hibachi" },
          { name: "Hibachi Noodles (Chicken or Tofu)", price: "$14.00", description: "Noodle stir-fried in butter with a sweet and savory sauce.", category: "Hibachi" },
          { name: "Hibachi Noodles (Steak)", price: "$16.00", description: "Noodle stir-fried in butter with a sweet and savory sauce.", category: "Hibachi" },

          { name: "Soda", price: "$2.00", description: " ", category: "Drinks" },
          { name: "Bottled Water", price: "$3.00", description: " ", category: "Drinks" },
          

        ],
        schedule: {
          "Monday": "11:00 am - 3:00 pm",
          "Tuesday": "11:00 am - 3:00 pm",
          "Wednesday": "11:00 am - 3:00 pm",
          "Thursday": "11:00 am - 3:00 pm",
          "Friday": "11:00 am - 3:00 pm",
          "Saturday": "Closed",
          "Sunday": "Closed"
        }
      },

      // bulgogi korean tacos
      {
        slug: "bulgogi_korean",
        name: "Bulgogi Korean Tacos",
        description: "Korean-Mexican bulgogi fusion.",
        image: "/bulgogi_pic.jpg",
        category: "asian",
        location: "state-street-library-mall",
        locationDisplayName: "State Street & Library Mall",
        mapsUrl: "https://maps.google.com/?q=43.075000,-89.398361",
        menu: [
          { name: "Bulgogi Taco", price: "Chicken: $13.00, Steak: $16.00", description: "Grilled with korean bulgogi barbecue sauce and topped with julienned cucumber, scallions, lettuce, and kimchi.", category: "Entrees" },
          { name: "Bibimbap Burrito", price: "Chicken: $13.00, Steak: $16.00", description: "Wrapped tightly with our house mad bibimbap rice, tomatoes, sliced cucumbers, and lettuce. All mixed with gochojang for that true bibimbap flavor.", category: "Entrees" },
          { name: "Bulgogi Quesadilla", price: "Chicken: $13.00, Steak: $16.00", description: "Grilled with korean bulgogi barbecue sauce encased in a tortilla stuffed with melted Monterey Jack Cheese. Served with a side salad.", category: "Entrees" },
          { name: "Bulgogi Salad", price: "Chicken: $13.00, Steak: $16.00", description: "Fresh organic spring mix topped with chicken or steak grilled in korean bulgogi barbecue sauce, diced tomatoes, sliced cucumber, scallions, and kimchi.", category: "Entrees" },
          { name: "Bulgogi Mix Rice", price: "Chicken: $13.00, Steak: $16.00", description: "Our house made bulgogi chicken or steak, spinach, cilantro, kimchi, fried egg over rice mix with gochojang.", category: "Entrees" }

        ],
        schedule: {
          "Monday": "11:00 am - 4:00 pm",
          "Tuesday": "11:00 am - 4:00 pm",
          "Wednesday": "11:00 am - 4:00 pm",
          "Thursday": "11:00 am - 4:00 pm",
          "Friday": "11:00 am - 4:00 pm",
          "Saturday": "Closed",
          "Sunday": "Closed"
        }
      },

      // pagoda smoothies
      {
        slug: "pagoda_smoothies",
        name: "Pagoda Smoothies",
        description: "Fresh smoothies, boba, and tea.",
        image: "/pagoda_pic.jpg",
        category: "drinks",
        location: "state-street-library-mall",
        locationDisplayName: "State Street & Library Mall",
        mapsUrl: "https://maps.google.com/?q=43.075000,-89.398361",
        menu: [
          { name: "Strawberry Banana", price: "$7.00", description: "", category: "Smoothies" },
          { name: "Pineapple", price: "$7.00", description: "", category: "Smoothies" },
          { name: "Strawberry", price: "$7.00", description: "", category: "Smoothies" },
          { name: "Honeydew", price: "$7.00", description: "", category: "Smoothies" },
          { name: "Mango", price: "$7.00", description: "", category: "Smoothies" },

          { name: "Taro", price: "$7.00", description: "", category: "Tapioca Freeze" },
          { name: "Matcha", price: "$7.00", description: "", category: "Tapioca Freeze" },
          { name: "Mocha", price: "$7.00", description: "", category: "Tapioca Freeze" },
          { name: "Taro Red Bean", price: "$7.00", description: "", category: "Tapioca Freeze" },
          { name: "Matcha Red Bean", price: "$7.00", description: "", category: "Tapioca Freeze" },
          { name: "Red Bean", price: "$7.00", description: "", category: "Tapioca Freeze" },

          { name: "Original", price: "$7.00", description: "", category: "Boba Milk Tea (Hot / Cold)" },
          { name: "Matcha", price: "$7.00", description: "", category: "Boba Milk Tea (Hot / Cold)" },
          { name: "Thai", price: "$7.00", description: "", category: "Boba Milk Tea (Hot / Cold)" },
          { name: "Taro", price: "$7.00", description: "", category: "Boba Milk Tea (Hot / Cold)" },
          { name: "Peach", price: "$7.00", description: "", category: "Boba Milk Tea (Hot / Cold)" },
          { name: "Coconut", price: "$7.00", description: "", category: "Boba Milk Tea (Hot / Cold)" },
          { name: "Strawberry", price: "$7.00", description: "", category: "Boba Milk Tea (Hot / Cold)" },
          { name: "Mango", price: "$7.00", description: "", category: "Boba Milk Tea (Hot / Cold)" },
          { name: "Red Bean", price: "$7.00", description: "", category: "Boba Milk Tea (Hot / Cold)" },
          { name: "Almond", price: "$7.00", description: "", category: "Boba Milk Tea (Hot / Cold)" },

          { name: "Peach Green / Black Tea", price: "$7.00", description: "", category: "Flavored Ice Tea (with Jelly / Tapioca)" },
          { name: "Mango Green / Black Tea", price: "$7.00", description: "", category: "Flavored Ice Tea (with Jelly / Tapioca)" },
          { name: "Lemon Green / Black Tea", price: "$7.00", description: "", category: "Flavored Ice Tea (with Jelly / Tapioca)" },

          { name: "Ice Green / Black Tea", price: "$4.00", description: "", category: "Other Drinks" },
          { name: "Fresh Squeezed Lemonade", price: "$6.00", description: "", category: "Other Drinks" },
          { name: "Bottle Water (20oz)", price: "", description: "", category: "Other Drinks" },

          { name: "Tapioca (Black Pearls)", price: "", description: "", category: "Toppings" },
          { name: "Popping Boba", price: "", description: "Mango or strawberry.", category: "Toppings" },
          { name: "Jelly", price: "", description: "Lychee or mango.", category: "Toppings" }
        ],
        schedule: {
          "Monday": "Closed",
          "Tuesday": "Closed",
          "Wednesday": "Closed",
          "Thursday": "11:00 am - 4:00 pm",
          "Friday": "11:00 am - 4:00 pm",
          "Saturday": "Closed",
          "Sunday": "Closed"
        }
      },

    ];

    sampleCarts.forEach(cart => {
      this.createFoodCart(cart);
    });
  }

  async getFoodCarts(): Promise<FoodCart[]> {
    return Array.from(this.carts.values());
  }

  async getFoodCartBySlug(slug: string): Promise<FoodCart | undefined> {
    return Array.from(this.carts.values()).find(cart => cart.slug === slug);
  }

  async createFoodCart(insertCart: InsertFoodCart): Promise<FoodCart> {
    const id = this.currentId++;
    const cart = { ...insertCart, id } as FoodCart;
    this.carts.set(id, cart);
    return cart;
  }

  async searchFoodCarts(query: string): Promise<FoodCart[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.carts.values()).filter(cart =>
      cart.name.toLowerCase().includes(searchTerm) ||
      cart.description.toLowerCase().includes(searchTerm) ||
      cart.category.toLowerCase().includes(searchTerm)
    );
  }

  async filterFoodCartsByCategory(category: string): Promise<FoodCart[]> {
    if (category === "all") {
      return this.getFoodCarts();
    }
    return Array.from(this.carts.values()).filter(cart => cart.category === category);
  }
}

export const storage = new MemStorage();