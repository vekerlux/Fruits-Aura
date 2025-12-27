import citrusBurst from '../assets/products/citrus-burst.png';
import berryBlast from '../assets/products/berry-blast.png';
import greenGlow from '../assets/products/green-glow.png';
import tropicalParadise from '../assets/products/tropical-paradise.png';
import lemonZest from '../assets/products/lemon-zest.png';
import watermelonWave from '../assets/products/watermelon-wave.png';
import mangoTango from '../assets/products/mango-tango.png';
import kiwiKicker from '../assets/products/kiwi-kicker.png';
import acaiPower from '../assets/products/acai-power.png';

export const productsData = [
    {
        id: 1,
        name: "Citrus Burst",
        description: "Orange, Lemon, Grapefruit",
        longDescription: "A refreshing explosion of citrus flavors to wake up your senses. Packed with Vitamin C and natural antioxidants.",
        price: 5.50,
        category: "Citrus Blends",
        color: "#FF9800",
        image: citrusBurst,
        ingredients: ["Orange", "Lemon", "Grapefruit", "Mint", "Honey"],
        nutrition: { calories: 120, sugar: "14g", vitaminC: "150%", protein: "2g" },
        rating: 4.8,
        reviews: 142,
        reviewsList: [
            { id: 1, author: "Sarah M.", rating: 5, comment: "Perfect morning boost! Love the fresh citrus flavor.", date: "2025-11-28", helpful: 24 },
            { id: 2, author: "Mike T.", rating: 5, comment: "So refreshing! Best citrus blend I've had.", date: "2025-11-25", helpful: 18 },
            { id: 3, author: "Emma L.", rating: 4, comment: "Great taste but wish it was a bit sweeter.", date: "2025-11-22", helpful: 12 }
        ]
    },
    {
        id: 2,
        name: "Berry Blast",
        description: "Strawberry, Blueberry, Raspberry",
        longDescription: "Sweet and tangy berries blended to perfection. High in antioxidants and bursting with flavor.",
        price: 6.00,
        category: "Berry Boost",
        color: "#E91E63",
        image: berryBlast,
        ingredients: ["Strawberry", "Blueberry", "Raspberry", "Yogurt", "Honey"],
        nutrition: { calories: 140, sugar: "18g", vitaminC: "80%", protein: "5g" },
        rating: 4.9,
        reviews: 218,
        reviewsList: [
            { id: 1, author: "Jessica R.", rating: 5, comment: "Absolutely delicious! My favorite smoothie ever.", date: "2025-11-29", helpful: 45 },
            { id: 2, author: "David K.", rating: 5, comment: "Perfect blend of berries. Highly recommend!", date: "2025-11-27", helpful: 32 },
            { id: 3, author: "Amy P.", rating: 4, comment: "Love it but a bit pricey for the size.", date: "2025-11-24", helpful: 15 }
        ]
    },
    {
        id: 3,
        name: "Green Glow",
        description: "Spinach, Apple, Cucumber",
        longDescription: "The ultimate detox drink. Fresh greens combined with sweet apple for a perfectly balanced healthy boost.",
        price: 5.00,
        category: "Green Detox",
        color: "#4CAF50",
        image: greenGlow,
        ingredients: ["Spinach", "Apple", "Cucumber", "Lemon", "Ginger"],
        nutrition: { calories: 90, sugar: "10g", vitaminC: "120%", protein: "3g" },
        rating: 4.7,
        reviews: 95,
        reviewsList: [
            { id: 1, author: "Rachel W.", rating: 5, comment: "Best green juice! Doesn't taste too veggie.", date: "2025-11-26", helpful: 28 },
            { id: 2, author: "Tom H.", rating: 4, comment: "Healthy and refreshing, great for detox.", date: "2025-11-23", helpful: 19 },
            { id: 3, author: "Lisa B.", rating: 5, comment: "My go-to morning drink. Feel amazing!", date: "2025-11-20", helpful: 22 }
        ]
    },
    {
        id: 4,
        name: "Tropical Paradise",
        description: "Mango, Pineapple, Coconut",
        longDescription: "Escape to the tropics with every sip. Exotic fruits blended with creamy coconut.",
        price: 6.50,
        category: "Tropical Mix",
        color: "#FFC107",
        image: tropicalParadise,
        ingredients: ["Mango", "Pineapple", "Coconut", "Passion Fruit", "Lime"],
        nutrition: { calories: 160, sugar: "22g", vitaminC: "100%", protein: "2g" },
        rating: 4.8,
        reviews: 167,
        reviewsList: [
            { id: 1, author: "Chris D.", rating: 5, comment: "Tastes like vacation in a glass!", date: "2025-11-28", helpful: 35 },
            { id: 2, author: "Nina S.", rating: 5, comment: "Creamy and tropical. Perfect summer drink.", date: "2025-11-25", helpful: 27 },
            { id: 3, author: "Alex M.", rating: 4, comment: "Delicious but could use more mango.", date: "2025-11-21", helpful: 14 }
        ]
    },
    {
        id: 5,
        name: "Lemon Zest",
        description: "Lemon, Mint, Honey",
        longDescription: "Crisp and invigorating. Fresh lemon juice with a hint of mint and natural honey sweetness.",
        price: 4.50,
        category: "Citrus Blends",
        color: "#FFEB3B",
        image: lemonZest,
        ingredients: ["Lemon", "Mint", "Honey", "Sparkling Water"],
        nutrition: { calories: 80, sugar: "12g", vitaminC: "140%", protein: "1g" },
        rating: 4.6,
        reviews: 89,
        reviewsList: [
            { id: 1, author: "Karen F.", rating: 5, comment: "So refreshing! Perfect for hot days.", date: "2025-11-27", helpful: 21 },
            { id: 2, author: "Paul G.", rating: 4, comment: "Nice and zesty, could be less sweet.", date: "2025-11-24", helpful: 11 },
            { id: 3, author: "Diana L.", rating: 5, comment: "Light and refreshing. Love the mint!", date: "2025-11-19", helpful: 18 }
        ]
    },
    {
        id: 6,
        name: "Watermelon Wave",
        description: "Fresh Watermelon, Lime",
        longDescription: "Pure summer in a glass. Juicy watermelon with a splash of lime for the perfect refreshment.",
        price: 5.50,
        category: "Tropical Mix",
        color: "#FF5252",
        image: watermelonWave,
        ingredients: ["Watermelon", "Lime", "Mint"],
        nutrition: { calories: 100, sugar: "16g", vitaminC: "60%", protein: "1g" },
        rating: 4.7,
        reviews: 134,
        reviewsList: [
            { id: 1, author: "Megan R.", rating: 5, comment: "Best watermelon juice ever! So fresh.", date: "2025-11-29", helpful: 30 },
            { id: 2, author: "Jake P.", rating: 4, comment: "Great taste, wish it was larger size.", date: "2025-11-26", helpful: 16 },
            { id: 3, author: "Sophie K.", rating: 5, comment: "Perfect summer drink. Amazing!", date: "2025-11-22", helpful: 25 }
        ]
    },
    {
        id: 7,
        name: "Mango Tango",
        description: "Mango, Peach, Orange",
        longDescription: "Sweet and creamy mango smoothie with hints of peach and orange. Tropical bliss!",
        price: 6.00,
        category: "Tropical Mix",
        color: "#FF9800",
        image: mangoTango,
        ingredients: ["Mango", "Peach", "Orange", "Coconut Milk"],
        nutrition: { calories: 150, sugar: "20g", vitaminC: "110%", protein: "3g" },
        rating: 4.9,
        reviews: 201,
        reviewsList: [
            { id: 1, author: "Brian C.", rating: 5, comment: "Incredible! Best mango smoothie I've tried.", date: "2025-11-30", helpful: 42 },
            { id: 2, author: "Hannah J.", rating: 5, comment: "Creamy and delicious. Perfect blend!", date: "2025-11-28", helpful: 38 },
            { id: 3, author: "Eric W.", rating: 5, comment: "My new favorite! Order this every day.", date: "2025-11-25", helpful: 33 }
        ]
    },
    {
        id: 8,
        name: "Kiwi Kicker",
        description: "Kiwi, Green Apple, Lime",
        longDescription: "An energizing green blend with tangy kiwi and crisp apple. Perfect pre-workout boost.",
        price: 5.50,
        category: "Green Detox",
        color: "#8BC34A",
        image: kiwiKicker,
        ingredients: ["Kiwi", "Green Apple", "Lime", "Spinach", "Honey"],
        nutrition: { calories: 110, sugar: "15g", vitaminC: "180%", protein: "2g" },
        rating: 4.5,
        reviews: 76,
        reviewsList: [
            { id: 1, author: "Olivia N.", rating: 5, comment: "Great pre-workout energizer!", date: "2025-11-27", helpful: 19 },
            { id: 2, author: "Ryan B.", rating: 4, comment: "Good flavor but a bit tart for me.", date: "2025-11-24", helpful: 12 },
            { id: 3, author: "Zoe M.", rating: 4, comment: "Healthy and tasty. Love the kiwi!", date: "2025-11-20", helpful: 15 }
        ]
    },
    {
        id: 9,
        name: "Açaí Power",
        description: "Açaí, Banana, Blueberry",
        longDescription: "Superfood smoothie bowl in a glass. Rich in antioxidants and incredibly delicious.",
        price: 7.00,
        category: "Berry Boost",
        color: "#6A1B9A",
        image: acaiPower,
        ingredients: ["Açaí", "Banana", "Blueberry", "Almond Milk", "Granola"],
        nutrition: { calories: 180, sugar: "16g", vitaminC: "70%", protein: "6g" },
        rating: 4.9,
        reviews: 256,
        reviewsList: [
            { id: 1, author: "Ashley T.", rating: 5, comment: "Best açaí bowl alternative! So good.", date: "2025-11-30", helpful: 51 },
            { id: 2, author: "Marcus L.", rating: 5, comment: "Premium quality! Worth every penny.", date: "2025-11-29", helpful: 47 },
            { id: 3, author: "Kelly V.", rating: 5, comment: "Obsessed with this! Order weekly.", date: "2025-11-27", helpful: 43 }
        ]
    },
    {
        id: 10,
        name: "Carrot Sunrise",
        description: "Carrot, Orange, Ginger",
        longDescription: "Bright and zesty. Fresh carrot juice with orange and a kick of ginger for immunity.",
        price: 5.00,
        category: "Citrus Blends",
        color: "#FF6D00",
        image: null,
        ingredients: ["Carrot", "Orange", "Ginger", "Turmeric", "Lemon"],
        nutrition: { calories: 95, sugar: "13g", vitaminC: "130%", protein: "2g" },
        rating: 4.6,
        reviews: 112,
        reviewsList: [
            { id: 1, author: "Linda H.", rating: 5, comment: "Amazing immunity boost! Love the ginger.", date: "2025-11-26", helpful: 23 },
            { id: 2, author: "Greg S.", rating: 4, comment: "Healthy and tasty. Good morning drink.", date: "2025-11-23", helpful: 17 },
            { id: 3, author: "Tracy A.", rating: 5, comment: "Perfect balance of flavors!", date: "2025-11-19", helpful: 20 }
        ]
    },
    {
        id: 11,
        name: "Strawberry Dream",
        description: "Strawberry, Banana, Cream",
        longDescription: "Creamy and indulgent. Fresh strawberries blended with banana and a touch of cream.",
        price: 6.00,
        category: "Berry Boost",
        color: "#F06292",
        image: null,
        ingredients: ["Strawberry", "Banana", "Greek Yogurt", "Vanilla", "Honey"],
        nutrition: { calories: 155, sugar: "19g", vitaminC: "90%", protein: "7g" },
        rating: 4.8,
        reviews: 189,
        reviewsList: [
            { id: 1, author: "Patricia D.", rating: 5, comment: "Like a milkshake but healthy! Delicious.", date: "2025-11-28", helpful: 36 },
            { id: 2, author: "Steven K.", rating: 5, comment: "Creamy perfection. Highly recommend!", date: "2025-11-25", helpful: 29 },
            { id: 3, author: "Jennifer M.", rating: 4, comment: "Very good, could use more strawberry.", date: "2025-11-21", helpful: 18 }
        ]
    },
    {
        id: 12,
        name: "Peach Perfection",
        description: "Peach, Mango, Passion Fruit",
        longDescription: "Smooth and sweet. Ripe peaches with tropical mango and exotic passion fruit.",
        price: 6.50,
        category: "Tropical Mix",
        color: "#FFB74D",
        image: null,
        ingredients: ["Peach", "Mango", "Passion Fruit", "Coconut Water"],
        nutrition: { calories: 135, sugar: "21g", vitaminC: "95%", protein: "2g" },
        rating: 4.7,
        reviews: 145,
        reviewsList: [
            { id: 1, author: "Michelle B.", rating: 5, comment: "Peachy perfection indeed! So smooth.", date: "2025-11-29", helpful: 31 },
            { id: 2, author: "Daniel F.", rating: 4, comment: "Great tropical flavor. Love the passion fruit.", date: "2025-11-26", helpful: 22 },
            { id: 3, author: "Rebecca S.", rating: 5, comment: "My absolute favorite! Order every week.", date: "2025-11-23", helpful: 27 }
        ]
    }
];

export const categories = ["All Drinks", "Citrus Blends", "Berry Boost", "Tropical Mix", "Green Detox"];
