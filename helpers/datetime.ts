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
    return secondes === '00' ? `${hours}:${minutes}` : `${hours}:${minutes}:${secondes}`;
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

/**
 * Convertit une date en nombre de secondes depuis minuit (0h00)
 * @param date Date à convertir (par défaut, la date actuelle)
 * @returns Nombre de secondes depuis minuit
 */
export const dateToSeconds = (date?: any): number => {
    const d = toDate(date);
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const seconds = d.getSeconds();
    return hours * 3600 + minutes * 60 + seconds;
};

/**
 * Convertit un nombre de secondes depuis minuit en format HH:MM:SS
 * Compatible avec formatTime en créant une date du jour avec ce temps
 * @param seconds Nombre de secondes depuis minuit
 * @returns Chaîne au format HH:MM:SS ou HH:MM si secondes = 0
 */
export const secondsToTimeString = (seconds: number): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Minuit du jour
    today.setSeconds(seconds); // Ajouter les secondes
    return formatTime(today);
};

/**
 * Parse une chaîne de temps ou un nombre en secondes depuis minuit
 * @param value Chaîne au format HH:MM:SS, HH/MM/YYYY HH:MM:SS, ou nombre de secondes
 * @returns Nombre de secondes depuis minuit ou null si invalide
 */
export const parseToSeconds = (value: string | number): number | null => {
    if (typeof value === 'number') {
        // Si c'est déjà un nombre, on assume que c'est des secondes depuis minuit
        return value >= 0 && value <= 86400 ? value : null;
    }
    
    if (typeof value === 'string') {
        // Essaie d'abord de parser comme une date complète
        const parsedDate = parseDate(value);
        if (parsedDate) {
            return dateToSeconds(parsedDate);
        }
        
        // Sinon essaie de parser comme un temps simple HH:MM:SS
        const timeMatch = value.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
        if (!timeMatch) return null;
        
        const h = parseInt(timeMatch[1], 10);
        const m = parseInt(timeMatch[2], 10);
        const s = parseInt(timeMatch[3] || "0", 10);
        
        // Validation
        if (h < 0 || h > 23 || m < 0 || m > 59 || s < 0 || s > 59) {
            return null;
        }
        
        return h * 3600 + m * 60 + s;
    }
    
    return null;
};