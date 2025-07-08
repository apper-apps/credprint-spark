const attendeeService = {
  getAll: async () => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "photo_url" } },
          { field: { Name: "custom_data" } },
          { field: { Name: "print_status" } },
          { field: { Name: "created_at" } },
          { field: { Name: "event_id" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('attendee', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendees:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const attendeeId = parseInt(id);
      if (isNaN(attendeeId) || attendeeId <= 0) {
        throw new Error('Invalid attendee ID');
      }
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "photo_url" } },
          { field: { Name: "custom_data" } },
          { field: { Name: "print_status" } },
          { field: { Name: "created_at" } },
          { field: { Name: "event_id" } }
        ]
      };
      
      const response = await apperClient.getRecordById('attendee', attendeeId, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching attendee with ID ${id}:`, error);
      throw error;
    }
  },

  getByEventId: async (eventId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "photo_url" } },
          { field: { Name: "custom_data" } },
          { field: { Name: "print_status" } },
          { field: { Name: "created_at" } },
          { field: { Name: "event_id" } }
        ],
        where: [
          {
            FieldName: "event_id",
            Operator: "EqualTo",
            Values: [eventId]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('attendee', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendees for event:", error);
      throw error;
    }
  },

  create: async (attendeeData) => {
    try {
      if (!attendeeData.eventId || !attendeeData.customData) {
        throw new Error('Missing required attendee data');
      }
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields according to database schema
      const params = {
        records: [{
          Name: attendeeData.customData.name || '',
          photo_url: attendeeData.photoUrl || '',
          custom_data: JSON.stringify(attendeeData.customData),
          print_status: attendeeData.printStatus || 'not-printed',
          created_at: new Date().toISOString(),
          event_id: attendeeData.eventId
        }]
      };
      
      const response = await apperClient.createRecord('attendee', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create attendee');
        }
        
        return successfulRecords[0].data;
      }
    } catch (error) {
      console.error("Error creating attendee:", error);
      throw error;
    }
  },

  update: async (id, attendeeData) => {
    try {
      const attendeeId = parseInt(id);
      if (isNaN(attendeeId) || attendeeId <= 0) {
        throw new Error('Invalid attendee ID');
      }
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields according to database schema
      const params = {
        records: [{
          Id: attendeeId,
          Name: attendeeData.customData?.name || attendeeData.Name || '',
          photo_url: attendeeData.photoUrl || attendeeData.photo_url || '',
          custom_data: JSON.stringify(attendeeData.customData || {}),
          print_status: attendeeData.printStatus || attendeeData.print_status || 'not-printed',
          event_id: attendeeData.eventId || attendeeData.event_id
        }]
      };
      
      const response = await apperClient.updateRecord('attendee', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error(failedUpdates[0].message || 'Failed to update attendee');
        }
        
        return successfulUpdates[0].data;
      }
    } catch (error) {
      console.error("Error updating attendee:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const attendeeId = parseInt(id);
      if (isNaN(attendeeId) || attendeeId <= 0) {
        throw new Error('Invalid attendee ID');
      }
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [attendeeId]
      };
      
      const response = await apperClient.deleteRecord('attendee', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || 'Failed to delete attendee');
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting attendee:", error);
      throw error;
    }
  }
};

export default attendeeService;