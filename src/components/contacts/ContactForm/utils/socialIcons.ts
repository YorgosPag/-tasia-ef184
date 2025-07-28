import React from 'react';
import { Linkedin, Facebook, Instagram, Github, Youtube, Globe, Link as LinkIcon, Info } from 'lucide-react';

export const SOCIAL_TYPES = ['Website', 'LinkedIn', 'YouTube', 'Facebook', 'Instagram', 'GitHub', 'TikTok', 'Άλλο'];

export const socialIcons: { [key: string]: React.ElementType } = {
    Website: Globe,
    LinkedIn: Linkedin,
    Facebook: Facebook,
    Instagram: Instagram,
    GitHub: Github,
    YouTube: Youtube,
    TikTok: Info, // Placeholder
    default: LinkIcon,
};
