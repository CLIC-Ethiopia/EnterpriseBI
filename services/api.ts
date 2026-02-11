import { DepartmentData } from '../types';

// ==============================================================================
// CONFIGURATION: PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
// ==============================================================================
const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbyw_0XPQb-w9odlgW3gP3S2MV1dkccAHFknNXhrYW6WKuFPmaeSPEpaPbo_AcmVphvP7Q/exec'; 

export const fetchDepartments = async (): Promise<DepartmentData[] | null> => {
  // If URL is missing, return null to fallback immediately
  if (!GAS_API_URL) {
    console.warn("Google Apps Script URL is empty. Using local fallback data.");
    return null;
  }
  
  try {
    const response = await fetch(`${GAS_API_URL}?action=getAllDepartments`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
    }
    
    // Check if the content type is JSON before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
       const text = await response.text();
       // Often Google Scripts return HTML error pages on failure (e.g. 404/Permissions)
       throw new Error(`Expected JSON but got ${contentType}. Response preview: ${text.substring(0, 100)}...`);
    }
    
    const json = await response.json();
    
    if (json.status === 'success') {
      return json.data;
    } else {
      throw new Error(json.message || 'API returned an error');
    }
  } catch (error) {
    console.error("Failed to fetch departments from Google Sheets. Falling back to local data.", error);
    // Return null to trigger fallback to local data
    return null;
  }
};