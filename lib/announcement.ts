import fs from 'fs';
import path from 'path';

export interface Announcement {
    id: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'none';
    link?: string;
    linkText?: string;
    active: boolean;
}

const DATA_FILE = path.join(process.cwd(), 'lib', 'announcement-data.json');

export const getAnnouncement = (): Announcement => {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            return {
                id: '1',
                message: 'Welcome to AlphaPrime v3.0! Explore our latest privacy-first web tools.',
                type: 'info',
                active: true
            };
        }
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading announcement data:", error);
        return {
            id: '1',
            message: 'AlphaPrime is live!',
            type: 'info',
            active: true
        };
    }
};

export const updateAnnouncement = (announcement: Announcement) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(announcement, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error("Error writing announcement data:", error);
        return false;
    }
};
