
import React from 'react';

const PrivacyContent: React.FC = () => {
    return (
        <div className="p-2 text-gray-300 text-sm">
            <h4 className="font-bold text-base mb-2 text-white">📜 SakoonApp गोपनीयता नीति</h4>
            <p className="text-xs text-gray-400 mb-2">अद्यतन दिनांक: 1 अगस्त 2025</p>
            <p className="text-xs text-gray-400 mb-4">© सभी अधिकार सुरक्षित – SakoonApp | Metxfitt Technologies Private Limited</p>
            
            <p className="text-xs leading-relaxed mb-4">
                Metxfitt Technologies Private Limited ("हम", "हमारा", या "कंपनी") द्वारा संचालित SakoonApp ("प्लेटफ़ॉर्म") उपयोगकर्ताओं की गोपनीयता की रक्षा और व्यक्तिगत जानकारी की सुरक्षा के लिए प्रतिबद्ध है।
            </p>
            
            <div className="space-y-3 text-xs leading-relaxed">
                <div>
                    <h5 className="font-semibold text-gray-100">1. हम कौन-सी जानकारी एकत्र करते हैं:</h5>
                    <p>हम केवल निम्नलिखित सीमित जानकारी एकत्र करते हैं:</p>
                    <ul className="list-disc list-inside ml-2">
                        <li>नाम (Name)</li>
                        <li>मोबाइल नंबर (Mobile Number)</li>
                    </ul>
                    <p className="mt-1">✅ हम किसी भी अतिरिक्त जानकारी की माँग नहीं करते, जैसे: लोकेशन, फोटो, जन्म तिथि आदि।</p>
                </div>
                 <div>
                    <h5 className="font-semibold text-gray-100">2. डेटा कहाँ और कैसे सुरक्षित रखा जाता है:</h5>
                    <ul className="list-disc list-inside ml-2">
                        <li>आपकी दी गई जानकारी केवल Firebase जैसे सुरक्षित सर्वर पर संग्रहित होती है।</li>
                        <li>आपकी चैट या वॉयस कॉल की कोई रिकॉर्डिंग या लॉग नहीं रखी जाती।</li>
                        <li>ऐप में जो भी गतिविधियाँ होती हैं, वे केवल यूज़र अनुभव को बेहतर बनाने के लिए होती हैं – कोई भी डेटा बेचा या किसी थर्ड पार्टी से साझा नहीं किया जाता।</li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-semibold text-gray-100">3. जानकारी का उपयोग किसलिए किया जाता है:</h5>
                     <ul className="list-disc list-inside ml-2">
                        <li>आपके नाम और मोबाइल नंबर का उपयोग केवल लॉगिन, अकाउंट सत्यापन और ऐप की सेवाओं (जैसे चैट या कॉल) को शुरू करने के लिए किया जाता है।</li>
                        <li>हम आपका डेटा कभी भी प्रचार, विज्ञापन या किसी अन्य व्यवसायिक उद्देश्य के लिए नहीं बेचते।</li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-semibold text-gray-100">4. आप किन अधिकारों के अधिकारी हैं:</h5>
                    <ul className="list-disc list-inside ml-2">
                        <li>आप कभी भी अपनी जानकारी देखने, बदलने या हटाने का अनुरोध कर सकते हैं।</li>
                        <li>आप "SakoonApp" का उपयोग बंद कर सकते हैं और हमें अपना खाता हटवाने का अनुरोध भेज सकते हैं।</li>
                    </ul>
                </div>
                 <div>
                    <h5 className="font-semibold text-gray-100">5. हमारी सुरक्षा नीति:</h5>
                    <ul className="list-disc list-inside ml-2">
                        <li>SakoonApp पूरी तरह से सुरक्षित तकनीक का उपयोग करता है – जैसे Firebase और ZegoCloud SDK – ताकि आपके डेटा को किसी भी अनधिकृत पहुँच से बचाया जा सके।</li>
                        <li>हम कोई भी संवेदनशील या गोपनीय जानकारी स्टोर नहीं करते।</li>
                    </ul>
                </div>
                 <div>
                    <h5 className="font-semibold text-gray-100">6. सहायता और संपर्क:</h5>
                    <p>अगर आपको कोई सवाल है या आप किसी जानकारी को हटाना या अपडेट करना चाहते हैं, तो आप हमसे संपर्क कर सकते हैं:</p>
                    <p className="mt-1">📩 ईमेल: <a href="mailto:appsakoon@gmail.com" className="text-indigo-400">appsakoon@gmail.com</a></p>
                </div>
            </div>

            <p className="mt-4 text-center font-semibold text-indigo-400 text-xs">
               🔒 आपकी गोपनीयता, आपकी शक्ति।
            </p>
             <p className="mt-2 text-center text-xs text-gray-500">
               © 2025 – SakoonApp | Metxfitt Technologies Private Limited
               <br />
               सभी अधिकार सुरक्षित।
            </p>
        </div>
    );
};

export default PrivacyContent;