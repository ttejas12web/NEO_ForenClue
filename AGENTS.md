# Critical Database Protection Rules

**CRITICAL SECURITY DIRECTIVE:**
The admin database is highly sensitive and mission-critical to the application. This includes (but is not limited to) all Firestore collections managing:
- Core Courses
- E-Library (Books)
- Podcasts
- Community Doubts / Forums
- Certificate Manager
- Employee Manager
- Quizzes & Weekly Challenges

**STRICT RULES FOR DELETION OR PURGING:**
1. You are **STRICTLY FORBIDDEN** from purging, bulk-deleting, or removing these databases or collections without explicit double confirmation.
2. If the user provides a prompt or request that involves the deletion, purging, or major destructive modification of these database records, you MUST:
   - STOP immediately.
   - Warn the user about the destructive nature of the action.
   - Ask for confirmation **TWICE** before proceeding.
3. Always prioritize the security, stability, and integrity of the workspace station and its admin data.

Follow these rules unconditionally to ensure the workspace remains powerful, dynamic, and secure.

# Data Authenticity Rules

**STRICT RULES FOR MOCK/DUMMY DATA:**
1. You are **STRICTLY FORBIDDEN** from displaying mock, fake, or dummy data to the user on the frontend interface (e.g., in leaderboards, dashboards, or lists).
2. If the real user database does not contain any records or data is unavailable, the UI **MUST** display an empty state or a "no data available" message.
3. Do not hardcode "sample seeds" or inject fake user profiles into database queries to make the application look populated. Always rely strictly on the real Firestore database.
