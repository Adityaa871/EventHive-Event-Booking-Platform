const Package = require('../models/Package');

/**
 * Intelligent rule-based fallback when external Gemini API is not configured or offline.
 */
const generateFallbackResponse = (message, packages, userPreferences = {}) => {
  const query = message.toLowerCase();
  const matched = [];

  const targetCategory = userPreferences.occasion?.toLowerCase() || '';
  const targetBudget = Number(userPreferences.budget) || 0;
  const targetGuests = Number(userPreferences.guestCount) || 0;

  packages.forEach((pkg) => {
    let score = 0;
    if (targetCategory && pkg.category?.toLowerCase() === targetCategory) score += 4;
    if (query.includes(pkg.category?.toLowerCase())) score += 3;
    if (targetBudget > 0 && pkg.price <= targetBudget) score += 3;
    if (targetGuests > 0 && (!pkg.capacity || pkg.capacity >= targetGuests)) score += 2;
    if (query.includes(pkg.title.toLowerCase())) score += 5;

    matched.push({ pkg, score });
  });

  matched.sort((a, b) => b.score - a.score);
  const topPackages = matched.slice(0, 3).map((m) => m.pkg);

  let reply = `Here are tailored recommendations from our EventHive catalog:\n\n`;

  if (topPackages.length > 0) {
    topPackages.forEach((p, idx) => {
      reply += `${idx + 1}. **${p.title}** (₹${p.price.toLocaleString('en-IN')})\n`;
      reply += `   • *Category:* ${p.category.toUpperCase()}\n`;
      reply += `   • *Guest Capacity:* Up to ${p.capacity || 'Flexible'} attendees\n`;
      reply += `   • *Key Deliverables:* ${p.inclusions?.slice(0, 4).join(', ') || 'Custom setup'}\n`;
      reply += `   • *Summary:* ${p.shortDescription}\n\n`;
    });
    reply += `💡 **Customization Tip:** You can customize styling, dietary catering requirements, and venue duration during booking.\n\n`;
    reply += `Would you like me to guide you through scheduling one of these packages, or refine the search by budget and headcount?`;
  } else {
    reply = `Thank you for sharing your event vision! Based on our catalog, we offer comprehensive packages across Weddings, Corporate Conferences, Birthdays, and Anniversaries. Could you share your expected guest count, target occasion date, or budget so I can recommend the perfect match?`;
  }

  return {
    reply,
    recommendedPackages: topPackages.map((p) => ({
      _id: p._id,
      title: p.title,
      price: p.price,
      category: p.category,
      capacity: p.capacity,
      slug: p.slug,
    })),
  };
};

/**
 * Handle AI assistant queries with Gemini grounding or intelligent fallback
 */
const getEventSuggestions = async ({ message, history = [], userPreferences = {} }) => {
  // Fetch active packages for grounding
  const activePackages = await Package.find({ isActive: true })
    .select('title category price capacity shortDescription inclusions slug')
    .lean();

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return generateFallbackResponse(message, activePackages, userPreferences);
  }

  try {
    const packagesCatalogContext = activePackages
      .map(
        (p) =>
          `ID: ${p._id} | Title: "${p.title}" | Category: ${p.category} | Price: ₹${p.price} | Capacity: ${p.capacity || 'Flexible'} | Deliverables: ${p.inclusions.join(', ')} | Summary: ${p.shortDescription}`
      )
      .join('\n');

    const systemPrompt = `You are the EventHive AI Event Planning Assistant, an expert, professional, and courteous event concierge.
Your role is to guide clients in organizing memorable occasions (Weddings, Corporate Galas, Birthdays, Anniversaries).
CRITICAL RULES:
1. ONLY recommend packages that exist in the Grounded Packages Catalog provided below. NEVER invent packages, fake prices, or non-existent features.
2. If a user asks for suggestions within a budget, guest count, or occasion, match them to the catalog packages.
3. Suggest tasteful customization ideas (lighting, guest flow, sound, themes).
4. Keep responses crisp, polite, well-structured, using markdown bullet points.

GROUNDED PACKAGES CATALOG:
${packagesCatalogContext}

Client Occasion Preferences: ${JSON.stringify(userPreferences)}
`;

    const contents = [
      {
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\nClient inquiry: ${message}` }],
      },
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!replyText) {
      throw new Error('No response text from Gemini');
    }

    // Match recommended packages mentioned in response
    const recommended = activePackages.filter((p) =>
      replyText.toLowerCase().includes(p.title.toLowerCase())
    );

    return {
      reply: replyText,
      recommendedPackages: recommended.slice(0, 3).map((p) => ({
        _id: p._id,
        title: p.title,
        price: p.price,
        category: p.category,
        capacity: p.capacity,
        slug: p.slug,
      })),
    };
  } catch (err) {
    console.warn('[AI Service Fallback Triggered]:', err.message);
    return generateFallbackResponse(message, activePackages, userPreferences);
  }
};

module.exports = { getEventSuggestions };
