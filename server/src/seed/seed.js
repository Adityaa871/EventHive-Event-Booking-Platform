require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Package = require('../models/Package');
const Admin = require('../models/Admin');

const packages = [
  // ── Birthday ──────────────────────────────────────────────
  {
    title: 'Kids Birthday Bash',
    slug: 'kids-birthday-bash',
    category: 'birthday',
    shortDescription: 'A magical fun-filled birthday for little ones with games, balloons, and cake.',
    description:
      "Make your child's birthday unforgettable with our Kids Birthday Bash package. We handle everything — from colorful balloon arches and themed decorations to professional face-painting artists and interactive games. Includes a custom 3-tier cake, goody bags for all guests, and a dedicated event coordinator.",
    price: 25000,
    capacity: 50,
    duration: '4 hours',
    inclusions: ['Themed Balloon Decoration', 'Face Painting Artist', 'Interactive Games Host', 'Custom 3-Tier Cake', 'Goody Bags', 'Event Coordinator', 'Photo Booth'],
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800',
    ],
    isFeatured: true,
    isActive: true,
  },
  {
    title: 'Sweet Sixteen Celebration',
    slug: 'sweet-sixteen-celebration',
    category: 'birthday',
    shortDescription: 'A glamorous teenage birthday party with DJ, photo booth, and custom décor.',
    description:
      "Turn 16 in style with our Sweet Sixteen Celebration package. Perfect for teenage parties, this package includes a professional DJ, an Instagram-worthy neon-lit photo booth, customized banners, and a chic dessert table. We also manage venue styling, lighting effects, and a live MC to keep the energy high all night.",
    price: 45000,
    capacity: 80,
    duration: '5 hours',
    inclusions: ['Professional DJ', 'Neon Photo Booth', 'Custom Banners & Signage', 'Dessert Table', 'Venue Styling', 'LED Lighting Effects', 'Live MC'],
    images: [
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800',
      'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=800',
    ],
    isFeatured: false,
    isActive: true,
  },

  // ── Wedding ───────────────────────────────────────────────
  {
    title: 'Royal Wedding Package',
    slug: 'royal-wedding-package',
    category: 'wedding',
    shortDescription: 'A grand, opulent wedding with floral elegance, royal catering, and live music.',
    description:
      "Experience a fairy-tale wedding with our Royal Wedding Package. We orchestrate every detail — from a majestic floral mandap and premium catering for up to 500 guests to a live classical music ensemble and a professional photo-video team. Includes bridal suite setup, elegant table arrangements, and a honeymoon suite decoration.",
    price: 750000,
    capacity: 500,
    duration: '2 days',
    inclusions: ['Majestic Floral Mandap', 'Premium Multi-Cuisine Catering', 'Live Classical Music', 'Professional Photography & Videography', 'Bridal Suite Setup', 'Elegant Table Arrangements', 'Honeymoon Suite Décor', 'Dedicated Wedding Planner'],
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800',
    ],
    isFeatured: true,
    isActive: true,
  },
  {
    title: 'Intimate Wedding Package',
    slug: 'intimate-wedding-package',
    category: 'wedding',
    shortDescription: 'A cozy, romantic wedding for close family and friends with personalized touches.',
    description:
      "Celebrate love in an intimate setting with our Intimate Wedding Package. Designed for small, heartfelt ceremonies, this package offers a beautiful garden or indoor setup for up to 80 guests, a curated menu, a solo singer/guitarist, and a dedicated photographer. Personalized vows, custom invitations, and a floral arch are included.",
    price: 180000,
    capacity: 80,
    duration: '6 hours',
    inclusions: ['Garden or Indoor Venue Setup', 'Curated Menu (3 Courses)', 'Solo Musician', 'Professional Photography', 'Floral Arch', 'Custom Invitations', 'Event Coordinator'],
    images: [
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800',
      'https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=800',
    ],
    isFeatured: false,
    isActive: true,
  },
  {
    title: 'Engagement & Ring Ceremony',
    slug: 'engagement-ring-ceremony',
    category: 'wedding',
    shortDescription: 'A romantic engagement ceremony setup with floral décor, catering, and photography.',
    description:
      "Begin your love story beautifully with our Engagement & Ring Ceremony package. Perfect for announcing your commitment in style, this includes a floral stage setup, welcome drinks, a curated dinner menu for up to 150 guests, a photo booth, and a professional photographer to capture every precious moment.",
    price: 95000,
    capacity: 150,
    duration: '4 hours',
    inclusions: ['Floral Stage Setup', 'Welcome Drinks', 'Curated Dinner Menu', 'Photo Booth', 'Professional Photography', 'Event Coordinator', 'Custom Cake'],
    images: [
      'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    ],
    isFeatured: true,
    isActive: true,
  },

  // ── Corporate ─────────────────────────────────────────────
  {
    title: 'Corporate Seminar Package',
    slug: 'corporate-seminar-package',
    category: 'corporate',
    shortDescription: 'A professional seminar setup with AV equipment, catering, and branding support.',
    description:
      "Execute a flawless corporate seminar with our comprehensive package. We provide a professional stage and podium setup, high-end AV equipment (projectors, mics, LED screens), branded backdrop, dedicated registration desk, professional catering for tea/lunch breaks, and a full technical support team throughout the event.",
    price: 85000,
    capacity: 200,
    duration: '8 hours',
    inclusions: ['Stage & Podium Setup', 'AV Equipment (Projector, LED Screen, Mics)', 'Branded Backdrop', 'Registration Desk Setup', 'Professional Catering (Tea + Lunch)', 'Technical Support Team', 'Stationery Kits'],
    images: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800',
    ],
    isFeatured: false,
    isActive: true,
  },
  {
    title: 'Product Launch Package',
    slug: 'product-launch-package',
    category: 'corporate',
    shortDescription: 'High-impact product launch event with stage, PR support, media wall, and catering.',
    description:
      "Make your product launch memorable with our end-to-end event management. This package includes an impressive stage design, professional media wall, media kits, celebrity/influencer coordination support, live streaming setup, cocktail catering, and comprehensive photography & videography — ensuring maximum visibility and impact.",
    price: 250000,
    capacity: 300,
    duration: '6 hours',
    inclusions: ['Custom Stage Design', 'Professional Media Wall', 'Live Streaming Setup', 'Cocktail Catering', 'Photography & Videography', 'Influencer Coordination Support', 'Event MC'],
    images: [
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
    ],
    isFeatured: true,
    isActive: true,
  },
  {
    title: 'Team Offsite & Annual Day',
    slug: 'team-offsite-annual-day',
    category: 'corporate',
    shortDescription: 'A fun-filled annual day or team offsite with activities, awards, and dinner.',
    description:
      "Celebrate your team's achievements and build stronger bonds with our Team Offsite & Annual Day package. We organize energizing team-building activities, a formal awards ceremony, a themed dinner, a DJ night, and a photo booth. We handle venue selection, transportation logistics, and all décor to create a memorable corporate celebration.",
    price: 150000,
    capacity: 250,
    duration: '10 hours',
    inclusions: ['Team Building Activities', 'Awards Ceremony Setup', 'Themed Dinner', 'DJ Night', 'Photo Booth', 'Transportation Coordination', 'Complete Venue Décor'],
    images: [
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800',
    ],
    isFeatured: false,
    isActive: true,
  },

  // ── Anniversary ───────────────────────────────────────────
  {
    title: 'Golden Anniversary Gala',
    slug: 'golden-anniversary-gala',
    category: 'anniversary',
    shortDescription: 'A grand golden anniversary celebration with floral elegance and fine dining.',
    description:
      "Honor a lifetime of love with our Golden Anniversary Gala. This premium package features a stunning gold-themed decoration, floral centrepieces, a personalized photo slideshow, a live singer, five-course fine dining for up to 100 guests, and a professional photography team to preserve every beautiful moment.",
    price: 120000,
    capacity: 100,
    duration: '5 hours',
    inclusions: ['Gold-Themed Decoration', 'Floral Centrepieces', 'Personalized Photo Slideshow', 'Live Singer', 'Five-Course Fine Dining', 'Professional Photography', 'Custom Anniversary Cake'],
    images: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
    ],
    isFeatured: false,
    isActive: true,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Package.deleteMany({});
    await Admin.deleteMany({});
    console.log('Cleared existing packages and admins.');

    // Create admin
    const admin = await Admin.create({
      name: process.env.ADMIN_NAME || 'EventHive Admin',
      email: process.env.ADMIN_EMAIL || 'admin@eventhive.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@12345',
    });
    console.log(`Admin created: ${admin.email}`);

    // Insert packages
    const inserted = await Package.insertMany(packages);
    console.log(`${inserted.length} packages inserted.`);

    console.log('\n✅ Seed completed successfully!');
    console.log(`   Admin email:    ${admin.email}`);
    console.log(`   Admin password: ${process.env.ADMIN_PASSWORD || 'Admin@12345'}`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDB();

