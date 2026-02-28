import axios from "axios";
import API_URL from "../config/api";

export const getVisitorId = () => {
  let visitorId = localStorage.getItem("visitor_id");
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("visitor_id", visitorId);
  }
  return visitorId;
};

export const trackPageView = async (pageUrl) => {
  try {
    const visitorId = getVisitorId();
    await axios.post(`${API_URL}/analytics/page-view`, {
      page_url: pageUrl,
      visitor_id: visitorId,
    });
  } catch (error) {
    // Silently fail - don't disrupt UX
  }
};

export const trackEvent = async (eventType, eventData = {}) => {
  try {
    await axios.post(`${API_URL}/analytics/event`, {
      event_type: eventType,
      event_data: eventData,
    });
  } catch (error) {
    // Silently fail
  }
};

export const trackProjectView = async (projectId) => {
  try {
    await axios.post(`${API_URL}/projects/${projectId}/view`);
  } catch (error) {
    // Silently fail
  }
};

export const useAnalytics = () => {
  const trackPage = (pageUrl) => trackPageView(pageUrl);
  const trackCustomEvent = (eventType, data) => trackEvent(eventType, data);
  const trackProject = (projectId) => trackProjectView(projectId);

  return { trackPage, trackCustomEvent, trackProject };
};
