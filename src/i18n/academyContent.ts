import type { Language } from '@/types';

export interface Lesson { title: string; sign: string; action: string }
export interface PracticeQuestion { text: string; scam: boolean; explanation: string }
interface AcademyContent { lessons: Lesson[]; questions: PracticeQuestion[] }

const en: AcademyContent = {
  lessons: [
    {title:'Electricity bill threats',sign:'A message threatens immediate disconnection and sends you to an unfamiliar payment page.',action:'Check the bill in the official app or call a number you already trust.'},
    {title:'KYC and account suspension',sign:'A sender pressures you to update banking details or disclose a code.',action:'Open the bank’s official app yourself. Never send verification codes.'},
    {title:'Delivery fee requests',sign:'An unexpected parcel message asks for a small payment through a link.',action:'Check tracking on the courier’s official website.'},
    {title:'Lottery and prize fees',sign:'A stranger says you won but must pay before receiving the prize.',action:'Do not pay. Verify the competition independently.'},
    {title:'Job and task offers',sign:'Easy earnings are followed by deposits to unlock tasks or withdrawals.',action:'Verify the employer and never transfer money under pressure.'},
    {title:'Investment promises',sign:'Someone guarantees large profits and asks you to deposit quickly.',action:'Treat guarantees and pressure as warning signs.'},
    {title:'Family impersonation',sign:'A new number claims to be a relative in trouble and requests money.',action:'Call the relative on their known number before acting.'},
    {title:'QR payment traps',sign:'Someone says to scan a payment QR and enter a PIN to receive money.',action:'Do not approve an outgoing payment to receive money.'},
  ],
  questions: [
    {text:'Your electricity will be disconnected tonight. Pay immediately at https://bill-payment.example or send your OTP.',scam:true,explanation:'The deadline, unfamiliar link and OTP request are warning signs.'},
    {text:'Our class begins at 10 AM tomorrow. Please bring your assignment.',scam:false,explanation:'This is an ordinary reminder without a payment or credential request.'},
    {text:'You won a prize! Send a processing fee now to release your winnings.',scam:true,explanation:'An unexpected prize plus an upfront payment is a warning sign.'},
  ],
};

const hi: AcademyContent = {
  lessons:[
    {title:'बिजली बिल की धमकी',sign:'संदेश तुरंत कनेक्शन काटने की धमकी देकर अनजान भुगतान पेज भेजता है।',action:'आधिकारिक ऐप में बिल देखें या भरोसेमंद नंबर पर कॉल करें।'},
    {title:'KYC और खाता बंद होना',sign:'बैंक जानकारी अपडेट करने या कोड बताने का दबाव डाला जाता है।',action:'बैंक का आधिकारिक ऐप स्वयं खोलें। सत्यापन कोड कभी न भेजें।'},
    {title:'डिलीवरी शुल्क',sign:'अचानक आया पार्सल संदेश लिंक से छोटा भुगतान माँगता है।',action:'कूरियर की आधिकारिक वेबसाइट पर ट्रैकिंग जाँचें।'},
    {title:'लॉटरी और इनाम शुल्क',sign:'अजनबी इनाम का दावा करके पहले भुगतान माँगता है।',action:'भुगतान न करें और प्रतियोगिता की अलग से पुष्टि करें।'},
    {title:'नौकरी और टास्क ऑफ़र',sign:'आसान कमाई के बाद टास्क खोलने के लिए जमा माँगा जाता है।',action:'नियोक्ता की पुष्टि करें और दबाव में पैसे न भेजें।'},
    {title:'निवेश के वादे',sign:'बड़े लाभ की गारंटी देकर जल्दी जमा करने को कहा जाता है।',action:'गारंटी और जल्दबाज़ी को चेतावनी समझें।'},
    {title:'परिवार बनकर संदेश',sign:'नया नंबर रिश्तेदार बनकर मुसीबत में पैसे माँगता है।',action:'रिश्तेदार के पुराने नंबर पर सीधे कॉल करें।'},
    {title:'QR भुगतान जाल',sign:'पैसे पाने के लिए भुगतान QR स्कैन कर PIN डालने को कहा जाता है।',action:'पैसे पाने के लिए बाहर जाने वाला भुगतान स्वीकार न करें।'},
  ],
  questions:[
    {text:'आज रात आपकी बिजली कटेगी। तुरंत https://bill-payment.example पर भुगतान करें या OTP भेजें।',scam:true,explanation:'समय सीमा, अनजान लिंक और OTP की माँग चेतावनी संकेत हैं।'},
    {text:'हमारी कक्षा कल सुबह 10 बजे शुरू होगी। अपना असाइनमेंट लाएँ।',scam:false,explanation:'यह सामान्य सूचना है; इसमें भुगतान या गुप्त जानकारी की माँग नहीं है।'},
    {text:'आपने इनाम जीता! रकम पाने के लिए अभी प्रोसेसिंग शुल्क भेजें।',scam:true,explanation:'अनचाहा इनाम और अग्रिम भुगतान की माँग चेतावनी संकेत है।'},
  ],
};

const bn: AcademyContent = {
  lessons:[
    {title:'বিদ্যুৎ বিলের হুমকি',sign:'বার্তা দ্রুত সংযোগ বিচ্ছিন্ন করার হুমকি দিয়ে অচেনা পেমেন্ট পেজে পাঠায়।',action:'অফিসিয়াল অ্যাপে বিল দেখুন বা পরিচিত নম্বরে ফোন করুন।'},
    {title:'KYC ও অ্যাকাউন্ট বন্ধ',sign:'ব্যাংকের তথ্য বা যাচাইকরণ কোড দিতে চাপ দেয়।',action:'ব্যাংকের অফিসিয়াল অ্যাপ নিজে খুলুন। কোনো কোড দেবেন না।'},
    {title:'ডেলিভারি ফি',sign:'অপ্রত্যাশিত পার্সেল বার্তা লিংকে ছোট পেমেন্ট চায়।',action:'কুরিয়ারের অফিসিয়াল ওয়েবসাইটে ট্র্যাকিং দেখুন।'},
    {title:'লটারি ও পুরস্কারের ফি',sign:'অচেনা ব্যক্তি পুরস্কারের আগে টাকা চায়।',action:'টাকা দেবেন না; প্রতিযোগিতা আলাদাভাবে যাচাই করুন।'},
    {title:'চাকরি ও কাজের প্রস্তাব',sign:'সহজ আয়ের পর কাজ খুলতে টাকা জমা দিতে বলে।',action:'নিয়োগকর্তাকে যাচাই করুন এবং চাপে টাকা পাঠাবেন না।'},
    {title:'বিনিয়োগের প্রতিশ্রুতি',sign:'বড় লাভ নিশ্চিত বলে দ্রুত টাকা জমা দিতে চাপ দেয়।',action:'নিশ্চয়তা ও চাপকে সতর্কতার লক্ষণ ধরুন।'},
    {title:'পরিবারের ছদ্মবেশ',sign:'নতুন নম্বর আত্মীয় সেজে জরুরি টাকা চায়।',action:'আত্মীয়ের পরিচিত নম্বরে সরাসরি ফোন করুন।'},
    {title:'QR পেমেন্ট ফাঁদ',sign:'টাকা পেতে QR স্ক্যান করে PIN দিতে বলে।',action:'টাকা পেতে কোনো বহির্গামী পেমেন্ট অনুমোদন করবেন না।'},
  ],
  questions:[
    {text:'আজ রাতে বিদ্যুৎ কাটা হবে। এখনই https://bill-payment.example-এ টাকা দিন বা OTP পাঠান।',scam:true,explanation:'সময়সীমা, অচেনা লিংক ও OTP চাওয়া সতর্কতার লক্ষণ।'},
    {text:'আগামীকাল সকাল ১০টায় ক্লাস। অ্যাসাইনমেন্ট সঙ্গে আনুন।',scam:false,explanation:'এটি সাধারণ স্মরণিকা; টাকা বা গোপন তথ্য চাওয়া হয়নি।'},
    {text:'আপনি পুরস্কার জিতেছেন! পেতে এখনই প্রসেসিং ফি দিন।',scam:true,explanation:'অপ্রত্যাশিত পুরস্কার ও আগাম টাকা চাওয়া সতর্কতার লক্ষণ।'},
  ],
};

const ta: AcademyContent = {
  lessons:[
    {title:'மின்கட்டண மிரட்டல்',sign:'உடனே மின்சாரம் துண்டிக்கப்படும் எனக் கூறி தெரியாத கட்டணப் பக்கத்துக்கு அனுப்புகிறது.',action:'அதிகாரப்பூர்வ செயலியில் கட்டணத்தைப் பார்க்கவும்.'},
    {title:'KYC மற்றும் கணக்கு முடக்கம்',sign:'வங்கி விவரம் அல்லது சரிபார்ப்புக் குறியீட்டைத் தர அழுத்துகிறது.',action:'வங்கியின் அதிகாரப்பூர்வ செயலியை நீங்களே திறக்கவும்.'},
    {title:'டெலிவரி கட்டணம்',sign:'எதிர்பாராத பார்சல் செய்தி இணைப்பில் சிறிய கட்டணம் கேட்கிறது.',action:'கூரியரின் அதிகாரப்பூர்வ தளத்தில் மட்டும் கண்காணிக்கவும்.'},
    {title:'லாட்டரி மற்றும் பரிசுக் கட்டணம்',sign:'அறிமுகமில்லாதவர் பரிசுக்கு முன்பணம் கேட்கிறார்.',action:'பணம் செலுத்தாமல் போட்டியை தனியாக உறுதிசெய்யவும்.'},
    {title:'வேலை மற்றும் டாஸ்க் சலுகை',sign:'எளிய வருமானத்திற்குப் பிறகு டெபாசிட் கேட்கப்படுகிறது.',action:'நிறுவனத்தைச் சரிபார்த்து அழுத்தத்தில் பணம் அனுப்பாதீர்கள்.'},
    {title:'முதலீட்டு வாக்குறுதி',sign:'பெரிய லாபத்தை உறுதி செய்து உடனே முதலீடு செய்யச் சொல்கிறது.',action:'உத்தரவாதமும் அவசரமும் எச்சரிக்கை அறிகுறிகள்.'},
    {title:'குடும்ப உறுப்பினர் போல நடிப்பு',sign:'புதிய எண் உறவினர் போல அவசர பணம் கேட்கிறது.',action:'அவரது அறிந்த எண்ணுக்கு நேரடியாக அழைக்கவும்.'},
    {title:'QR கட்டண வலை',sign:'பணம் பெற QR ஸ்கேன் செய்து PIN இடச் சொல்கிறது.',action:'பணம் பெற வெளியேறும் கட்டணத்தை ஒப்புக்கொள்ளாதீர்கள்.'},
  ],
  questions:[
    {text:'இன்றிரவு மின்சாரம் துண்டிக்கப்படும். https://bill-payment.example-ல் உடனே செலுத்துங்கள் அல்லது OTP அனுப்புங்கள்.',scam:true,explanation:'காலக்கெடு, அறியாத இணைப்பு மற்றும் OTP கோரிக்கை எச்சரிக்கைகள்.'},
    {text:'நாளை காலை 10 மணிக்கு வகுப்பு தொடங்கும். பணியை கொண்டு வாருங்கள்.',scam:false,explanation:'இது சாதாரண நினைவூட்டல்; பணம் அல்லது ரகசியத் தகவல் கேட்கவில்லை.'},
    {text:'நீங்கள் பரிசு வென்றீர்கள்! பெற இப்போது செயலாக்கக் கட்டணம் அனுப்புங்கள்.',scam:true,explanation:'எதிர்பாராத பரிசும் முன்கட்டணமும் எச்சரிக்கை அறிகுறி.'},
  ],
};

const te: AcademyContent = {
  lessons:[
    {title:'విద్యుత్ బిల్లు బెదిరింపు',sign:'వెంటనే కనెక్షన్ తొలగిస్తామని తెలియని చెల్లింపు పేజీకి పంపుతుంది.',action:'అధికారిక యాప్‌లో బిల్లు చూడండి.'},
    {title:'KYC మరియు ఖాతా నిలిపివేత',sign:'బ్యాంక్ వివరాలు లేదా ధృవీకరణ కోడ్ ఇవ్వమని ఒత్తిడి చేస్తుంది.',action:'బ్యాంక్ అధికారిక యాప్‌ను మీరే తెరవండి.'},
    {title:'డెలివరీ రుసుము',sign:'అనుకోని పార్సెల్ సందేశం లింక్‌లో చిన్న చెల్లింపు అడుగుతుంది.',action:'కూరియర్ అధికారిక వెబ్‌సైట్‌లో ట్రాకింగ్ చూడండి.'},
    {title:'లాటరీ మరియు బహుమతి ఫీజు',sign:'తెలియని వ్యక్తి బహుమతి ముందు డబ్బు అడుగుతాడు.',action:'చెల్లించకుండా పోటీని విడిగా ధృవీకరించండి.'},
    {title:'ఉద్యోగం మరియు టాస్క్ ఆఫర్లు',sign:'సులభ సంపాదన తర్వాత టాస్క్ తెరవడానికి డిపాజిట్ అడుగుతారు.',action:'యజమానిని ధృవీకరించి ఒత్తిడిలో డబ్బు పంపవద్దు.'},
    {title:'పెట్టుబడి హామీలు',sign:'పెద్ద లాభం ఖాయమని వెంటనే డిపాజిట్ అడుగుతారు.',action:'హామీ మరియు తొందరను హెచ్చరికగా చూడండి.'},
    {title:'కుటుంబ సభ్యుడిలా నటించడం',sign:'కొత్త నంబర్ బంధువునని చెప్పి అత్యవసర డబ్బు అడుగుతుంది.',action:'తెలిసిన నంబర్‌కు నేరుగా కాల్ చేయండి.'},
    {title:'QR చెల్లింపు ఉచ్చు',sign:'డబ్బు పొందడానికి QR స్కాన్ చేసి PIN పెట్టమంటారు.',action:'డబ్బు పొందడానికి బయటకు వెళ్లే చెల్లింపును ఆమోదించవద్దు.'},
  ],
  questions:[
    {text:'ఈ రాత్రి విద్యుత్ తొలగిస్తాం. https://bill-payment.example వద్ద వెంటనే చెల్లించండి లేదా OTP పంపండి.',scam:true,explanation:'గడువు, తెలియని లింక్ మరియు OTP అభ్యర్థన హెచ్చరికలు.'},
    {text:'రేపు ఉదయం 10 గంటలకు తరగతి. అసైన్‌మెంట్ తీసుకురండి.',scam:false,explanation:'ఇది సాధారణ గుర్తుచేయింపు; చెల్లింపు లేదా రహస్య సమాచారం అడగలేదు.'},
    {text:'మీరు బహుమతి గెలిచారు! పొందడానికి ఇప్పుడే ప్రాసెసింగ్ ఫీజు పంపండి.',scam:true,explanation:'అనుకోని బహుమతి మరియు ముందస్తు చెల్లింపు హెచ్చరిక.'},
  ],
};

const ml: AcademyContent = {
  lessons:[
    {title:'വൈദ്യുതി ബിൽ ഭീഷണി',sign:'ഉടൻ കണക്ഷൻ വിച്ഛേദിക്കുമെന്ന് പറഞ്ഞ് അപരിചിത പേയ്‌മെന്റ് പേജിലേക്ക് അയക്കുന്നു.',action:'ഔദ്യോഗിക ആപ്പിൽ ബിൽ പരിശോധിക്കുക.'},
    {title:'KYCയും അക്കൗണ്ട് നിർത്തലാക്കലും',sign:'ബാങ്ക് വിവരമോ സ്ഥിരീകരണ കോഡോ നൽകാൻ സമ്മർദ്ദം ചെലുത്തുന്നു.',action:'ബാങ്കിന്റെ ഔദ്യോഗിക ആപ്പ് സ്വയം തുറക്കുക.'},
    {title:'ഡെലിവറി ഫീസ്',sign:'അപ്രതീക്ഷിത പാർസൽ സന്ദേശം ലിങ്കിലൂടെ ചെറിയ പണം ചോദിക്കുന്നു.',action:'കുറിയറിന്റെ ഔദ്യോഗിക വെബ്‌സൈറ്റിൽ ട്രാക്കിങ് നോക്കുക.'},
    {title:'ലോട്ടറിയും സമ്മാന ഫീസും',sign:'അപരിചിതൻ സമ്മാനത്തിന് മുമ്പ് പണം ചോദിക്കുന്നു.',action:'പണം നൽകരുത്; മത്സരം സ്വതന്ത്രമായി പരിശോധിക്കുക.'},
    {title:'ജോലിയും ടാസ്ക് ഓഫറും',sign:'എളുപ്പ വരുമാനത്തിന് ശേഷം ടാസ്ക് തുറക്കാൻ ഡെപ്പോസിറ്റ് ചോദിക്കുന്നു.',action:'തൊഴിലുടമയെ പരിശോധിച്ച് സമ്മർദ്ദത്തിൽ പണം അയക്കരുത്.'},
    {title:'നിക്ഷേപ വാഗ്ദാനം',sign:'വലിയ ലാഭം ഉറപ്പാക്കി വേഗം നിക്ഷേപിക്കാൻ പറയുന്നു.',action:'ഉറപ്പും തിരക്കും മുന്നറിയിപ്പായി കാണുക.'},
    {title:'കുടുംബാംഗമായി നടിക്കൽ',sign:'പുതിയ നമ്പർ ബന്ധുവായി നടിച്ച് അടിയന്തര പണം ചോദിക്കുന്നു.',action:'ബന്ധുവിന്റെ അറിയാവുന്ന നമ്പറിലേക്ക് നേരിട്ട് വിളിക്കുക.'},
    {title:'QR പേയ്‌മെന്റ് കെണി',sign:'പണം ലഭിക്കാൻ QR സ്കാൻ ചെയ്ത് PIN നൽകാൻ പറയുന്നു.',action:'പണം ലഭിക്കാൻ പുറത്തേക്കുള്ള പേയ്‌മെന്റ് അംഗീകരിക്കരുത്.'},
  ],
  questions:[
    {text:'ഇന്ന് രാത്രി വൈദ്യുതി വിച്ഛേദിക്കും. https://bill-payment.example-ൽ ഉടൻ പണമടയ്ക്കുക അല്ലെങ്കിൽ OTP അയക്കുക.',scam:true,explanation:'സമയപരിധി, അപരിചിത ലിങ്ക്, OTP അഭ്യർത്ഥന എന്നിവ മുന്നറിയിപ്പുകളാണ്.'},
    {text:'നാളെ രാവിലെ 10 മണിക്ക് ക്ലാസ് തുടങ്ങും. അസൈൻമെന്റ് കൊണ്ടുവരിക.',scam:false,explanation:'ഇത് സാധാരണ ഓർമ്മപ്പെടുത്തലാണ്; പണമോ രഹസ്യ വിവരമോ ചോദിക്കുന്നില്ല.'},
    {text:'നിങ്ങൾ സമ്മാനം നേടി! ലഭിക്കാൻ ഇപ്പോൾ പ്രോസസ്സിംഗ് ഫീസ് അയക്കുക.',scam:true,explanation:'അപ്രതീക്ഷിത സമ്മാനവും മുൻകൂർ പണമടയ്ക്കലും മുന്നറിയിപ്പാണ്.'},
  ],
};

export const academyContent: Record<Language, AcademyContent> = { en, hi, bn, ta, te, ml };
