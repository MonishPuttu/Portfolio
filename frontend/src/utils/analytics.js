import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Generate or retrieve visitor ID
export const getVisitorId = () => {
  let visitorId = localStorage.getItem('visitor_id');
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('visitor_id', visitorId);
  }
  return visitorId;
};

// Track page view
export const trackPageView = async (pageUrl) => {
  try {
    const visitorId = getVisitorId();
    await axios.post(`${API_URL}/analytics/page-view`, {
      page_url: pageUrl,
      visitor_id: visitorId,
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
};

// Track custom event
export const trackEvent = async (eventType, eventData = {}) => {
  try {
    await axios.post(`${API_URL}/analytics/event`, {
      event_type: eventType,
      event_data: eventData,
    });
  } catch (error) {
    console.error('Event tracking error:', error);
  }
};

// Track project view
export const trackProjectView = async (projectId) => {
  try {
    await axios.post(`${API_URL}/projects/${projectId}/view`);
  } catch (error) {
    console.error('Project view tracking error:', error);
  }
};

// Hook for analytics
export const useAnalytics = () => {
  const trackPage = (pageUrl) => trackPageView(pageUrl);
  const trackCustomEvent = (eventType, data) => trackEvent(eventType, data);
  const trackProject = (projectId) => trackProjectView(projectId);

  return {
    trackPage,
    trackCustomEvent,
    trackProject,
  };
};
