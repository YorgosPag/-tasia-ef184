
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, KeyRound, Mail, MessageSquare, Eye, EyeOff } from 'lucide-react';
import { useLocalStorageState } from '@/hooks/use-local-storage-state';

// Αυτό το component είναι ένα παράδειγμα.
// Σε μια πραγματική εφαρμογή, αυτές οι τιμές θα αποθηκεύονταν με ασφάλεια
// στο backend (π.χ. Firebase Functions secrets) και όχι στο client-side.

export default function SettingsPage() {
    const { toast } = useToast();
    const [sendgridApiKey, setSendgridApiKey] = useLocalStorageState('setting_sendgridApiKey', '');
    const [sendgridFromEmail, setSendgridFromEmail] = useLocalStorageState('setting_sendgridFromEmail', '');
    const [twilioAccountSid, setTwilioAccountSid] = useLocalStorageState('setting_twilioAccountSid', '');
    const [twilioAuthToken, setTwilioAuthToken] = useLocalStorageState('setting_twilioAuthToken', '');
    const [twilioFromNumber, setTwilioFromNumber] = useLocalStorageState('setting_twilioFromNumber', '');
    const [isSaving, setIsSaving] = useState(false);
    
    const [showSendGridKey, setShowSendGridKey] = useState(false);
    const [showTwilioToken, setShowTwilioToken] = useState(false);


    const handleSave = () => {
        setIsSaving(true);
        // Η αποθήκευση γίνεται αυτόματα μέσω του useLocalStorageState hook.
        // Εδώ απλά προσομοιώνουμε μια καθυστέρηση για το UX.
        setTimeout(() => {
            toast({
                title: 'Επιτυχία',
                description: 'Οι ρυθμίσεις αποθηκεύτηκαν με επιτυχία.',
            });
            setIsSaving(false);
        }, 1000);
    };

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Ρυθμίσεις
            </h1>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Mail className="h-6 w-6" />
                        <CardTitle>Ρυθμίσεις SendGrid (Email)</CardTitle>
                    </div>
                    <CardDescription>
                        Εισάγετε τα στοιχεία σας από το SendGrid για την αποστολή email επιβεβαίωσης.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2 relative">
                        <Label htmlFor="sendgrid-key">SendGrid API Key</Label>
                        <Input
                            id="sendgrid-key"
                            type={showSendGridKey ? 'text' : 'password'}
                            value={sendgridApiKey}
                            onChange={(e) => setSendgridApiKey(e.target.value)}
                            placeholder="SG.xxxxxxxx"
                            className="pr-10"
                        />
                         <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-7 h-7 w-7"
                            onClick={() => setShowSendGridKey(!showSendGridKey)}
                        >
                            {showSendGridKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">{showSendGridKey ? 'Hide key' : 'Show key'}</span>
                        </Button>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="sendgrid-email">Email Αποστολέα</Label>
                        <Input
                            id="sendgrid-email"
                            type="email"
                            value={sendgridFromEmail}
                            onChange={(e) => setSendgridFromEmail(e.target.value)}
                            placeholder="info@yourdomain.com"
                        />
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <MessageSquare className="h-6 w-6" />
                        <CardTitle>Ρυθμίσεις Twilio (SMS)</CardTitle>
                    </div>
                    <CardDescription>
                        Εισάγετε τα στοιχεία σας από το Twilio για την αποστολή ειδοποιήσεων SMS.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="twilio-sid">Twilio Account SID</Label>
                        <Input
                            id="twilio-sid"
                            value={twilioAccountSid}
                            onChange={(e) => setTwilioAccountSid(e.target.value)}
                            placeholder="ACxxxxxxxx"
                        />
                    </div>
                    <div className="space-y-2 relative">
                        <Label htmlFor="twilio-token">Twilio Auth Token</Label>
                        <Input
                            id="twilio-token"
                            type={showTwilioToken ? 'text' : 'password'}
                            value={twilioAuthToken}
                            onChange={(e) => setTwilioAuthToken(e.target.value)}
                            placeholder="••••••••••••••••"
                            className="pr-10"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-7 h-7 w-7"
                            onClick={() => setShowTwilioToken(!showTwilioToken)}
                        >
                            {showTwilioToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">{showTwilioToken ? 'Hide token' : 'Show token'}</span>
                        </Button>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="twilio-number">Twilio Αριθμός Τηλεφώνου</Label>
                        <Input
                            id="twilio-number"
                            value={twilioFromNumber}
                            onChange={(e) => setTwilioFromNumber(e.target.value)}
                            placeholder="+1234567890"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Αποθήκευση Ρυθμίσεων
                </Button>
            </div>
        </div>
    );
}
