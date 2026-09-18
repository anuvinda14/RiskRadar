import type { Language, MessageCategory } from '@/types';

interface FeatureText {
  privacy: Record<string, string>;
  sender: Record<string, string>;
  history: Record<string, string>;
  categories: Record<MessageCategory, string>;
}

const categoriesEn: Record<MessageCategory, string> = {advertisement:'Advertisements',banking:'Banking & financial',possible_fraud:'Possible fraud',phishing:'Phishing',otp:'OTP / authentication',delivery:'Shopping / delivery',work:'Work / professional',personal:'Personal',social_media:'Social media',unknown:'Unknown'};

const en: FeatureText = {
  privacy:{title:'Privacy dashboard',subtitle:'See what stays on your device and when cloud analysis was used.',localTitle:'Local storage',localBody:'History, settings and sender reports stay in this browser.',cloudTitle:'Cloud processing',cloudBody:'Only scans marked Cloud Analysis were sent to the phishing model.',emailTitle:'Email access',emailStatus:'Not connected',contactsTitle:'Contact access',contactsStatus:'Not connected',retention:'Locally stored scans',export:'Export my data',delete:'Delete scan history',deleteAll:'Delete history and sender reports?',confirmDelete:'Delete local data',cancel:'Keep my data',exported:'Your local RiskRadar data was downloaded.',reported:'Reported senders',noneReported:'No senders have been reported on this device.',reports:'reports',blocked:'Blocked in RiskRadar',repeated:'Repeated suspicious activity on this device',deviceOnly:'These controls affect RiskRadar only; they do not block calls or messages on your phone.'},
  sender:{label:'Sender or source (optional)',placeholder:'Phone number, email address or account name',category:'Category',report:'Report sender',block:'Block in RiskRadar',notSpam:'Not spam',delete:'Delete scan',localOnly:'Reports and blocks stay on this device.',saved:'Saved locally.',missing:'Add a sender before scanning to use sender reporting.'},
  history:{all:'All categories',filter:'Filter by category'},
  categories:categoriesEn,
};

const hi: FeatureText = {
  privacy:{title:'गोपनीयता डैशबोर्ड',subtitle:'देखें कि क्या आपके डिवाइस पर रहता है और क्लाउड कब उपयोग हुआ।',localTitle:'स्थानीय संग्रह',localBody:'इतिहास, सेटिंग्स और रिपोर्ट इसी ब्राउज़र में रहते हैं।',cloudTitle:'क्लाउड प्रोसेसिंग',cloudBody:'केवल क्लाउड विश्लेषण वाले स्कैन मॉडल को भेजे गए।',emailTitle:'ईमेल पहुँच',emailStatus:'कनेक्ट नहीं',contactsTitle:'संपर्क पहुँच',contactsStatus:'कनेक्ट नहीं',retention:'स्थानीय स्कैन',export:'मेरा डेटा डाउनलोड करें',delete:'स्कैन इतिहास हटाएँ',deleteAll:'इतिहास और रिपोर्ट हटाएँ?',confirmDelete:'स्थानीय डेटा हटाएँ',cancel:'डेटा रखें',exported:'RiskRadar डेटा डाउनलोड हो गया।',reported:'रिपोर्ट किए गए भेजने वाले',noneReported:'इस डिवाइस पर कोई रिपोर्ट नहीं।',reports:'रिपोर्ट',blocked:'RiskRadar में ब्लॉक',repeated:'इस डिवाइस पर बार-बार संदिग्ध गतिविधि',deviceOnly:'यह केवल RiskRadar पर लागू होता है; फ़ोन कॉल या संदेश ब्लॉक नहीं होते।'},
  sender:{label:'भेजने वाला या स्रोत (वैकल्पिक)',placeholder:'फ़ोन, ईमेल या खाते का नाम',category:'श्रेणी',report:'भेजने वाले की रिपोर्ट करें',block:'RiskRadar में ब्लॉक करें',notSpam:'स्पैम नहीं',delete:'स्कैन हटाएँ',localOnly:'रिपोर्ट और ब्लॉक इसी डिवाइस पर रहते हैं।',saved:'स्थानीय रूप से सहेजा गया।',missing:'रिपोर्ट के लिए स्कैन से पहले भेजने वाला जोड़ें।'},
  history:{all:'सभी श्रेणियाँ',filter:'श्रेणी से छाँटें'},
  categories:{advertisement:'विज्ञापन',banking:'बैंकिंग और वित्त',possible_fraud:'संभावित धोखाधड़ी',phishing:'फ़िशिंग',otp:'OTP / प्रमाणीकरण',delivery:'खरीदारी / डिलीवरी',work:'काम / पेशेवर',personal:'व्यक्तिगत',social_media:'सोशल मीडिया',unknown:'अज्ञात'},
};

const bn: FeatureText = {
  privacy:{title:'গোপনীয়তা ড্যাশবোর্ড',subtitle:'কী ডিভাইসে থাকে এবং কখন ক্লাউড ব্যবহৃত হয়েছে দেখুন।',localTitle:'স্থানীয় সংরক্ষণ',localBody:'ইতিহাস, সেটিংস ও রিপোর্ট এই ব্রাউজারেই থাকে।',cloudTitle:'ক্লাউড প্রক্রিয়া',cloudBody:'শুধু ক্লাউড বিশ্লেষণ চিহ্নিত স্ক্যান মডেলে গেছে।',emailTitle:'ইমেল অ্যাক্সেস',emailStatus:'সংযুক্ত নয়',contactsTitle:'যোগাযোগ অ্যাক্সেস',contactsStatus:'সংযুক্ত নয়',retention:'স্থানীয় স্ক্যান',export:'আমার ডেটা ডাউনলোড',delete:'স্ক্যান ইতিহাস মুছুন',deleteAll:'ইতিহাস ও রিপোর্ট মুছবেন?',confirmDelete:'স্থানীয় ডেটা মুছুন',cancel:'ডেটা রাখুন',exported:'RiskRadar ডেটা ডাউনলোড হয়েছে।',reported:'রিপোর্ট করা প্রেরক',noneReported:'এই ডিভাইসে কোনো রিপোর্ট নেই।',reports:'রিপোর্ট',blocked:'RiskRadar-এ ব্লক',repeated:'এই ডিভাইসে বারবার সন্দেহজনক কার্যকলাপ',deviceOnly:'এটি শুধু RiskRadar-এ প্রযোজ্য; ফোনের কল বা বার্তা ব্লক হয় না।'},
  sender:{label:'প্রেরক বা উৎস (ঐচ্ছিক)',placeholder:'ফোন, ইমেল বা অ্যাকাউন্টের নাম',category:'বিভাগ',report:'প্রেরক রিপোর্ট করুন',block:'RiskRadar-এ ব্লক',notSpam:'স্প্যাম নয়',delete:'স্ক্যান মুছুন',localOnly:'রিপোর্ট ও ব্লক এই ডিভাইসেই থাকে।',saved:'স্থানীয়ভাবে সংরক্ষিত।',missing:'রিপোর্টের জন্য স্ক্যানের আগে প্রেরক যোগ করুন।'},
  history:{all:'সব বিভাগ',filter:'বিভাগ দিয়ে ফিল্টার'},
  categories:{advertisement:'বিজ্ঞাপন',banking:'ব্যাংকিং ও অর্থ',possible_fraud:'সম্ভাব্য প্রতারণা',phishing:'ফিশিং',otp:'OTP / প্রমাণীকরণ',delivery:'কেনাকাটা / ডেলিভারি',work:'কাজ / পেশা',personal:'ব্যক্তিগত',social_media:'সামাজিক মাধ্যম',unknown:'অজানা'},
};

const ta: FeatureText = {
  privacy:{title:'தனியுரிமை பலகை',subtitle:'எது சாதனத்தில் உள்ளது, மேகம் எப்போது பயன்படுத்தப்பட்டது என்பதைப் பாருங்கள்.',localTitle:'உள்ளூர் சேமிப்பு',localBody:'வரலாறு, அமைப்புகள், புகார்கள் இந்த உலாவியிலேயே இருக்கும்.',cloudTitle:'மேக செயலாக்கம்',cloudBody:'மேக ஆய்வு எனக் குறிக்கப்பட்டவை மட்டுமே மாதிரிக்கு அனுப்பப்பட்டன.',emailTitle:'மின்னஞ்சல் அணுகல்',emailStatus:'இணைக்கப்படவில்லை',contactsTitle:'தொடர்பு அணுகல்',contactsStatus:'இணைக்கப்படவில்லை',retention:'உள்ளூர் ஸ்கேன்கள்',export:'என் தரவைப் பதிவிறக்கு',delete:'ஸ்கேன் வரலாற்றை நீக்கு',deleteAll:'வரலாறும் புகார்களும் நீக்கவா?',confirmDelete:'உள்ளூர் தரவை நீக்கு',cancel:'தரவை வைத்திரு',exported:'RiskRadar தரவு பதிவிறக்கப்பட்டது.',reported:'புகாரளித்த அனுப்புநர்கள்',noneReported:'இந்தச் சாதனத்தில் புகார் இல்லை.',reports:'புகார்கள்',blocked:'RiskRadar-ல் தடுக்கப்பட்டது',repeated:'இந்தச் சாதனத்தில் மீண்டும் சந்தேக செயல்பாடு',deviceOnly:'இது RiskRadar-க்கு மட்டும்; தொலைபேசி அழைப்புகள் அல்லது செய்திகள் தடுக்கப்படாது.'},
  sender:{label:'அனுப்புநர் அல்லது மூலம் (விருப்பம்)',placeholder:'தொலைபேசி, மின்னஞ்சல் அல்லது கணக்கு பெயர்',category:'வகை',report:'அனுப்புநரைப் புகாரளி',block:'RiskRadar-ல் தடு',notSpam:'ஸ்பாம் இல்லை',delete:'ஸ்கேனை நீக்கு',localOnly:'புகார்களும் தடைகளும் இந்தச் சாதனத்தில் இருக்கும்.',saved:'உள்ளூரில் சேமிக்கப்பட்டது.',missing:'புகாருக்கு ஸ்கேன் முன் அனுப்புநரைச் சேர்க்கவும்.'},
  history:{all:'அனைத்து வகைகள்',filter:'வகையால் வடிகட்டு'},
  categories:{advertisement:'விளம்பரங்கள்',banking:'வங்கி மற்றும் நிதி',possible_fraud:'சாத்திய மோசடி',phishing:'ஃபிஷிங்',otp:'OTP / அங்கீகாரம்',delivery:'வாங்குதல் / டெலிவரி',work:'வேலை / தொழில்',personal:'தனிப்பட்ட',social_media:'சமூக ஊடகம்',unknown:'தெரியாதது'},
};

const te: FeatureText = {
  privacy:{title:'గోప్యత డ్యాష్‌బోర్డ్',subtitle:'ఏది పరికరంలో ఉంటుంది, క్లౌడ్ ఎప్పుడు వాడారో చూడండి.',localTitle:'స్థానిక నిల్వ',localBody:'చరిత్ర, సెట్టింగులు, నివేదికలు ఈ బ్రౌజర్‌లోనే ఉంటాయి.',cloudTitle:'క్లౌడ్ ప్రాసెసింగ్',cloudBody:'క్లౌడ్ విశ్లేషణగా గుర్తించిన స్కాన్‌లే మోడల్‌కు వెళ్లాయి.',emailTitle:'ఇమెయిల్ యాక్సెస్',emailStatus:'కనెక్ట్ కాలేదు',contactsTitle:'కాంటాక్ట్ యాక్సెస్',contactsStatus:'కనెక్ట్ కాలేదు',retention:'స్థానిక స్కాన్‌లు',export:'నా డేటా డౌన్‌లోడ్',delete:'స్కాన్ చరిత్ర తొలగించు',deleteAll:'చరిత్ర మరియు నివేదికలు తొలగించాలా?',confirmDelete:'స్థానిక డేటా తొలగించు',cancel:'డేటా ఉంచు',exported:'RiskRadar డేటా డౌన్‌లోడ్ అయింది.',reported:'నివేదించిన పంపినవారు',noneReported:'ఈ పరికరంలో నివేదికలు లేవు.',reports:'నివేదికలు',blocked:'RiskRadarలో బ్లాక్',repeated:'ఈ పరికరంలో పునరావృత అనుమానాస్పద చర్య',deviceOnly:'ఇది RiskRadarలో మాత్రమే; ఫోన్ కాల్స్ లేదా సందేశాలు బ్లాక్ కావు.'},
  sender:{label:'పంపినవారు లేదా మూలం (ఐచ్ఛికం)',placeholder:'ఫోన్, ఇమెయిల్ లేదా ఖాతా పేరు',category:'వర్గం',report:'పంపినవారిని నివేదించు',block:'RiskRadarలో బ్లాక్',notSpam:'స్పామ్ కాదు',delete:'స్కాన్ తొలగించు',localOnly:'నివేదికలు, బ్లాక్‌లు ఈ పరికరంలో ఉంటాయి.',saved:'స్థానికంగా సేవ్ అయింది.',missing:'నివేదిక కోసం స్కాన్ ముందు పంపినవారిని జోడించండి.'},
  history:{all:'అన్ని వర్గాలు',filter:'వర్గం ద్వారా వడపోసు'},
  categories:{advertisement:'ప్రకటనలు',banking:'బ్యాంకింగ్ మరియు ఆర్థిక',possible_fraud:'సంభావ్య మోసం',phishing:'ఫిషింగ్',otp:'OTP / ధృవీకరణ',delivery:'షాపింగ్ / డెలివరీ',work:'పని / వృత్తి',personal:'వ్యక్తిగత',social_media:'సోషల్ మీడియా',unknown:'తెలియదు'},
};

const ml: FeatureText = {
  privacy:{title:'സ്വകാര്യത ഡാഷ്ബോർഡ്',subtitle:'എന്താണ് ഉപകരണത്തിൽ തുടരുന്നതെന്നും ക്ലൗഡ് എപ്പോൾ ഉപയോഗിച്ചെന്നും കാണുക.',localTitle:'പ്രാദേശിക സംഭരണം',localBody:'ചരിത്രം, ക്രമീകരണം, റിപ്പോർട്ട് എന്നിവ ഈ ബ്രൗസറിൽ തന്നെ.',cloudTitle:'ക്ലൗഡ് പ്രോസസ്സിംഗ്',cloudBody:'ക്ലൗഡ് വിശകലനം എന്ന് അടയാളപ്പെടുത്തിയ സ്കാനുകൾ മാത്രം മോഡലിലേക്ക് അയച്ചു.',emailTitle:'ഇമെയിൽ ആക്സസ്',emailStatus:'ബന്ധിപ്പിച്ചിട്ടില്ല',contactsTitle:'കോൺടാക്ട് ആക്സസ്',contactsStatus:'ബന്ധിപ്പിച്ചിട്ടില്ല',retention:'പ്രാദേശിക സ്കാനുകൾ',export:'എന്റെ ഡാറ്റ ഡൗൺലോഡ്',delete:'സ്കാൻ ചരിത്രം നീക്കം ചെയ്യുക',deleteAll:'ചരിത്രവും റിപ്പോർട്ടുകളും നീക്കണോ?',confirmDelete:'പ്രാദേശിക ഡാറ്റ നീക്കുക',cancel:'ഡാറ്റ നിലനിർത്തുക',exported:'RiskRadar ഡാറ്റ ഡൗൺലോഡ് ചെയ്തു.',reported:'റിപ്പോർട്ട് ചെയ്ത അയച്ചവർ',noneReported:'ഈ ഉപകരണത്തിൽ റിപ്പോർട്ടുകളില്ല.',reports:'റിപ്പോർട്ടുകൾ',blocked:'RiskRadar-ൽ ബ്ലോക്ക് ചെയ്തു',repeated:'ഈ ഉപകരണത്തിൽ ആവർത്തിച്ച സംശയകരമായ പ്രവർത്തനം',deviceOnly:'ഇത് RiskRadar-ൽ മാത്രം; ഫോൺ കോളുകളോ സന്ദേശങ്ങളോ ബ്ലോക്ക് ചെയ്യില്ല.'},
  sender:{label:'അയച്ചയാൾ അല്ലെങ്കിൽ ഉറവിടം (ഐച്ഛികം)',placeholder:'ഫോൺ, ഇമെയിൽ അല്ലെങ്കിൽ അക്കൗണ്ട് പേര്',category:'വിഭാഗം',report:'അയച്ചയാളെ റിപ്പോർട്ട് ചെയ്യുക',block:'RiskRadar-ൽ ബ്ലോക്ക്',notSpam:'സ്പാം അല്ല',delete:'സ്കാൻ നീക്കം ചെയ്യുക',localOnly:'റിപ്പോർട്ടുകളും ബ്ലോക്കുകളും ഈ ഉപകരണത്തിൽ തുടരുന്നു.',saved:'പ്രാദേശികമായി സംരക്ഷിച്ചു.',missing:'റിപ്പോർട്ടിന് സ്കാനിന് മുമ്പ് അയച്ചയാളെ ചേർക്കുക.'},
  history:{all:'എല്ലാ വിഭാഗങ്ങളും',filter:'വിഭാഗം ഉപയോഗിച്ച് ഫിൽറ്റർ'},
  categories:{advertisement:'പരസ്യങ്ങൾ',banking:'ബാങ്കിംഗ്, ധനകാര്യം',possible_fraud:'സാധ്യമായ തട്ടിപ്പ്',phishing:'ഫിഷിംഗ്',otp:'OTP / സ്ഥിരീകരണം',delivery:'ഷോപ്പിംഗ് / ഡെലിവറി',work:'ജോലി / പ്രൊഫഷണൽ',personal:'വ്യക്തിപരം',social_media:'സോഷ്യൽ മീഡിയ',unknown:'അജ്ഞാതം'},
};

export const featureText: Record<Language, FeatureText> = { en, hi, bn, ta, te, ml };
