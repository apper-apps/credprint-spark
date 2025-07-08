const eventService = {
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
          { field: { Name: "date" } },
          { field: { Name: "location" } },
          { field: { Name: "schema" } },
          { field: { Name: "created_at" } },
          { field: { Name: "template_id" } }
        ],
        orderBy: [
          { fieldName: "created_at", sorttype: "DESC" }
        ]
      };
      
      const response = await apperClient.fetchRecords('event', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date" } },
          { field: { Name: "location" } },
          { field: { Name: "schema" } },
          { field: { Name: "created_at" } },
          { field: { Name: "template_id" } }
        ]
      };
      
      const response = await apperClient.getRecordById('event', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching event with ID ${id}:`, error);
      throw error;
    }
  },

  create: async (eventData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields according to database schema
      const params = {
        records: [{
          Name: eventData.name,
          date: eventData.date,
          location: eventData.location,
          schema: JSON.stringify(eventData.schema),
          created_at: new Date().toISOString(),
          template_id: eventData.templateId || null
        }]
      };
      
      const response = await apperClient.createRecord('event', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create event');
        }
        
        return successfulRecords[0].data;
      }
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  },

  update: async (id, eventData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields according to database schema
      const params = {
        records: [{
          Id: id,
          Name: eventData.name,
          date: eventData.date,
          location: eventData.location,
          schema: JSON.stringify(eventData.schema),
          template_id: eventData.templateId || null
        }]
      };
      
      const response = await apperClient.updateRecord('event', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error(failedUpdates[0].message || 'Failed to update event');
        }
        
        return successfulUpdates[0].data;
      }
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [id]
      };
      
      const response = await apperClient.deleteRecord('event', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || 'Failed to delete event');
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  }
};

export default eventService;