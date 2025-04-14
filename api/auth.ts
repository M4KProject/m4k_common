import Msg from "../helpers/Msg";
import { AuthError, Session } from "@supabase/supabase-js";
import { supabase } from "./_generated";

export const auth$ = new Msg<Session | null>(null);
export const authError$ = new Msg<AuthError | null>(null);
export const authId$ = new Msg('');
export const isAuth$ = new Msg(false);
export const isAuthLoading$ = new Msg(true);

supabase.auth.getSession().then((result) => {
    console.debug('auth getSession', result);
    isAuthLoading$.set(false);
    if (result.error) {
        authError$.set(result.error);
        auth$.set(null);
    } else {
        authError$.set(null);
        auth$.set(result.data.session);
    }
})

supabase.auth.onAuthStateChange((event, session) => {
    console.debug('auth onAuthStateChange', event, session);
    auth$.set(session);
})

let sessionTimeout: any = null;
const getRemainingTimeMs = (session: Session) => {
    const timeMs = (session.expires_at || 0) * 1000 - new Date().getTime()
    if (timeMs <= 0) console.warn('timeMs', timeMs)
    return timeMs
}

auth$.on(session => {
    isAuth$.set(!!session);
    authId$.set(session?.user?.id||'');

    if (session) {
        const remainingTimeMs = getRemainingTimeMs(session)
        if (remainingTimeMs > 0) {
            clearTimeout(sessionTimeout)
            sessionTimeout = setTimeout(() => {
                const session = auth$.v
                if (session && getRemainingTimeMs(session) <= 0) {
                    auth$.set(null)
                }
            }, remainingTimeMs)
        } else {
            auth$.set(null)
        }
    }
})

/**
 * Fonction pour vérifier l'authentification et tenter de reconnecter si nécessaire
 * @returns Session
 */
export const checkAuth = async (): Promise<Session> => {
    try {
        const session = auth$.v;
        if (session) return session;
        
        isAuthLoading$.set(true);
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        const nextSession = refreshData.session
        if (refreshError || !nextSession) {
            throw refreshError || new Error("session-expired");
        }

        auth$.set(nextSession)
        return nextSession
    } catch (error) {
        auth$.set(null)
        console.error("checkAuth:", error);
        throw error;
    }
};