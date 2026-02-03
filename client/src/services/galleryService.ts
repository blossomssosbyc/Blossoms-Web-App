import { supabase } from '../lib/supabase';

export interface GalleryImage {
    id: number;
    category: string;
    event: string;
    image_link: string;
    created_at?: string;
    // Mapped properties for UI
    img?: string;
    url?: string;
    title?: string;
    date?: string;
    height?: number;
}

export const galleryService = {
    async getImages() {
        const { data, error } = await supabase
            .from('blossomsimagedb')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;

        return (data as GalleryImage[]).map(img => ({
            ...img,
            // Map to UI expected format
            img: this.getDirectUrl(img.image_link),
            url: this.getDirectUrl(img.image_link),
            title: img.event, // Use event as title if no specific title
            date: new Date(img.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            height: Math.floor(Math.random() * (500 - 300 + 1) + 300) // Random height for masonry if not provided
        }));
    },

    getDirectUrl(url: string) {
        if (!url) return '';
        const match = url.match(/\/d\/(.+)\//);
        if (match && match[1]) {
            return `https://lh3.googleusercontent.com/d/${match[1]}`;
        }
        return url;
    }
};
