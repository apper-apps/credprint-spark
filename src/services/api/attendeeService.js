import mockAttendees from '@/services/mockData/attendees.json';

const attendeeService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockAttendees];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const attendee = mockAttendees.find(a => a.Id === id);
    if (!attendee) {
      throw new Error('Attendee not found');
    }
    return { ...attendee };
  },

  getByEventId: async (eventId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockAttendees.filter(a => a.eventId === eventId);
  },

  create: async (attendeeData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newAttendee = {
      ...attendeeData,
      Id: Math.max(...mockAttendees.map(a => a.Id)) + 1
    };
    mockAttendees.push(newAttendee);
    return { ...newAttendee };
  },

  update: async (id, attendeeData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockAttendees.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error('Attendee not found');
    }
    const updatedAttendee = { ...mockAttendees[index], ...attendeeData, Id: id };
    mockAttendees[index] = updatedAttendee;
    return { ...updatedAttendee };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockAttendees.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error('Attendee not found');
    }
    mockAttendees.splice(index, 1);
    return true;
  }
};

export default attendeeService;