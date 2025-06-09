from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Optional
from pydantic import BaseModel
from datetime import datetime
import uuid
import random
import string
from app.services.team_insights import TeamInsightsGenerator

router = APIRouter()

# In-memory storage for demo purposes
# In production, this would use the database
teams_db = {}
team_members_db = {}
user_profiles_db = {}

class CreateTeamRequest(BaseModel):
    name: str
    description: Optional[str] = None
    team_type: str = "other"  # family, friends, work, other

class JoinTeamRequest(BaseModel):
    user_id: str
    share_level: str = "full"  # full, basic, anonymous

class TeamMemberProfile(BaseModel):
    user_id: str
    user_name: str
    big_five: Dict
    mbti: Dict
    share_level: str

def generate_invite_code() -> str:
    """Generate a unique invite code"""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

def get_current_user():
    """Mock user authentication - in production would validate JWT"""
    return {"id": "demo-user-123", "email": "demo@example.com"}

@router.post("/teams/create")
async def create_team(request: CreateTeamRequest, user = Depends(get_current_user)):
    """Create a new team and generate invite code"""
    team_id = str(uuid.uuid4())
    invite_code = generate_invite_code()
    
    team = {
        'id': team_id,
        'name': request.name,
        'description': request.description,
        'team_type': request.team_type,
        'created_by': user['id'],
        'invite_code': invite_code,
        'created_at': datetime.now().isoformat(),
        'is_active': True
    }
    
    teams_db[team_id] = team
    
    # Add creator as first member
    team_members_db[team_id] = [{
        'user_id': user['id'],
        'role': 'owner',
        'joined_at': datetime.now().isoformat(),
        'share_level': 'full'
    }]
    
    return {
        'team_id': team_id,
        'invite_code': invite_code,
        'team': team
    }

@router.post("/teams/join/{invite_code}")
async def join_team(invite_code: str, request: JoinTeamRequest):
    """Join a team using invite code"""
    # Find team by invite code
    team = None
    team_id = None
    
    for tid, t in teams_db.items():
        if t['invite_code'] == invite_code and t['is_active']:
            team = t
            team_id = tid
            break
    
    if not team:
        raise HTTPException(status_code=404, detail="Invalid or expired invite code")
    
    # Check if already a member
    members = team_members_db.get(team_id, [])
    if any(m['user_id'] == request.user_id for m in members):
        raise HTTPException(status_code=400, detail="Already a member of this team")
    
    # Add new member
    new_member = {
        'user_id': request.user_id,
        'role': 'member',
        'joined_at': datetime.now().isoformat(),
        'share_level': request.share_level
    }
    
    members.append(new_member)
    team_members_db[team_id] = members
    
    return {
        'success': True,
        'team': team,
        'member_count': len(members)
    }

@router.get("/teams")
async def get_user_teams(user = Depends(get_current_user)):
    """Get all teams for the current user"""
    user_teams = []
    
    for team_id, members in team_members_db.items():
        if any(m['user_id'] == user['id'] for m in members):
            team = teams_db.get(team_id)
            if team and team['is_active']:
                user_teams.append({
                    **team,
                    'member_count': len(members),
                    'user_role': next(m['role'] for m in members if m['user_id'] == user['id'])
                })
    
    return {'teams': user_teams}

@router.get("/teams/{team_id}")
async def get_team_details(team_id: str, user = Depends(get_current_user)):
    """Get detailed team information"""
    team = teams_db.get(team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    members = team_members_db.get(team_id, [])
    
    # Check if user is a member
    if not any(m['user_id'] == user['id'] for m in members):
        raise HTTPException(status_code=403, detail="Not a member of this team")
    
    # Get member profiles based on share levels
    member_profiles = []
    for member in members:
        profile = user_profiles_db.get(member['user_id'])
        if profile:
            if member['share_level'] == 'anonymous':
                # Anonymize the profile
                member_profiles.append({
                    'user_id': 'anonymous',
                    'user_name': 'Team Member',
                    'big_five': profile['big_five'],
                    'mbti': profile['mbti'],
                    'share_level': 'anonymous'
                })
            elif member['share_level'] == 'basic':
                # Share only basic info
                member_profiles.append({
                    'user_id': member['user_id'],
                    'user_name': profile.get('user_name', 'Team Member'),
                    'big_five': {
                        'scores': profile['big_five']['scores']
                    },
                    'mbti': {
                        'primary_type': profile['mbti']['primary_type']
                    },
                    'share_level': 'basic'
                })
            else:  # full
                member_profiles.append({
                    'user_id': member['user_id'],
                    'user_name': profile.get('user_name', 'Team Member'),
                    'big_five': profile['big_five'],
                    'mbti': profile['mbti'],
                    'cognitive_functions': profile.get('cognitive_functions', {}),
                    'share_level': 'full'
                })
    
    return {
        'team': team,
        'members': member_profiles,
        'member_count': len(members)
    }

@router.get("/teams/{team_id}/insights")
async def get_team_insights(team_id: str, user = Depends(get_current_user)):
    """Generate team comparison insights"""
    team = teams_db.get(team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    members = team_members_db.get(team_id, [])
    
    # Check if user is a member
    if not any(m['user_id'] == user['id'] for m in members):
        raise HTTPException(status_code=403, detail="Not a member of this team")
    
    # Get member profiles
    member_profiles = []
    for member in members:
        profile = user_profiles_db.get(member['user_id'])
        if profile and member['share_level'] != 'none':
            # Include profile based on sharing preferences
            member_profiles.append(profile)
    
    if len(member_profiles) < 2:
        raise HTTPException(
            status_code=400, 
            detail="Need at least 2 members with shared profiles to generate insights"
        )
    
    # Generate insights
    generator = TeamInsightsGenerator()
    insights = generator.generate(member_profiles)
    
    return {
        'team_id': team_id,
        'team_name': team['name'],
        'insights': insights,
        'generated_at': datetime.now().isoformat()
    }

@router.put("/teams/{team_id}/members/{user_id}")
async def update_member_settings(
    team_id: str, 
    user_id: str, 
    share_level: str,
    user = Depends(get_current_user)
):
    """Update member sharing settings"""
    # Verify user is updating their own settings
    if user['id'] != user_id:
        raise HTTPException(status_code=403, detail="Can only update your own settings")
    
    members = team_members_db.get(team_id, [])
    
    for member in members:
        if member['user_id'] == user_id:
            member['share_level'] = share_level
            team_members_db[team_id] = members
            return {'success': True, 'share_level': share_level}
    
    raise HTTPException(status_code=404, detail="Member not found in team")

@router.delete("/teams/{team_id}/leave")
async def leave_team(team_id: str, user = Depends(get_current_user)):
    """Leave a team"""
    members = team_members_db.get(team_id, [])
    
    # Find and remove member
    original_count = len(members)
    members = [m for m in members if m['user_id'] != user['id']]
    
    if len(members) == original_count:
        raise HTTPException(status_code=404, detail="Not a member of this team")
    
    # If owner is leaving and there are other members, transfer ownership
    leaving_member = next((m for m in team_members_db[team_id] if m['user_id'] == user['id']), None)
    if leaving_member and leaving_member['role'] == 'owner' and len(members) > 0:
        members[0]['role'] = 'owner'  # Transfer to first remaining member
    
    # If no members left, deactivate team
    if len(members) == 0:
        teams_db[team_id]['is_active'] = False
    
    team_members_db[team_id] = members
    
    return {'success': True, 'message': 'Successfully left the team'}

# Demo endpoint to add sample profiles for testing
@router.post("/teams/demo/add-profile")
async def add_demo_profile(user_id: str, profile: Dict):
    """Add a demo personality profile for testing team features"""
    user_profiles_db[user_id] = {
        'user_id': user_id,
        'user_name': profile.get('user_name', f'User {user_id[-4:]}'),
        'big_five': profile['big_five'],
        'mbti': profile['mbti'],
        'cognitive_functions': profile.get('cognitive_functions', {}),
        'uniqueness': profile.get('uniqueness', {}),
        'trait_interactions': profile.get('trait_interactions', [])
    }
    
    return {'success': True, 'user_id': user_id}