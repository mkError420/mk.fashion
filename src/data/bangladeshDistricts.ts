export const BD_DISTRICTS: string[] = [
  'Dhaka (ঢাকা)',
  'Chattogram (চট্টগ্রাম)',
  'Sylhet (সিলেট)',
  'Rajshahi (রাজশাহী)',
  'Khulna (খুলনা)',
  'Barishal (বরিশাল)',
  'Rangpur (রংপুর)',
  'Mymensingh (ময়মনসিংহ)',
  'Gazipur (গাজীপুর)',
  'Narayanganj (নারায়ণগঞ্জ)',
  'Cumilla (কুমিল্লা)',
  'Bogra (বগুড়া)',
  'Cox\'s Bazar (কক্সবাজার)',
  'Brahmanbaria (ব্রাহ্মণবাড়িয়া)',
  'Noakhali (নোয়াখালী)',
  'Feni (ফেনী)',
  'Chandpur (চাঁদপুর)',
  'Tangail (টাঙ্গাইল)',
  'Faridpur (ফরিদপুর)',
  'Narsingdi (নরসিংদী)',
  'Manikganj (মানিকগঞ্জ)',
  'Munshiganj (মুন্সীগঞ্জ)',
  'Kishoreganj (কিশোরগঞ্জ)',
  'Jamalpur (জামালপুর)',
  'Sherpur (শেরপুর)',
  'Netrokona (নেত্রকোণা)',
  'Pabna (পাবনা)',
  'Sirajganj (সিরাজগঞ্জ)',
  'Natore (নাটোর)',
  'Naogaon (নওগাঁ)',
  'Chapai Nawabganj (চাঁপাইনবাবগঞ্জ)',
  'Joypurhat (জয়পুরহাট)',
  'Dinajpur (দিনাজপুর)',
  'Kurigram (কুড়িগ্রাম)',
  'Gaibandha (গাইবান্ধা)',
  'Nilphamari (নীলফামারী)',
  'Lalmonirhat (লালমনিরহাট)',
  'Thakurgaon (ঠাকুরগাঁও)',
  'Panchagarh (পঞ্চগড়)',
  'Jashore (যশোর)',
  'Kushtia (কুষ্টিয়া)',
  'Jhenaidah (ঝিনাইদহ)',
  'Satkhira (সাতক্ষীরা)',
  'Bagerhat (বাগেরহাট)',
  'Chuadanga (চুয়াডাঙ্গা)',
  'Meherpur (মেহেরপুর)',
  'Magura (মাগুরা)',
  'Narail (নড়াইল)',
  'Patuakhali (পটুয়াখালী)',
  'Bhola (ভোলা)',
  'Pirojpur (পিরোজপুর)',
  'Jhalokathi (ঝালকাঠি)',
  'Barguna (বরগুনা)',
  'Habiganj (হবিগঞ্জ)',
  'Moulvibazar (মৌলভীবাজার)',
  'Sunamganj (সুনামগঞ্জ)',
  'Gopalganj (গোপালগঞ্জ)',
  'Madaripur (মাদারীপুর)',
  'Shariatpur (শরীয়তপুর)',
  'Rajbari (রাজবাড়ী)',
  'Lakshmipur (লক্ষ্মীপুর)',
  'Bandarban (বান্দরবান)',
  'Rangamati (রাঙ্গামাটি)',
  'Khagrachhari (খাগড়াছড়ি)'
];

// Major Metropolitan zones for Dhaka quick selection (retained for backward compatibility)
export const DHAKA_AREAS: string[] = [
  'Dhanmondi',
  'Gulshan 1',
  'Gulshan 2',
  'Banani',
  'Uttara (Sector 1-14)',
  'Mirpur (1, 2, 6, 10, 11, 12, 14)',
  'Bashundhara R/A',
  'Mohakhali / DOHS',
  'Bhatara / Kuril',
  'Mohammadpur',
  'Badda / Rampura',
  'Old Dhaka (Puran Dhaka / Kotwali)',
  'Malibagh / Mouchak',
  'Khilgaon',
  'Tejgaon Industrial Area',
  'Lalmatia',
  'Shantinagar',
  'Wari / Sutrapur',
  'Baridhara Diplomatic Zone',
  'Motijheel / Dilkusha',
  'Paltan / Shahbagh',
  'Savar',
  'Keraniganj',
  'Dhamrai'
];

/**
 * All Thanas / Upazilas mapped for each of Bangladesh's 64 districts.
 * Keys use standardized English district names.
 */
export const BD_DISTRICT_THANAS: Record<string, string[]> = {
  'Dhaka': [
    'Dhanmondi',
    'Gulshan',
    'Banani',
    'Uttara',
    'Mirpur',
    'Mohammadpur',
    'Bashundhara R/A',
    'Motijheel',
    'Badda',
    'Rampura',
    'Malibagh',
    'Khilgaon',
    'Tejgaon',
    'Tejgaon Industrial Area',
    'Lalmatia',
    'Paltan',
    'Ramna',
    'Shahbagh',
    'Lalbagh',
    'New Market',
    'Old Dhaka (Kotwali)',
    'Wari',
    'Sutrapur',
    'Jatrabari',
    'Hazaribagh',
    'Demra',
    'Sabujbagh',
    'Kafrul',
    'Cantonment',
    'Pallabi',
    'Dakshinkhan',
    'Uttarkhan',
    'Turag',
    'Bhatara',
    'Biman Bandar (Airport)',
    'Mugda',
    'Rupnagar',
    'Khilkhet',
    'Kadamtali',
    'Kamrangirchar',
    'Chawkbazar',
    'Gendaria',
    'Bangshal',
    'Kalabagan',
    'Sher-e-Bangla Nagar',
    'Hatirjheel',
    'Shantinagar',
    'Baridhara',
    'Mohakhali DOHS',
    'Mirpur DOHS',
    'Baridhara DOHS',
    'Savar',
    'Dhamrai',
    'Keraniganj',
    'Dohar',
    'Nawabganj'
  ],
  'Chattogram': [
    'Kotwali',
    'Panchlaish',
    'Pahartali',
    'Double Mooring',
    'Patenga',
    'Halishahar',
    'Khulshi',
    'Chandgaon',
    'Bakalia',
    'Bayezid Bostami',
    'Agrabad',
    'Sadarghat',
    'Chawkbazar',
    'EPZ',
    'Karnaphuli',
    'Hathazari',
    'Sitakunda',
    'Mirsharai',
    'Raozan',
    'Rangunia',
    'Patiya',
    'Boalkhali',
    'Anwara',
    'Chandanaish',
    'Satkania',
    'Lohagara',
    'Banshkhali',
    'Sandwip',
    'Fatikchhari'
  ],
  'Gazipur': [
    'Gazipur Sadar',
    'Joydebpur',
    'Tongi East',
    'Tongi West',
    'Gacha',
    'Bason',
    'Konabari',
    'Kashimpur',
    'Kaliakair',
    'Sreepur',
    'Kapasia',
    'Kaliganj'
  ],
  'Narayanganj': [
    'Narayanganj Sadar',
    'Fatullah',
    'Siddhirganj',
    'Bandar',
    'Rupganj',
    'Araihazar',
    'Sonargaon'
  ],
  'Cumilla': [
    'Kotwali / Adarsha Sadar',
    'Sadar South',
    'Burichang',
    'Brahmanpara',
    'Chandina',
    'Chauddagram',
    'Daudkandi',
    'Debidwar',
    'Homna',
    'Laksam',
    'Muradnagar',
    'Nangalkot',
    'Meghna',
    'Titas',
    'Monohargonj',
    'Lalmai',
    'Barura'
  ],
  'Sylhet': [
    'Sylhet Sadar',
    'Kotwali',
    'South Surma',
    'Beanibazar',
    'Golapganj',
    'Balaganj',
    'Fenchuganj',
    'Bishwanath',
    'Companiganj',
    'Gowainghat',
    'Jaintiapur',
    'Kanaighat',
    'Zakiganj',
    'Osmani Nagar'
  ],
  'Rajshahi': [
    'Boalia',
    'Motihar',
    'Rajpara',
    'Shah Makhdum',
    'Chandrima',
    'Kashiadanga',
    'Katakhali',
    'Damkura',
    'Paba',
    'Durgapur',
    'Bagmara',
    'Charghat',
    'Puthia',
    'Bagha',
    'Godagari',
    'Tanore',
    'Mohanpur'
  ],
  'Khulna': [
    'Khulna Sadar',
    'Sonadanga',
    'Khalishpur',
    'Daulatpur',
    'Khan Jahan Ali',
    'Harintana',
    'Aranghata',
    'Batiaghata',
    'Dacope',
    'Dumuria',
    'Dighalia',
    'Koyra',
    'Paikgachha',
    'Phultala',
    'Rupsha',
    'Terokhada'
  ],
  'Barishal': [
    'Kotwali / Barishal Sadar',
    'Airport',
    'Kawnia',
    'Bandar',
    'Bakerganj',
    'Babuganj',
    'Wazirpur',
    'Banaripara',
    'Gournadi',
    'Agailjhara',
    'Mehendiganj',
    'Muladi',
    'Hizla'
  ],
  'Rangpur': [
    'Kotwali / Rangpur Sadar',
    'Tajhat',
    'Haragach',
    'Parshuram',
    'Badarganj',
    'Gangachhara',
    'Kaunia',
    'Mithapukur',
    'Pirgachha',
    'Pirganj',
    'Taraganj'
  ],
  'Mymensingh': [
    'Kotwali / Mymensingh Sadar',
    'Muktagachha',
    'Fulbaria',
    'Trishal',
    'Bhaluka',
    'Gafargaon',
    'Nandail',
    'Ishwarganj',
    'Gauripur',
    'Haluaghat',
    'Dhobaura',
    'Phulpur',
    'Tara Khanda'
  ],
  'Bogra': [
    'Bogura Sadar',
    'Shibganj',
    'Sonatola',
    'Gabtali',
    'Sariakandi',
    'Dhunat',
    'Sherpur',
    'Nandigram',
    'Kahaloo',
    'Adamdighi',
    'Dupchanchia',
    'Shajahanpur'
  ],
  'Cox\'s Bazar': [
    'Cox\'s Bazar Sadar',
    'Chakaria',
    'Maheshkhali',
    'Kutubdia',
    'Ramu',
    'Teknaf',
    'Ukhia',
    'Pekua',
    'Eidgaon'
  ],
  'Brahmanbaria': [
    'Brahmanbaria Sadar',
    'Kasba',
    'Nasirnagar',
    'Nabinagar',
    'Bancharampur',
    'Bijoynagar',
    'Akhaura',
    'Ashuganj',
    'Sarail'
  ],
  'Noakhali': [
    'Sudharam / Noakhali Sadar',
    'Begumganj',
    'Chatkhil',
    'Companiganj',
    'Hatiya',
    'Senbagh',
    'Subarnachar',
    'Kabirhat',
    'Sonaimuri'
  ],
  'Feni': [
    'Feni Sadar',
    'Daganbhuiyan',
    'Chhagalnaiya',
    'Parshuram',
    'Sonagazi',
    'Fulgazi'
  ],
  'Chandpur': [
    'Chandpur Sadar',
    'Faridganj',
    'Haimchar',
    'Haziganj',
    'Kachua',
    'Matlab North',
    'Matlab South',
    'Shahrasti'
  ],
  'Tangail': [
    'Tangail Sadar',
    'Basail',
    'Bhuapur',
    'Delduar',
    'Dhanbari',
    'Ghatail',
    'Gopalpur',
    'Kalihati',
    'Madhupur',
    'Mirzapur',
    'Nagarpur',
    'Sakhipur'
  ],
  'Faridpur': [
    'Faridpur Sadar',
    'Boalmari',
    'Alfadanga',
    'Madhukhali',
    'Bhanga',
    'Nagarkanda',
    'Charbhadrasan',
    'Sadarpur',
    'Saltha'
  ],
  'Narsingdi': [
    'Narsingdi Sadar',
    'Belabo',
    'Monohardi',
    'Palash',
    'Raipura',
    'Shibpur'
  ],
  'Manikganj': [
    'Manikganj Sadar',
    'Singair',
    'Shivalaya',
    'Saturia',
    'Harirampur',
    'Ghior',
    'Daulatpur'
  ],
  'Munshiganj': [
    'Munshiganj Sadar',
    'Tongibari',
    'Serajdikhan',
    'Louhajang',
    'Gazaria',
    'Sreenagar'
  ],
  'Kishoreganj': [
    'Kishoreganj Sadar',
    'Bajitpur',
    'Bhairab',
    'Hossainpur',
    'Itna',
    'Karimganj',
    'Katiadi',
    'Kuliarchar',
    'Mithamain',
    'Nikli',
    'Pakundia',
    'Tarail',
    'Ashtagram'
  ],
  'Jamalpur': [
    'Jamalpur Sadar',
    'Baksiganj',
    'Dewanganj',
    'Islampur',
    'Madarganj',
    'Melandaha',
    'Sarishabari'
  ],
  'Sherpur': [
    'Sherpur Sadar',
    'Jhenaigati',
    'Nakla',
    'Nalitabari',
    'Sreebardi'
  ],
  'Netrokona': [
    'Netrokona Sadar',
    'Atpara',
    'Barhatta',
    'Durgapur',
    'Kalmakanda',
    'Kendua',
    'Madan',
    'Mohanganj',
    'Purbadhala',
    'Khaliajuri'
  ],
  'Pabna': [
    'Pabna Sadar',
    'Atgharia',
    'Bera',
    'Bhangura',
    'Chatmohar',
    'Faridpur',
    'Ishwardi',
    'Santhia',
    'Sujanagar'
  ],
  'Sirajganj': [
    'Sirajganj Sadar',
    'Belkuchi',
    'Chauhali',
    'Kamarkhanda',
    'Kazipur',
    'Raiganj',
    'Shahjadpur',
    'Tarash',
    'Ullapara'
  ],
  'Natore': [
    'Natore Sadar',
    'Bagatipara',
    'Baraigram',
    'Gurudaspur',
    'Lalpur',
    'Singra',
    'Naldanga'
  ],
  'Naogaon': [
    'Naogaon Sadar',
    'Atrai',
    'Badalgachhi',
    'Dhamoirhat',
    'Manda',
    'Mohadevpur',
    'Niamatpur',
    'Patnitala',
    'Porsha',
    'Raninagar',
    'Sapahar'
  ],
  'Chapai Nawabganj': [
    'Chapai Nawabganj Sadar',
    'Bholahat',
    'Gomastapur',
    'Nachole',
    'Shibganj'
  ],
  'Joypurhat': [
    'Joypurhat Sadar',
    'Akkelpur',
    'Kalai',
    'Khetlal',
    'Panchbibi'
  ],
  'Dinajpur': [
    'Dinajpur Sadar',
    'Birampur',
    'Birganj',
    'Birol',
    'Bochaganj',
    'Chirirbandar',
    'Phulbari',
    'Ghoraghat',
    'Hakimpur',
    'Kaharole',
    'Khansama',
    'Nawabganj',
    'Parbatipur'
  ],
  'Kurigram': [
    'Kurigram Sadar',
    'Bhurungamari',
    'Char Rajibpur',
    'Chilmari',
    'Phulbari',
    'Nageshwari',
    'Rajarhat',
    'Raomari',
    'Ulipur'
  ],
  'Gaibandha': [
    'Gaibandha Sadar',
    'Fulchhari',
    'Gobindaganj',
    'Palashbari',
    'Sadullapur',
    'Sughatta',
    'Sundarganj'
  ],
  'Nilphamari': [
    'Nilphamari Sadar',
    'Dimla',
    'Domar',
    'Jaldhaka',
    'Kishoreganj',
    'Saidpur'
  ],
  'Lalmonirhat': [
    'Lalmonirhat Sadar',
    'Aditmari',
    'Hatibandha',
    'Kaliganj',
    'Patgram'
  ],
  'Thakurgaon': [
    'Thakurgaon Sadar',
    'Baliadangi',
    'Haripur',
    'Pirganj',
    'Ranisankail'
  ],
  'Panchagarh': [
    'Panchagarh Sadar',
    'Atwari',
    'Boda',
    'Debiganj',
    'Tetulia'
  ],
  'Jashore': [
    'Jashore Sadar',
    'Abhaynagar',
    'Bagherpara',
    'Chaugachha',
    'Jhikargachha',
    'Keshabpur',
    'Manirampur',
    'Sharsha'
  ],
  'Kushtia': [
    'Kushtia Sadar',
    'Bheramara',
    'Daulatpur',
    'Khoksa',
    'Kumarkhali',
    'Mirpur'
  ],
  'Jhenaidah': [
    'Jhenaidah Sadar',
    'Harinakunda',
    'Kaliganj',
    'Kotchandpur',
    'Maheshpur',
    'Shailkupa'
  ],
  'Satkhira': [
    'Satkhira Sadar',
    'Assasuni',
    'Debhata',
    'Kalaroa',
    'Kaliganj',
    'Shyamnagar',
    'Tala'
  ],
  'Bagerhat': [
    'Bagerhat Sadar',
    'Chitalmari',
    'Fakirhat',
    'Kachua',
    'Mollahat',
    'Mongla',
    'Morrelganj',
    'Rampal',
    'Sarankhola'
  ],
  'Chuadanga': [
    'Chuadanga Sadar',
    'Alamdanga',
    'Damurhuda',
    'Jibannagar'
  ],
  'Meherpur': [
    'Meherpur Sadar',
    'Gangni',
    'Mujibnagar'
  ],
  'Magura': [
    'Magura Sadar',
    'Mohammadpur',
    'Shalikha',
    'Sreepur'
  ],
  'Narail': [
    'Narail Sadar',
    'Kalia',
    'Lohagara'
  ],
  'Patuakhali': [
    'Patuakhali Sadar',
    'Bauphal',
    'Dashmina',
    'Galachipa',
    'Kalapara',
    'Mirzaganj',
    'Rangabali',
    'Dumki'
  ],
  'Bhola': [
    'Bhola Sadar',
    'Burhanuddin',
    'Char Fasson',
    'Daulatkhan',
    'Lalmohan',
    'Manpura',
    'Tazumuddin'
  ],
  'Pirojpur': [
    'Pirojpur Sadar',
    'Bhandaria',
    'Kawkhali',
    'Mathbaria',
    'Nazirpur',
    'Nesarabad (Swarupkathi)',
    'Indurkani (Zianagar)'
  ],
  'Jhalokathi': [
    'Jhalokathi Sadar',
    'Kathalia',
    'Nalchity',
    'Rajapur'
  ],
  'Barguna': [
    'Barguna Sadar',
    'Amtali',
    'Bamna',
    'Betagi',
    'Patharghata',
    'Taltali'
  ],
  'Habiganj': [
    'Habiganj Sadar',
    'Ajmiriganj',
    'Bahubal',
    'Baniyachong',
    'Chunarughat',
    'Lakhai',
    'Madhabpur',
    'Nabiganj',
    'Sayestaganj'
  ],
  'Moulvibazar': [
    'Moulvibazar Sadar',
    'Barlekha',
    'Juri',
    'Kamalganj',
    'Kulaura',
    'Rajnagar',
    'Sreemangal'
  ],
  'Sunamganj': [
    'Sunamganj Sadar',
    'Bishwamvarpur',
    'Chhatak',
    'Derai',
    'Dharamapasha',
    'Dowarabazar',
    'Jagannathpur',
    'Jamalganj',
    'Sullah',
    'Tahirpur',
    'Shantiganj',
    'Madhyanagar'
  ],
  'Gopalganj': [
    'Gopalganj Sadar',
    'Kashiani',
    'Kotalipara',
    'Muksudpur',
    'Tungipara'
  ],
  'Madaripur': [
    'Madaripur Sadar',
    'Kalkini',
    'Rajoir',
    'Shibchar',
    'Dasar'
  ],
  'Shariatpur': [
    'Shariatpur Sadar',
    'Bhedarganj',
    'Damudya',
    'Gosairhat',
    'Naria',
    'Zanjira'
  ],
  'Rajbari': [
    'Rajbari Sadar',
    'Baliakandi',
    'Goalandaghat',
    'Pangsha',
    'Kalukhali'
  ],
  'Lakshmipur': [
    'Lakshmipur Sadar',
    'Raipur',
    'Ramganj',
    'Ramgati',
    'Kamalnagar'
  ],
  'Bandarban': [
    'Bandarban Sadar',
    'Alikadam',
    'Naikhyongchhari',
    'Rowangchhari',
    'Ruma',
    'Thanchi',
    'Lama'
  ],
  'Rangamati': [
    'Rangamati Sadar',
    'Baghaichhari',
    'Barkal',
    'Belaichhari',
    'Juraichhari',
    'Kaptai',
    'Kawkhali',
    'Langadu',
    'Naniarchar',
    'Rajasthali'
  ],
  'Khagrachhari': [
    'Khagrachhari Sadar',
    'Dighinala',
    'Lakshmichhari',
    'Mahalchhari',
    'Manikchhari',
    'Matiranga',
    'Panchhari',
    'Ramgarh',
    'Guimara'
  ]
};

/**
 * Returns all Thanas/Upazilas for any selected district string.
 * Handles district strings like 'Dhaka (ঢাকা)' or 'Dhaka' or 'Chittagong'.
 */
export function getThanasForDistrict(districtName: string): string[] {
  if (!districtName) return BD_DISTRICT_THANAS['Dhaka'] || [];

  // Remove parenthesis and Bengali script if present
  const cleanName = districtName.replace(/\s*\(.*?\)/, '').trim();

  if (BD_DISTRICT_THANAS[cleanName]) {
    return BD_DISTRICT_THANAS[cleanName];
  }

  // Fallback / alternate spelling search
  const normalized = cleanName.toLowerCase();
  for (const key of Object.keys(BD_DISTRICT_THANAS)) {
    const keyLower = key.toLowerCase();
    if (normalized === keyLower) return BD_DISTRICT_THANAS[key];
    if (normalized.includes(keyLower) || keyLower.includes(normalized)) {
      return BD_DISTRICT_THANAS[key];
    }
  }

  // Handle common aliases (e.g. Bogura / Chittagong / Jessore / Comilla)
  if (normalized.includes('bogu') || normalized.includes('bogr')) return BD_DISTRICT_THANAS['Bogra'];
  if (normalized.includes('chitta') || normalized.includes('chatt')) return BD_DISTRICT_THANAS['Chattogram'];
  if (normalized.includes('jesso') || normalized.includes('jash')) return BD_DISTRICT_THANAS['Jashore'];
  if (normalized.includes('comil') || normalized.includes('cumi')) return BD_DISTRICT_THANAS['Cumilla'];
  if (normalized.includes('baris') || normalized.includes('baris')) return BD_DISTRICT_THANAS['Barishal'];

  return ['Sadar', 'Model Thana'];
}

