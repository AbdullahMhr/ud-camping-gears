"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    isAdmin: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkSession = async (currentSession: Session | null) => {
            if (!currentSession) {
                setSession(null);
                setUser(null);
                setIsAdmin(false);
                setLoading(false);
                return;
            }

            // 1-Week Google Expiry Constraint
            if (currentSession.user.app_metadata.provider === 'google') {
                const signInTime = new Date(currentSession.user.last_sign_in_at || '').getTime();
                const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
                if (Date.now() - signInTime > oneWeekMs) {
                    await supabase.auth.signOut();
                    setSession(null);
                    setUser(null);
                    setIsAdmin(false);
                    setLoading(false);
                    return;
                }
            }

            // Fetch Admin status from Profile table
            const { data: profile } = await supabase
                .from('profiles')
                .select('is_admin')
                .eq('id', currentSession.user.id)
                .single();

            setSession(currentSession);
            setUser(currentSession.user);
            setIsAdmin(profile?.is_admin || false);
            setLoading(false);
        };

        supabase.auth.getSession().then(({ data: { session } }) => {
            checkSession(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            checkSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    // Auto-logout for Admin inactivity (2 hours = 7,200,000 ms)
    useEffect(() => {
        let inactivityTimeout: NodeJS.Timeout;

        const resetTimer = () => {
            clearTimeout(inactivityTimeout);
            // Specifically target the Admin instance
            if (user?.email === 'abdullahmhr64@gmail.com' || isAdmin) {
                inactivityTimeout = setTimeout(async () => {
                    console.log("Admin session timed out due to inactivity.");
                    await signOut();
                    window.location.href = "/admin"; // Redirect back to login
                }, 7200000);
            }
        };

        // Only attach generic heavyweight DOM listeners if we are actually an Admin
        if (user?.email === 'abdullahmhr64@gmail.com' || isAdmin) {
            resetTimer(); // Init

            // Throttle the mousemove event attachment for performance, but generic attachment is usually fine for Admin-only panels
            const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];

            // We use a passive listener to avoid scrolling jank
            events.forEach(event => {
                window.addEventListener(event, resetTimer, { passive: true });
            });

            return () => {
                clearTimeout(inactivityTimeout);
                events.forEach(event => {
                    window.removeEventListener(event, resetTimer);
                });
            };
        }
    }, [user, isAdmin]);

    return (
        <AuthContext.Provider value={{ session, user, isAdmin, signOut }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
