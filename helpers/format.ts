import { toDate } from "./cast";
import { floor } from "./nbr";
import { pad } from "./str";

/**
 * Formate le temps selon ces règles :
 * - Si heures > 0 : "5h30"
 * - Si minutes > 0 : "05:30"
 * - Si secondes seules : "05.234" (avec millisecondes)
 * @param ms Temps en millisecondes
 */
export const formatMs = (ms: number): string => {
    if (ms === 0) return "00.000";
    
    // Conversion en composants de temps
    const totalSeconds = floor(Math.abs(ms) / 1000);
    const hours = floor(totalSeconds / 3600);
    const minutes = floor((totalSeconds % 3600) / 60);
    const seconds = floor(totalSeconds % 60);

    // Le signe ne sera appliqué qu'au début si négatif
    const sign = ms < 0 ? '-' : '';
    
    if (hours > 0) {
        return `${sign}${hours}h${pad(minutes, 2)}`;
    }
    
    if (minutes > 0) {
        return `${sign}${pad(minutes, 2)}:${pad(seconds, 2)} min`;
    }
    
    return `${sign}${seconds} sec`;
};

/**
 * Retourne une date au format : JJ/MM/YYYY
 * @param date Date à formater (par défaut, la date actuelle)
 */
export const formatDate = (date?: any): string => {
    const d = toDate(date) || new Date();
    const day = pad(d.getDate(), 2);
    const month = pad(d.getMonth() + 1, 2);
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
};

/**
 * Retourne une date au format : HH:MM:SS
 * @param date Date à formater (par défaut, la date actuelle)
 */
export const formatTime = (date?: any): string => {
    const d = toDate(date) || new Date();
    const hours = pad(d.getHours(), 2);
    const minutes = pad(d.getMinutes(), 2);
    const secondes = pad(d.getSeconds(), 2);

    return `${hours}:${minutes}:${secondes}`;
};

/**
 * Retourne une date au format : JJ/MM/YYYY HH:MM:SS
 * @param date Date à formater (par défaut, la date actuelle)
 */
export const formatDateTime = (date: any): string => `${formatDate(date)} ${formatTime(date)}`;

/**
 * Parse une chaîne de date/heure au format français flexible :
 * - "JJ/MM"
 * - "JJ/MM/YY" ou "JJ/MM/YYYY"
 * - "JJ/MM/YYYY HH"
 * - "JJ/MM/YYYY HH:MM"
 * - "JJ/MM/YYYY HH:MM:SS"
 * - "HH:MM"
 * - "HH:MM:SS"
 * Si une partie est manquante, elle est complétée avec la date/heure actuelle.
 * @param str Chaîne de date/heure
 * @returns Un objet Date ou null si invalide
 */
export const parseDate = (str: string): Date | null => {
    const now = new Date();

    let day = now.getDate();
    let month = now.getMonth() + 1; // 1-based
    let year = now.getFullYear();
    let h = 0, m = 0, s = 0;

    // Heure "HH:MM" ou "HH:MM:SS"
    const timeMatch = str.match(/(\d{2}):(\d{2})(?::(\d{2}))?/);
    if (timeMatch) {
        h = parseInt(timeMatch[1], 10);
        m = parseInt(timeMatch[2], 10);
        s = parseInt(timeMatch[3] || "0", 10);
    }

    // Date "JJ/MM" ou "JJ/MM/YY" ou "JJ/MM/YYYY"
    const dateMatch = str.match(/(\d{2})\/(\d{2})(?:\/(\d{2,4}))?/);
    if (dateMatch) {
        day = parseInt(dateMatch[1], 10);
        month = parseInt(dateMatch[2], 10);
        const y = dateMatch[3];
        if (y) {
            year = parseInt(y, 10);
            if (y.length === 2) {
                year += year > 40 ? 1900 : 2000;
            }
        }
    }

    // Crée la date
    const result = new Date(year, month - 1, day, h, m, s);

    // Validation : évite les dates invalides type 31/02
    if (
        result.getFullYear() !== year ||
        result.getMonth() !== month - 1 ||
        result.getDate() !== day
    ) {
        return null;
    }

    return result;
};