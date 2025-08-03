
import React from 'react';

const TermsContent: React.FC = () => {
    return (
        <div className="p-2 text-gray-300 text-sm">
            <h4 className="font-bold text-base mb-2 text-white">📘 SakoonApp उपयोग की शर्तें (Terms of Use)</h4>
            <p className="text-xs text-gray-400 mb-4">प्रभावी तिथि: 1 अगस्त 2025</p>
            <div className="space-y-3 text-xs leading-relaxed">
                <div>
                    <h5 className="font-semibold text-gray-100">1. प्लेटफ़ॉर्म का उद्देश्य और होस्ट की भूमिका</h5>
                    <p>SakoonApp उपयोगकर्ताओं और होस्ट्स के बीच सुरक्षित व सकारात्मक संवाद का माध्यम है। होस्ट्स को उपयोगकर्ताओं से सम्मानपूर्वक, संवेदनशीलता के साथ व्यवहार करना होगा।</p>
                </div>
                <div>
                    <h5 className="font-semibold text-gray-100">2. होस्ट के लिए आचरण की शर्तें:</h5>
                    <ul className="list-disc list-inside ml-2">
                        <li>पेशेवरता बनाए रखें: उचित भाषा और शिष्ट व्यवहार आवश्यक है।</li>
                        <li>सकारात्मक व प्रासंगिक सामग्री: समुदाय के मानदंडों के अनुसार सामग्री साझा करें।</li>
                        <li>प्राइवेसी का सम्मान करें: व्यक्तिगत जानकारी साझा न करें या पूछें।</li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-semibold text-gray-100">3. निषिद्ध गतिविधियाँ:</h5>
                    <ul className="list-disc list-inside ml-2">
                        <li>धमकी, गाली-गलौज, अश्लीलता या किसी प्रकार का उत्पीड़न</li>
                        <li>जाति, धर्म, लिंग, भाषा आदि के आधार पर भेदभाव</li>
                        <li>ऑफ-प्लेटफ़ॉर्म संपर्क को बढ़ावा देना</li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-semibold text-gray-100">4. रिपोर्टिंग और सुरक्षा:</h5>
                    <p>ऐप में रिपोर्ट फीचर के माध्यम से अनुचित व्यवहार की रिपोर्ट करें। बाल सुरक्षा के लिए हम CSAM (बाल यौन शोषण सामग्री) के विरुद्ध सख्त कदम उठाते हैं।</p>
                </div>
                <div>
                    <h5 className="font-semibold text-gray-100">5. डेटा सुरक्षा:</h5>
                    <p>किसी भी यूज़र की व्यक्तिगत जानकारी रिकॉर्ड या साझा करना प्रतिबंधित है।</p>
                </div>
                 <div>
                    <h5 className="font-semibold text-gray-100">6. भुगतान और उपहार:</h5>
                    <p>यूज़र द्वारा भेजे गए वर्चुअल गिफ्ट सिर्फ आभार के प्रतीक हैं, पैसे की अपेक्षा नहीं की जा सकती।</p>
                </div>
                <div>
                    <h5 className="font-semibold text-gray-100">7. दायित्व की सीमा:</h5>
                    <p>कंपनी सिर्फ एक मंच प्रदान करती है; होस्ट और यूज़र के बीच की बातचीत पर जिम्मेदारी नहीं लेती।</p>
                </div>
                <div>
                    <h5 className="font-semibold text-gray-100">8. खाता निलंबन/समाप्ति:</h5>
                    <p>नियमों का उल्लंघन करने पर खाता अस्थायी या स्थायी रूप से निलंबित किया जा सकता है।</p>
                </div>
                <div>
                    <h5 className="font-semibold text-gray-100">9. नियमों में परिवर्तन:</h5>
                    <p>समय-समय पर अपडेट किए जा सकते हैं। जारी उपयोग का अर्थ होगा सहमति।</p>
                </div>
                 <div>
                    <h5 className="font-semibold text-gray-100">10. सहमति की पुष्टि:</h5>
                    <p>"मैं सहमत हूँ" बटन पर क्लिक करके आप इन शर्तों को स्वीकार करते हैं और मानते हैं कि आपने इन्हें पढ़ा और समझा है।</p>
                </div>
            </div>
        </div>
    );
};

export default TermsContent;