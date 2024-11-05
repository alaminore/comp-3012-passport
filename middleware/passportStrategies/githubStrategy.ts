import { Strategy as GitHubStrategy } from 'passport-github2';
import { PassportStrategy } from '../../interfaces/index';
import { database } from '../../models/userModel';


if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
    throw new Error("Missing GitHub client ID or secret in environment variables");
}

const githubStrategy: GitHubStrategy = new GitHubStrategy(
    {
        clientID: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
        callbackURL: "http://localhost:8000/auth/github/callback",
        passReqToCallback: true,
    },
    
    /* FIX ME 😭 */
    async (req: any, accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
           
            let user = database.find((user) => user.email === profile.emails[0]?.value); // Check if user exists

            if (!user) { //if they don't, add them.
                user = {
                    id: database.length + 1, 
                    name: profile.displayName || profile.username,
                    email: profile.emails[0]?.value,
                    password: '', 
                    role: "user", // assume no one on github is an admin
                };
                database.push(user);
            }

            // Pass the user to done
            done(null, user);
        } catch (error) {
            // Handle any errors
            done(error, null);
        }
    },

);

const passportGitHubStrategy: PassportStrategy = {
    name: 'github',
    strategy: githubStrategy,
};

export default passportGitHubStrategy;
