const CampusLocation = require('../models/CampusLocation');

const seedLocations = async () => {
  try {
    const count = await CampusLocation.countDocuments();
    if (count > 0) {
      console.log('Campus locations already seeded. Total:', count);
      return;
    }

    const locations = [
      // Academic
      { name: 'Building 1 Fashion Block', category: 'Academic', nearbyLocations: ['Business Block', 'Uni Mall', 'Food Buzz'], popularityScore: 85, activeRoutes: 4, iconType: 'GraduationCap' },
      { name: 'Business Block', category: 'Academic', nearbyLocations: ['Building 1 Fashion Block', 'Robo Park'], popularityScore: 75, activeRoutes: 3, iconType: 'GraduationCap' },
      { name: 'Pharmacy Block', category: 'Academic', nearbyLocations: ['Hospital', 'Robo Park'], popularityScore: 70, activeRoutes: 2, iconType: 'GraduationCap' },
      { name: 'Robo Park', category: 'Academic', nearbyLocations: ['Pharmacy Block', 'Business Block'], popularityScore: 90, activeRoutes: 5, iconType: 'GraduationCap' },
      { name: 'Uni Auditorium', category: 'Academic', nearbyLocations: ['Main Gate', 'Unipolis'], popularityScore: 80, activeRoutes: 3, iconType: 'GraduationCap' },

      // Health
      { name: 'Hospital', category: 'Health', nearbyLocations: ['Pharmacy Block', 'Food Stalls Near Hospital'], popularityScore: 95, activeRoutes: 6, iconType: 'HeartPulse' },
      { name: 'Food Stalls Near Hospital', category: 'Food', nearbyLocations: ['Hospital', 'Pharmacy Block'], popularityScore: 80, activeRoutes: 3, iconType: 'Utensils' },

      // Girls Hostels
      { name: 'GH-1', category: 'Hostels', nearbyLocations: ['GH-2', 'Uni Mall'], popularityScore: 70, activeRoutes: 2, iconType: 'Home' },
      { name: 'GH-2', category: 'Hostels', nearbyLocations: ['GH-1', 'GH-3'], popularityScore: 65, activeRoutes: 1, iconType: 'Home' },
      { name: 'GH-3', category: 'Hostels', nearbyLocations: ['GH-2', 'GH-4', 'Unipolis'], popularityScore: 75, activeRoutes: 3, iconType: 'Home' },
      { name: 'GH-4', category: 'Hostels', nearbyLocations: ['GH-3', 'GH-5'], popularityScore: 60, activeRoutes: 2, iconType: 'Home' },
      { name: 'GH-5', category: 'Hostels', nearbyLocations: ['GH-4', 'GH-6'], popularityScore: 65, activeRoutes: 1, iconType: 'Home' },
      { name: 'GH-6', category: 'Hostels', nearbyLocations: ['GH-5', 'Main Gate'], popularityScore: 70, activeRoutes: 2, iconType: 'Home' },

      // Boys Hostels
      { name: 'BH-1', category: 'Hostels', nearbyLocations: ['BH-2', 'Food Stalls Near BH-1'], popularityScore: 70, activeRoutes: 2, iconType: 'Home' },
      { name: 'BH-2', category: 'Hostels', nearbyLocations: ['BH-1', 'BH-3'], popularityScore: 65, activeRoutes: 1, iconType: 'Home' },
      { name: 'BH-3', category: 'Hostels', nearbyLocations: ['BH-2', 'BH-4', 'Uni Mall'], popularityScore: 80, activeRoutes: 4, iconType: 'Home' },
      { name: 'BH-4', category: 'Hostels', nearbyLocations: ['BH-3', 'BH-5'], popularityScore: 60, activeRoutes: 1, iconType: 'Home' },
      { name: 'BH-5', category: 'Hostels', nearbyLocations: ['BH-4', 'BH-6', 'Unipolis'], popularityScore: 85, activeRoutes: 5, iconType: 'Home' },
      { name: 'BH-6', category: 'Hostels', nearbyLocations: ['BH-5', 'BH-7'], popularityScore: 60, activeRoutes: 2, iconType: 'Home' },
      { name: 'BH-7', category: 'Hostels', nearbyLocations: ['BH-6', 'BH-8'], popularityScore: 65, activeRoutes: 1, iconType: 'Home' },
      { name: 'BH-8', category: 'Hostels', nearbyLocations: ['BH-7', 'BH-9'], popularityScore: 60, activeRoutes: 2, iconType: 'Home' },
      { name: 'BH-9', category: 'Hostels', nearbyLocations: ['BH-8', 'BH-10'], popularityScore: 65, activeRoutes: 1, iconType: 'Home' },
      { name: 'BH-10', category: 'Hostels', nearbyLocations: ['BH-9', 'Food Stalls Near Apartment'], popularityScore: 70, activeRoutes: 3, iconType: 'Home' },

      // Food & Social
      { name: 'Food Buzz', category: 'Food', nearbyLocations: ['Building 1 Fashion Block', 'Uni Mall'], popularityScore: 90, activeRoutes: 5, iconType: 'Utensils' },
      { name: 'Uni Mall', category: 'Social', nearbyLocations: ['Food Buzz', 'GH-1', 'BH-3', 'Unipolis'], popularityScore: 100, activeRoutes: 12, iconType: 'Sparkles' },
      { name: 'Unipolis', category: 'Social', nearbyLocations: ['Uni Mall', 'GH-3', 'BH-5', 'Uni Auditorium'], popularityScore: 95, activeRoutes: 8, iconType: 'Sparkles' },
      { name: 'Food Stalls Near Apartment', category: 'Food', nearbyLocations: ['BH-10', 'Main Gate'], popularityScore: 75, activeRoutes: 3, iconType: 'Utensils' },
      { name: 'Food Stalls Near BH-1', category: 'Food', nearbyLocations: ['BH-1', 'BH-2'], popularityScore: 80, activeRoutes: 4, iconType: 'Utensils' },

      // Entry
      { name: 'Main Gate', category: 'Entry', nearbyLocations: ['GH-6', 'Food Stalls Near Apartment', 'Uni Auditorium'], popularityScore: 98, activeRoutes: 15, iconType: 'LogOut' }
    ];

    await CampusLocation.insertMany(locations);
    console.log('🎉 Predefined campus locations seeded successfully! Total:', locations.length);
  } catch (error) {
    console.error('Error seeding campus locations:', error);
  }
};

module.exports = seedLocations;
