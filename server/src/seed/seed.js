const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const User = require('../models/User');
const Package = require('../models/Package');
const Booking = require('../models/Booking');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[Seed] Connected to MongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Seed Error] Database connection failed: ${error.message}`);
    process.exit(1);
  }
};

const samplePackages = [
  {
    name: 'Royal Destination Wedding',
    category: 'Weddings',
    price: 12500,
    duration: 'Full Day (12 Hours)',
    capacity: 350,
    description:
      'A fairytale wedding celebration featuring bespoke royal floral arches, bridal suite staging, choreographed lighting, five-star catering coordination, and dedicated bridal concierge.',
    inclusions: [
      'Complete floral decoration & altar design',
      'Full audio-visual & ambient atmospheric lighting',
      'Five-star multi-course catering supervision',
      'Dedicated wedding coordinator & day-of team',
      'Custom grand photo booth with instant prints',
      'Bridal makeup suite and luxury hospitality lounge',
    ],
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    isActive: true,
  },
  {
    name: 'Elegant Intimate Nuptials',
    category: 'Weddings',
    price: 4800,
    duration: '6 Hours',
    capacity: 80,
    description:
      'Chic and heartwarming boutique wedding celebration designed for close family and friends with aesthetic minimalist aesthetics, acoustic musical backdrop, and gourmet dining.',
    inclusions: [
      'Boutique botanical styling & fairy lighting',
      'Live acoustic duo sound engineering',
      'Artisan buffet and signature beverage bar',
      'Digital photography and drone highlight reel',
      'Personalized guest favors and place cards',
    ],
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    isActive: true,
  },
  {
    name: 'Corporate Executive Summit',
    category: 'Corporate Events',
    price: 7500,
    duration: '8 Hours',
    capacity: 250,
    description:
      'Turnkey conference and leadership summit production with ultra-high-definition LED presentation backdrops, synchronized livestreaming, breakout workshop lounges, and barista service.',
    inclusions: [
      '4K ultra-wide LED stage presentation display',
      'Dual multi-mic conference sound with live stream uplink',
      'Keynote speaker concierge & timing coordinator',
      'Continental breakfast, executive lunch, & all-day espresso bar',
      'Branded badge printing & registration turnstiles',
    ],
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    isActive: true,
  },
  {
    name: 'Annual Tech Gala & Awards',
    category: 'Corporate Events',
    price: 9200,
    duration: '5 Hours',
    capacity: 300,
    description:
      'Celebrate company milestones and reward top performers with red-carpet arrivals, spotlight stage awards, gourmet 3-course plated dinner, and energetic live party band.',
    inclusions: [
      'Red carpet step-and-repeat banner with studio flash photography',
      'Awards ceremony stage with crystal trophiary displays',
      'Multi-course plated banquet dinner & sommelier service',
      'High-energy live party band and DJ transition set',
      'Laser light choreography and indoor pyrotechnics',
    ],
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    isActive: true,
  },
  {
    name: 'Milestone Jubilee Birthday Extravaganza',
    category: 'Birthdays',
    price: 3400,
    duration: '5 Hours',
    capacity: 120,
    description:
      'An unforgettable jubilee or sweet birthday bash filled with themed balloon installations, interactive dessert stations, custom neon signage, and top-tier DJ entertainment.',
    inclusions: [
      'Deluxe 3D balloon arch with custom glowing neon centerpiece',
      'Interactive liquid nitrogen ice cream or chocolate fountain',
      'Professional party DJ with concert sound and party lights',
      '360-degree slow motion video spinner booth',
      'Custom tiered celebratory designer cake',
    ],
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    isActive: true,
  },
  {
    name: 'Silver & Golden Anniversary Celebration',
    category: 'Anniversaries',
    price: 4200,
    duration: '6 Hours',
    capacity: 100,
    description:
      'Timeless romance renewed. Silver and gold metallic accents, memory retrospective projection screen, classic jazz trio, and candlelit culinary feast.',
    inclusions: [
      'Custom retrospective photo slideshow projection & audio',
      'Live romantic jazz ensemble (trio)',
      'Candlelit crystal tablescapes with silk linens',
      'Champagne toast tower and hors d’oeuvres',
      'Custom memory book with guest handwritten notes',
    ],
    image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    isActive: true,
  },
  {
    name: 'Rooftop Acoustic Festival & Gala',
    category: 'Concerts & Galas',
    price: 8900,
    duration: '7 Hours',
    capacity: 400,
    description:
      'Open-air skyline event featuring immersive staging, warm bistro ambient lighting, mixology cocktail stations, and pristine concert-grade acoustic sound system.',
    inclusions: [
      'Pro-grade outdoor line array sound system & backline',
      'Skyline view custom staging and festoon lighting canopy',
      'Craft cocktail mixology bars with bespoke event drinks',
      'Food truck cluster curation or tapas lounge stations',
      'Full security, crowd management, & first-aid support',
    ],
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    isActive: true,
  },
  {
    name: 'Chic Garden Social & Cocktail Mixer',
    category: 'Social Gatherings',
    price: 3100,
    duration: '4 Hours',
    capacity: 90,
    description:
      'Lush outdoor garden party with shaded pergola lounges, charcuterie grazing tables, botanical mocktail/cocktail bars, and curated chillout playlists.',
    inclusions: [
      'Boho-chic wicker lounges, daybeds, and floral arrangements',
      'Artisanal charcuterie grazing table (12-foot spread)',
      'Craft cocktail and infused spritzers beverage bar',
      'Acoustic background sound system with wireless mic',
      'Lawn games package (Giant Jenga, Bocce, Cornhole)',
    ],
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    isActive: true,
  },
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await Package.deleteMany({});
    await Booking.deleteMany({});

    // 1. Create Default Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@eventhive.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
    const adminName = process.env.ADMIN_NAME || 'EventHive Admin';

    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });

    console.log(`[Seed] Created admin: ${admin.email} (Password: ${adminPassword})`);

    // 2. Create Sample Packages
    const createdPackages = await Package.insertMany(samplePackages);
    console.log(`[Seed] Inserted ${createdPackages.length} sample packages`);

    // 3. Create Sample Bookings (Leads)
    const sampleBookings = [
      {
        clientName: 'Sophia Reynolds',
        email: 'sophia.reynolds@example.com',
        phone: '+1 (555) 234-5678',
        package: createdPackages[0]._id,
        packageName: createdPackages[0].name,
        eventType: 'Weddings',
        eventDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // in 45 days
        guestCount: 300,
        location: 'Beverly Hills Estate, CA',
        notes: 'We would love the ceremony at sunset with white orchids and rose gold accents.',
        status: 'new',
        internalNotes: 'Initial inquiry received via website. Send wedding brochure and price quote.',
      },
      {
        clientName: 'Marcus Vance',
        email: 'marcus.vance@techcorp.io',
        phone: '+1 (555) 876-5432',
        package: createdPackages[2]._id,
        packageName: createdPackages[2].name,
        eventType: 'Corporate Events',
        eventDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // in 20 days
        guestCount: 220,
        location: 'Downtown Convention Center, Hall B',
        notes: 'Need high-bandwidth livestream uplink for our European engineering teams.',
        status: 'contacted',
        internalNotes: 'Contacted Marcus via phone. Sent technical rider for stage LED wall.',
      },
      {
        clientName: 'Elena Rostova',
        email: 'elena.rostova@gmail.com',
        phone: '+1 (555) 432-1098',
        package: createdPackages[4]._id,
        packageName: createdPackages[4].name,
        eventType: 'Birthdays',
        eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // in 14 days
        guestCount: 110,
        location: 'Skyline Terrace Lounge, 34th Floor',
        notes: '30th birthday celebration with glamorous Great Gatsby 1920s theme.',
        status: 'confirmed',
        internalNotes: 'Deposit received. DJ and cake designer confirmed.',
      },
      {
        clientName: 'David & Sarah Jenkins',
        email: 'david.jenkins@cloudmail.net',
        phone: '+1 (555) 998-1122',
        package: createdPackages[5]._id,
        packageName: createdPackages[5].name,
        eventType: 'Anniversaries',
        eventDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        guestCount: 95,
        location: 'Oakridge Vineyard & Winery',
        notes: '25th Silver Wedding Anniversary. Would love custom wine pairing for dinner.',
        status: 'new',
        internalNotes: 'Needs follow-up call on Friday regarding dietary requirements.',
      },
      {
        clientName: 'Liam O’Connor',
        email: 'liam.soundwaves@live.com',
        phone: '+1 (555) 345-6789',
        package: createdPackages[6]._id,
        packageName: createdPackages[6].name,
        eventType: 'Concerts & Galas',
        eventDate: new Date(Date.now() + 85 * 24 * 60 * 60 * 1000),
        guestCount: 380,
        location: 'Pier 27 Rooftop Pavillion',
        notes: 'Annual charity fundraising gala featuring local indie rock artists.',
        status: 'contacted',
        internalNotes: 'Reviewing city permit requirements for outdoor sound ordinance after 10 PM.',
      },
    ];

    await Booking.insertMany(sampleBookings);
    console.log(`[Seed] Inserted ${sampleBookings.length} sample leads/bookings`);

    console.log('[Seed] Seeding completed successfully! 🌟');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] Failed to seed database: ${error.message}`);
    process.exit(1);
  }
};

seedData();

