const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const api = {
  async startAssessment(userSeed?: string, assessmentType: string = 'core') {
    const response = await fetch(`${API_BASE_URL}/start-assessment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_seed: userSeed,
        assessment_type: assessmentType
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to start assessment');
    }
    
    return response.json();
  },
  
  async submitAssessment(responses: any[], assessmentTypes: string[] = ['core']) {
    const response = await fetch(`${API_BASE_URL}/submit-assessment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        responses,
        assessment_types: assessmentTypes
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit assessment');
    }
    
    return response.json();
  },
};