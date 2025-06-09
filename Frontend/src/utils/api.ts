export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
export const AUTH_API_BASE_URL = process.env.REACT_APP_AUTH_API_URL || 'http://localhost:8001/api';

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

  // Premium assessment methods
  async startPremiumAssessment(assessmentType: string) {
    return this.startAssessment(undefined, assessmentType);
  },

  async submitPremiumAssessment(assessmentType: string, data: any) {
    return this.submitAssessment(data.responses, [assessmentType]);
  },

  // Payment methods (placeholder)
  async createPaymentIntent() {
    const response = await fetch(`${AUTH_API_BASE_URL}/payment/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    return response.json();
  },

  async confirmPurchase(paymentIntentId: string) {
    const response = await fetch(`${AUTH_API_BASE_URL}/payment/confirm-purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({ paymentIntentId }),
    });

    if (!response.ok) {
      throw new Error('Failed to confirm purchase');
    }

    return response.json();
  },

  // Team methods
  async getUserTeams() {
    const response = await fetch(`${AUTH_API_BASE_URL}/teams/my-teams`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch teams');
    }

    return response.json();
  },

  async createTeam(teamData: any) {
    const response = await fetch(`${AUTH_API_BASE_URL}/teams/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(teamData),
    });

    if (!response.ok) {
      throw new Error('Failed to create team');
    }

    return response.json();
  },

  async joinTeam(inviteCode: string) {
    const response = await fetch(`${AUTH_API_BASE_URL}/teams/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({ inviteCode }),
    });

    if (!response.ok) {
      throw new Error('Failed to join team');
    }

    return response.json();
  },

  async leaveTeam(teamId: string) {
    const response = await fetch(`${AUTH_API_BASE_URL}/teams/${teamId}/leave`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to leave team');
    }

    return response.json();
  },

  async getTeamDetails(teamId: string) {
    const response = await fetch(`${AUTH_API_BASE_URL}/teams/${teamId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch team details');
    }

    return response.json();
  },

  async getTeamInsights(teamId: string) {
    const response = await fetch(`${AUTH_API_BASE_URL}/teams/${teamId}/insights`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch team insights');
    }

    return response.json();
  },
};