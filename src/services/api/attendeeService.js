import mockAttendees from '@/services/mockData/attendees.json';

const attendeeService = {
  getAll: async (userId = null) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    // In a real app, this would check user permissions
    return [...mockAttendees];
  },

getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Validate ID is an integer
    const attendeeId = parseInt(id);
    if (isNaN(attendeeId) || attendeeId <= 0) {
      throw new Error('Invalid attendee ID');
    }
    
    const attendee = mockAttendees.find(a => a.Id === attendeeId);
    if (!attendee) {
      throw new Error('Attendee not found');
    }
    return { ...attendee };
  },

  getByEventId: async (eventId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockAttendees.filter(a => a.eventId === eventId);
  },

create: async (attendeeData, userId = 1) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Validate required fields
    if (!attendeeData.eventId || !attendeeData.customData) {
      throw new Error('Missing required attendee data');
    }
    
    // Generate new ID
    const newId = mockAttendees.length > 0 ? Math.max(...mockAttendees.map(a => a.Id)) + 1 : 1;
    
    const newAttendee = {
      ...attendeeData,
      Id: newId,
      createdBy: userId,
      createdAt: new Date().toISOString()
    };
    
    mockAttendees.push(newAttendee);
    return { ...newAttendee };
  },

update: async (id, attendeeData, userId = 1) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Validate ID is an integer
    const attendeeId = parseInt(id);
    if (isNaN(attendeeId) || attendeeId <= 0) {
      throw new Error('Invalid attendee ID');
    }
    
    const index = mockAttendees.findIndex(a => a.Id === attendeeId);
    if (index === -1) {
      throw new Error('Attendee not found');
    }
    
    const updatedAttendee = { 
      ...mockAttendees[index], 
      ...attendeeData, 
      Id: attendeeId, // Ensure ID cannot be changed
      updatedBy: userId,
      updatedAt: new Date().toISOString()
    };
    
    mockAttendees[index] = updatedAttendee;
    return { ...updatedAttendee };
  },

delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Validate ID is an integer
    const attendeeId = parseInt(id);
    if (isNaN(attendeeId) || attendeeId <= 0) {
      throw new Error('Invalid attendee ID');
    }
    
    const index = mockAttendees.findIndex(a => a.Id === attendeeId);
    if (index === -1) {
      throw new Error('Attendee not found');
    }
    
    mockAttendees.splice(index, 1);
    return true;
  }
};

export default attendeeService;