const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const api = {
  async startAssessment() {
    const response = await fetch(`${API_BASE_URL}/start-assessment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to start assessment');
    }
    
    return response.json();
  },
  
  async submitAssessment(responses: any[]) {
    const response = await fetch(`${API_BASE_URL}/submit-assessment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ responses }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit assessment');
    }
    
    return response.json();
  },
};