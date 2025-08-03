
import React, { useState } from 'react';
import { User, Screen } from '../../types';
import TermsContent from '../common/TermsContent';
import PrivacyContent from '../common/PrivacyContent';

interface SettingsScreenProps {
  user: User | null;
  onNavigate: (screen: Screen) => void;
}

const LANGUAGES = ['Hindi', 'Urdu', 'Bhojpuri', 'Tamil'];

const SettingsScreen: React.FC<SettingsScreenProps> = ({ user, onNavigate }) => {
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [mobile, setMobile] = useState('');
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [isSupportVisible, setIsSupportVisible] = useState(false);
    const [isHostFormVisible, setIsHostFormVisible] = useState(false);
    const [isTermsVisible, setIsTermsVisible] = useState(false);
    const [isPrivacyVisible, setIsPrivacyVisible] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleLanguageChange = (lang: string) => {
        setSelectedLanguages(prev =>
            prev.includes(lang)
                ? prev.filter(l => l !== lang)
                : [...prev, lang]
        );
    };

    const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
        if (e.key === 'Enter' || e.key === ' ') {
            action();
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !city || !mobile || selectedLanguages.length === 0) {
            alert('Please fill out all fields and select at least one language.');
            return;
        }
        setSubmissionStatus('submitting');
        
        setTimeout(() => {
            setSubmissionStatus('success');
            // Reset form after success message has been shown for a bit
            setTimeout(() => {
                setSubmissionStatus('idle');
                setName('');
                setCity('');
                setMobile('');
                setSelectedLanguages([]);
            }, 3000);
        }, 1000);
    };

    return (
        <div className="relative p-4 space-y-6 text-white pb-28">
             {submissionStatus === 'success' && (
                <div className="fixed inset-0 max-w-md mx-auto bg-black/70 flex items-center justify-center z-50 animate-fade-in-down">
                    <div className="bg-gradient-to-br from-[#1a1a3d] to-[#0a0f2c] p-8 rounded-2xl shadow-2xl border border-white/20 text-center max-w-sm">
                        <div className="text-5xl mb-4">✅</div>
                        <h3 className="text-2xl font-bold mb-2">Application Sent!</h3>
                        <p className="text-white/80">Thank you for applying! We have sent your details to <span className="font-semibold text-indigo-400">appsakoon@gmail.com</span> for review.</p>
                    </div>
                </div>
            )}
            {/* Admin Info */}
            <div className="bg-white/10 rounded-2xl p-4 shadow-lg text-sm backdrop-blur-sm border border-white/10">
                <p className="text-gray-300">Logged in as: <span className="font-semibold text-white">{user?.name ?? 'Admin'}</span></p>
                <p className="text-gray-300">Admin ID: <span className="font-semibold text-white">{user?.id ?? 'N/A'}</span></p>
            </div>

            {/* Menu Sections */}
            <div className="bg-white/10 rounded-2xl p-2 shadow-lg backdrop-blur-sm border border-white/10 space-y-1">
                {/* Apply to be Host */}
                <CollapsibleSection title="Apply To Become Host" icon="🆕" isVisible={isHostFormVisible} setVisible={setIsHostFormVisible}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required className="w-full p-3 bg-white/5 border border-white/20 rounded-lg outline-none transition focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400" />
                        <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="Your city" required className="w-full p-3 bg-white/5 border border-white/20 rounded-lg outline-none transition focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400" />
                        <input type="tel" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="Your mobile number" required className="w-full p-3 bg-white/5 border border-white/20 rounded-lg outline-none transition focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400" />
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Language(s):</label>
                            <div className="grid grid-cols-2 gap-2">
                                {LANGUAGES.map(lang => (
                                    <label key={lang} className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors ${selectedLanguages.includes(lang) ? 'bg-indigo-500/50' : 'hover:bg-white/10'}`}>
                                        <input type="checkbox" checked={selectedLanguages.includes(lang)} onChange={() => handleLanguageChange(lang)} className="h-4 w-4 rounded border-gray-500 bg-white/20 text-indigo-500 focus:ring-indigo-500" />
                                        <span>{lang}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <button type="submit" disabled={submissionStatus === 'submitting'} className="w-full p-3 border-none rounded-lg cursor-pointer transition-all text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/50 font-semibold disabled:opacity-50 disabled:cursor-wait">
                            {submissionStatus === 'submitting' ? 'Submitting...' : 'SUBMIT'}
                        </button>
                        <p className="text-center text-xs text-gray-400 mt-3">
                            ➡️ Host की Details Submit होते ही, यह जानकारी Email पर भेजी जाएगी: <a href="mailto:appsakoon@gmail.com" className="text-indigo-400">appsakoon@gmail.com</a>
                        </p>
                    </form>
                </CollapsibleSection>
                
                {/* Help and Support */}
                <CollapsibleSection title="Help and Support" icon="🆘" isVisible={isSupportVisible} setVisible={setIsSupportVisible}>
                     <div className="text-gray-300 text-sm">
                        <h4 className="font-bold text-base mb-2 text-white">🎧 Help & Support – हम सुनने के लिए हैं, हर वक़्त!</h4>
                        <p className="mb-3 text-xs leading-relaxed text-gray-400">
                            कभी-कभी बस कोई सुनने वाला चाहिए होता है... और हम वही हैं। अगर आप अकेलापन महसूस कर रहे हैं या किसी से बात करना चाहते हैं — हमसे चैट करें या कॉल पर जुड़ें।
                        </p>
                         <div className="space-y-4">
                            <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                <h5 className="font-semibold text-white">🗣️ Voice Call Support</h5>
                                <button onClick={() => onNavigate('call')} className="w-full mt-2 p-2 border-none rounded-lg text-sm cursor-pointer transition-all text-white bg-gradient-to-r from-green-500 to-teal-500 hover:shadow-lg font-semibold">
                                    📞 Manage Voice Calls
                                </button>
                            </div>
                             <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                <h5 className="font-semibold text-white">💬 Chat Support</h5>
                                <button onClick={() => onNavigate('chat')} className="w-full mt-2 p-2 border-none rounded-lg text-sm cursor-pointer transition-all text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-lg font-semibold">
                                    💬 Manage Live Chats
                                </button>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/10 text-xs text-gray-400">
                             <p>📩 <b>ईमेल सहायता:</b> <a href="mailto:appsakoon@gmail.com" className="text-indigo-400">appsakoon@gmail.com</a></p>
                            <p>🕒 <b>उपलब्ध समय:</b> हर दिन सुबह 9 बजे से रात 11 बजे तक</p>
                        </div>
                    </div>
                </CollapsibleSection>

                 {/* Privacy Policy */}
                <CollapsibleSection title="Privacy Policy" icon="🔒" isVisible={isPrivacyVisible} setVisible={setIsPrivacyVisible}>
                    <PrivacyContent />
                </CollapsibleSection>

                 {/* Terms and Conditions */}
                 <CollapsibleSection title="Terms and Conditions" icon="📄" isVisible={isTermsVisible} setVisible={setIsTermsVisible}>
                    <TermsContent />
                </CollapsibleSection>
            </div>
        </div>
    );
};

// Reusable Collapsible Section Component
interface CollapsibleSectionProps {
    title: string;
    icon: string;
    isVisible: boolean;
    setVisible: (visible: boolean) => void;
    children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, icon, isVisible, setVisible, children }) => {
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            setVisible(!isVisible);
        }
    }
    return (
        <div className="bg-white/5 rounded-lg overflow-hidden">
            <div
                onClick={() => setVisible(!isVisible)}
                onKeyPress={handleKeyPress}
                role="button"
                tabIndex={0}
                aria-expanded={isVisible}
                className="flex items-center p-3 hover:bg-white/10 cursor-pointer transition-colors"
            >
                <span className="text-xl mr-4">{icon}</span>
                <span className="text-white font-medium flex-grow">{title}</span>
                <span className={`text-gray-400 transform transition-transform ${isVisible ? 'rotate-90' : ''}`}>›</span>
            </div>
            {isVisible && (
                <div className="p-4 border-t border-white/10 animate-fade-in-down">
                    {children}
                </div>
            )}
        </div>
    )
}


export default SettingsScreen;
