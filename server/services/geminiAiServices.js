// services/geminiService.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const databaseService = require('./databaseService');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async generateItinerary(preferences) {
    try {
      // First, get real data from database
      const recommendations = await databaseService.getAllRecommendations(preferences);
      
      // Use Gemini to curate and enhance the itinerary
      const prompt = this.buildItineraryPrompt(preferences, recommendations);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseAndEnhanceItinerary(text, recommendations, preferences);
    } catch (error) {
      console.error('Error generating itinerary with Gemini:', error);
      // Fallback to database data only
      return this.generateItineraryFromDatabase(preferences);
    }
  }

  buildItineraryPrompt(preferences, recommendations) {
    return `
You are Terrabook, an AI travel assistant specializing in sustainable, eco-friendly travel experiences. 
I have these real recommendations from my database. Please curate them into a cohesive 3-day itinerary:

DESTINATION: ${preferences.destination || 'Not specified'}
DURATION: ${preferences.duration || '3 nights'}
BUDGET: ${preferences.budget || 'Moderate'}
INTERESTS: ${preferences.interests || 'General tourism'}

REAL ACCOMMODATIONS AVAILABLE:
${recommendations.accommodations.map(acc => `- ${acc.name}: ${acc.description} (${acc.price_range})`).join('\n')}

REAL RESTAURANTS AVAILABLE:
${recommendations.restaurants.map(res => `- ${res.name}: ${res.cuisine_type} cuisine (${res.price_range})`).join('\n')}

REAL ACTIVITIES AVAILABLE:
${recommendations.activities.map(act => `- ${act.name}: ${act.activity_type} (${act.price})`).join('\n')}

REAL ECO-READS AVAILABLE:
${recommendations.ecoReads.map(read => `- ${read.name}: ${read.read_type} (${read.price})`).join('\n')}

Please create a logical 3-day itinerary using these real options. Assign activities to appropriate times of day and ensure geographical logic. Return as JSON structure with days containing time slots and assigned activities.
    `;
  }

  parseAndEnhanceItinerary(geminiResponse, recommendations, preferences) {
    try {
      // Parse Gemini's structured response and map to real database items
      const curatedItinerary = this.mapGeminiResponseToDatabaseItems(geminiResponse, recommendations);
      return curatedItinerary;
    } catch (error) {
      console.error('Error parsing Gemini response, using database items directly:', error);
      return this.generateItineraryFromDatabase(preferences);
    }
  }

  generateItineraryFromDatabase(preferences) {
    return databaseService.getAllRecommendations(preferences)
      .then(recommendations => {
        return this.transformDatabaseItemsToItinerary(recommendations, preferences);
      });
  }

  transformDatabaseItemsToItinerary(recommendations, preferences) {
    const itineraryItems = [];
    let idCounter = 1;

    // Accommodation (primary)
    if (recommendations.accommodations.length > 0) {
      const accommodation = recommendations.accommodations[0];
      itineraryItems.push({
        id: idCounter.toString(),
        type: 'accommodation',
        name: accommodation.name,
        description: accommodation.description,
        price: accommodation.price_range,
        rating: parseFloat(accommodation.rating),
        walkingDistance: accommodation.walking_distance || 'Your base',
        image: accommodation.image_url || '/placeholder.svg',
        day: 1,
        databaseId: accommodation.id
      });
      idCounter++;
    }

    // Restaurants (spread across days)
    recommendations.restaurants.forEach((restaurant, index) => {
      itineraryItems.push({
        id: idCounter.toString(),
        type: 'restaurant',
        name: restaurant.name,
        description: restaurant.description,
        price: restaurant.price_range,
        rating: parseFloat(restaurant.rating),
        walkingDistance: restaurant.walking_distance,
        image: restaurant.image_url || '/placeholder.svg',
        time: '13:00',
        day: (index % 3) + 1,
        databaseId: restaurant.id
      });
      idCounter++;
    });

    // Activities (spread across days)
    recommendations.activities.forEach((activity, index) => {
      itineraryItems.push({
        id: idCounter.toString(),
        type: 'activity',
        name: activity.name,
        description: activity.description,
        price: activity.price,
        rating: parseFloat(activity.rating),
        walkingDistance: activity.walking_distance,
        image: activity.image_url || '/placeholder.svg',
        time: '09:00',
        day: (index % 3) + 1,
        databaseId: activity.id
      });
      idCounter++;
    });

    // Eco-reads (spread across days)
    recommendations.ecoReads.forEach((ecoRead, index) => {
      itineraryItems.push({
        id: idCounter.toString(),
        type: 'eco-read',
        name: ecoRead.name,
        description: ecoRead.description,
        price: ecoRead.price,
        rating: parseFloat(ecoRead.rating),
        walkingDistance: ecoRead.walking_distance,
        image: ecoRead.image_url || '/placeholder.svg',
        time: '19:00',
        day: (index % 3) + 1,
        databaseId: ecoRead.id
      });
      idCounter++;
    });

    return itineraryItems;
  }
}

module.exports = new GeminiService();