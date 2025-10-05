// services/databaseService.js
const supabase = require('../supabase');

class DatabaseService {
  // Get accommodations based on preferences
  async getAccommodations(preferences) {
    try {
      let query = supabase
        .from('accommodations')
        .select('*');

      // Add filters based on preferences
      if (preferences.budget) {
        if (preferences.budget.toLowerCase().includes('budget')) {
          query = query.lte('price_range', 'R500');
        } else if (preferences.budget.toLowerCase().includes('luxury')) {
          query = query.gte('price_range', 'R1000');
        }
      }

      if (preferences.travelStyle) {
        if (preferences.travelStyle.toLowerCase().includes('eco')) {
          query = query.gte('sustainability_rating', 4);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching accommodations:', error);
      return [];
    }
  }

  // Get restaurants based on preferences
  async getRestaurants(preferences) {
    try {
      let query = supabase
        .from('restaurants')
        .select('*');

      if (preferences.interests) {
        const interests = preferences.interests.toLowerCase();
        if (interests.includes('food')) {
          query = query.in('cuisine_type', ['local', 'organic', 'farm-to-table']);
        }
      }

      const { data, error } = await query.limit(3);
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      return [];
    }
  }

  // Get activities based on preferences
  async getActivities(preferences) {
    try {
      let query = supabase
        .from('activities')
        .select('*');

      if (preferences.interests) {
        const interests = preferences.interests.toLowerCase();
        if (interests.includes('adventure')) {
          query = query.in('activity_type', ['hiking', 'adventure', 'outdoor']);
        } else if (interests.includes('culture')) {
          query = query.in('activity_type', ['cultural', 'historical', 'art']);
        } else if (interests.includes('nature')) {
          query = query.in('activity_type', ['nature', 'wildlife', 'eco']);
        }
      }

      const { data, error } = await query.limit(3);
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  }

  // Get eco-reads based on preferences
  async getEcoReads(preferences) {
    try {
      let query = supabase
        .from('eco_reads')
        .select('*');

      if (preferences.interests) {
        const interests = preferences.interests.toLowerCase();
        if (interests.includes('culture')) {
          query = query.in('read_type', ['cultural', 'historical', 'heritage']);
        }
      }

      const { data, error } = await query.limit(3);
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching eco-reads:', error);
      return [];
    }
  }

  // Get all recommendations in one call
  async getAllRecommendations(preferences) {
    try {
      const [accommodations, restaurants, activities, ecoReads] = await Promise.all([
        this.getAccommodations(preferences),
        this.getRestaurants(preferences),
        this.getActivities(preferences),
        this.getEcoReads(preferences)
      ]);

      return {
        accommodations,
        restaurants,
        activities,
        ecoReads
      };
    } catch (error) {
      console.error('Error fetching all recommendations:', error);
      return { accommodations: [], restaurants: [], activities: [], ecoReads: [] };
    }
  }
}

module.exports = new DatabaseService();