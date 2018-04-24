export const getEventById = (id, events) => {
    return events.find(e => e._id === id);
  };