/**
 * Name database for the Lore Forge character wizard.
 * All cultures are D&D 5e. Names sourced from XGE/MTF/PHB via 5etools.
 * 10 cultures have sub-cultures, 2 are flat.
 */

export const NAME_DATABASE = {

  // =========================================================================
  // HUMAN — 6 Forgotten Realms ethnicities (names from XGE via 5etools)
  // =========================================================================
  human: {
    subCultures: {
      calishite: {
        male: [
          "Abbad", "Abdul", "Achmed", "Akeem", "Alif",
          "Amir", "Asim", "Bashir", "Bassam", "Fahim",
          "Farid", "Farouk", "Fayez", "Fayyaad", "Fazil",
          "Hakim", "Halil", "Hamid", "Hazim", "Heydar",
          "Hussein", "Jabari", "Jafar", "Khalid", "Tariq"
        ],
        female: [
          "Aaliyah", "Aida", "Akilah", "Alia", "Amina",
          "Atefeh", "Chaima", "Dalia", "Ehsan", "Elham",
          "Farah", "Fatemah", "Gamila", "Kamaria", "Khadija",
          "Layla", "Nabila", "Nadine", "Naima", "Najila",
          "Nura", "Qadira", "Rahima", "Saadia", "Zahra"
        ],
        surnames: [
          "al-Amari", "al-Fahim", "al-Hakim", "al-Rashid", "al-Sayed",
          "ibn Khalid", "al-Nadir", "al-Qadir", "al-Zahir", "al-Basri",
          "al-Mahdi", "al-Sharif"
        ]
      },
      chondathan: {
        male: [
          "Adam", "Adelard", "Aldous", "Anselm", "Arnold",
          "Bernard", "Bertram", "Charles", "Conrad", "Diggory",
          "Everard", "Frederick", "Geoffrey", "Gerald", "Gilbert",
          "Godfrey", "Henry", "Hubert", "Hugh", "John",
          "Percival", "Randal", "Richard", "Roland", "William"
        ],
        female: [
          "Adelaide", "Agatha", "Agnes", "Alice", "Avelina",
          "Beatrice", "Cecily", "Eleanor", "Elizabeth", "Ella",
          "Eloise", "Emma", "Emmeline", "Eva", "Giselle",
          "Helen", "Isabella", "Jane", "Joan", "Juliana",
          "Katherine", "Margery", "Matilda", "Rosamund", "Sybil"
        ],
        surnames: [
          "Amblecrown", "Buckman", "Dundragon", "Evenwood", "Greycastle",
          "Hallwinter", "Langford", "Mercer", "Northwood", "Stonebridge",
          "Tallstag", "Whitmore"
        ]
      },
      illuskan: {
        male: [
          "Agni", "Alaric", "Anvindr", "Arvid", "Asger",
          "Asmund", "Bjorn", "Brandr", "Brynjar", "Calder",
          "Colborn", "Egil", "Einar", "Eric", "Erland",
          "Halvar", "Hjalmar", "Ivar", "Leif", "Sigurd",
          "Sten", "Sven", "Trygve", "Ulf", "Vidar"
        ],
        female: [
          "Alfhild", "Arnbjorg", "Astrid", "Audhid", "Bergljot",
          "Brenna", "Brynhild", "Dagmar", "Eira", "Gudrun",
          "Gunhild", "Helga", "Hilde", "Ingrid", "Jorunn",
          "Kari", "Nanna", "Ragna", "Ragnhild", "Runa",
          "Sigrid", "Solveg", "Thora", "Vigdis", "Ylva"
        ],
        surnames: [
          "Bjornsson", "Eriksson", "Haldorsen", "Ivarsdottir", "Ragnarsson",
          "Sigurdsen", "Stormborn", "Thorvaldsen", "Ulfsson", "Windhelm",
          "Ironside", "Frostgard"
        ]
      },
      mulan: {
        male: [
          "Ahmose", "Akhom", "Amasis", "Amenemhet", "Anen",
          "Banefre", "Bek", "Djedefre", "Djoser", "Hekaib",
          "Horemheb", "Huya", "Imhotep", "Ineni", "Ipuki",
          "Kagemni", "Kawab", "Kenamon", "Khafra", "Nebamun",
          "Ramose", "Sebni", "Senusret", "Shabaka", "Thaneni"
        ],
        female: [
          "Ahset", "Amunet", "Aneksi", "Atet", "Baketamon",
          "Betrest", "Bunefer", "Dedyet", "Hatshepsut", "Hetepheres",
          "Intakaes", "Itet", "Kasmut", "Kemanub", "Kiya",
          "Maia", "Merit", "Meritamen", "Merneith", "Nefertiti",
          "Neferu", "Neithotep", "Peseshet", "Sitamun", "Taweret"
        ],
        surnames: [
          "Ankhalab", "Anskuld", "Fezim", "Hahpet", "Nathandem",
          "Sepret", "Uuthrakt", "Maerschal", "Bezantur", "Thazalhar",
          "Sultaran", "Nethjet"
        ]
      },
      shou: {
        male: [
          "Bingwen", "Bo", "Bolin", "Chang", "Chao",
          "Chen", "Cheng", "Da", "Fang", "Feng",
          "Fu", "Gang", "Guang", "Hai", "Heng",
          "Hong", "Huan", "Jian", "Kang", "Lei",
          "Liang", "Ling", "Peng", "Shan", "Wei"
        ],
        female: [
          "Ai", "Anming", "Baozhai", "Bei", "Caixia",
          "Chen", "Chunhua", "Daiyu", "Die", "Ehuang",
          "Fenfang", "Ge", "Hong", "Huan", "Huifang",
          "Jia", "Lan", "Li", "Lihua", "Lin",
          "Meili", "Ning", "Qi", "Shu", "Ying"
        ],
        surnames: [
          "Chien", "Huang", "Kao", "Kung", "Lao",
          "Ling", "Mei", "Pin", "Shin", "Tan",
          "Wan", "Xiao"
        ]
      },
      turami: {
        male: [
          "Alexandre", "Alfonso", "Alonso", "Arturo", "Bartoleme",
          "Benito", "Carlos", "Damian", "Diego", "Domingo",
          "Enrique", "Fernando", "Gabriel", "Gaspar", "Jorge",
          "Jose", "Juan", "Martin", "Miguel", "Pascual",
          "Pedro", "Ramiro", "Ramon", "Rodrigo", "Tomas"
        ],
        female: [
          "Abella", "Adalina", "Adora", "Adriana", "Ana",
          "Antonia", "Beatriz", "Camila", "Carmen", "Dolores",
          "Elena", "Esmerelda", "Francisca", "Gabriela", "Imelda",
          "Isabel", "Juana", "Leonor", "Lucinda", "Maria",
          "Maricela", "Rafaela", "Sofia", "Teresa", "Veronica"
        ],
        surnames: [
          "Agosto", "Astorio", "Calabra", "Domine", "Falone",
          "Marivaldi", "Pisacar", "Ramondo", "Dorada", "Escudar",
          "Torremol", "Vasante"
        ]
      }
    }
  },

  // =========================================================================
  // ELVEN — 5 sub-cultures
  // =========================================================================
  elven: {
    subCultures: {
      highElf: {
        male: [
          "Adran", "Aelar", "Aramil", "Arannis", "Berrian",
          "Caeldrim", "Galinndan", "Hadarai", "Himo", "Immeral",
          "Ivellios", "Laucian", "Mindartis", "Paelias", "Quarion",
          "Riardon", "Rolen", "Soveliss", "Thamior", "Tharivol",
          "Theren", "Uthemar", "Vanuath", "Varis", "Fivin"
        ],
        female: [
          "Adrie", "Althaea", "Bethrynna", "Birel", "Caelynn",
          "Chaedi", "Drusilia", "Enna", "Felosial", "Ielenia",
          "Ilanis", "Jelenneth", "Keyleth", "Lia", "Meriele",
          "Mialee", "Naivara", "Quelenna", "Sariel", "Shanairla",
          "Silaqui", "Valanthe", "Valna", "Xanaphia", "Thiala"
        ],
        surnames: [
          "Amakiir", "Galanodel", "Holimion", "Ilphelkiir", "Liadon",
          "Meliamne", "Siannodel", "Xiloscient", "Amastacia", "Casilltenirra",
          "Ethanasath", "Qualanthri"
        ]
      },
      woodElf: {
        male: [
          "Aerdeth", "Ahvain", "Aust", "Azaki", "Beiro",
          "Carric", "Dayereth", "Dreali", "Efferil", "Eiravel",
          "Enialis", "Erdan", "Erevan", "Gennal", "Halimath",
          "Heian", "Korfel", "Lamlis", "Lucan", "Naal",
          "Nutae", "Peren", "Suhnae", "Thervan", "Theriatis"
        ],
        female: [
          "Ahinar", "Anastrianna", "Andraste", "Antinua", "Arara",
          "Baelitae", "Claira", "Dara", "Elama", "Faral",
          "Hatae", "Irann", "Jarsali", "Leshanna", "Maiathah",
          "Malquis", "Myathethil", "Quillathe", "Ridaro", "Shava",
          "Sumnes", "Theirastra", "Tiaathque", "Traulam", "Vadania"
        ],
        surnames: [
          "Nailo", "Nightbreeze", "Oakenheel", "Sylvaranth", "Berevan",
          "Caerdonel", "Dalanthan", "Floshem", "Goltorah", "Iathrana",
          "Koehlanna", "Lathalas"
        ]
      },
      drow: {
        male: [
          "Drizzt", "Zaknafein", "Jarlaxle", "Pharaun", "Rizzen",
          "Belgos", "Elkantar", "Guldor", "Houndaer", "Ilmryn",
          "Kelnozz", "Malaggar", "Nilonim", "Nym", "Pelloth",
          "Quevas", "Ryltar", "Solaufein", "Tsabrak", "Urlryn",
          "Valas", "Xullrae", "Zekith", "Szordrin", "Nalfein"
        ],
        female: [
          "Quenthel", "Viconia", "Alybre", "Briza", "Chalithra",
          "Dhaunae", "Eclavdra", "Faeryl", "Greyanna", "Halisstra",
          "Ilivarra", "Jhael", "Kyrnill", "Liriel", "Minolin",
          "Nedylene", "Olandra", "Phaere", "Rilrae", "Sharlotta",
          "Talice", "Umrae", "Vlondril", "Waerva", "Zilvra"
        ],
        surnames: [
          "Do'Urden", "Baenre", "Oblodra", "DeVir", "Hunzrin",
          "Kenafin", "Mizzrym", "Noquar", "Srune'lett", "Teken'duis",
          "Xorlarrin", "Zauvirr"
        ]
      },
      seaElf: {
        male: [
          "Thalor", "Merindal", "Corallon", "Delphin", "Erevos",
          "Finrod", "Galenar", "Halcyon", "Ithacor", "Kelphar",
          "Lirondel", "Marindor", "Nerathis", "Oceanus", "Pelagius",
          "Rhydian", "Selkir", "Tidus", "Ulmar", "Varenth",
          "Wavecrest", "Xanthir", "Yondir", "Zareth", "Aquilan"
        ],
        female: [
          "Thalassa", "Nerida", "Amphira", "Breena", "Coralia",
          "Delphine", "Elowen", "Fathoma", "Galatea", "Halimeda",
          "Iridia", "Jennavere", "Kaimana", "Lorelei", "Marina",
          "Nautica", "Ondine", "Pelagia", "Rillette", "Sirena",
          "Tethys", "Undine", "Vespera", "Waverly", "Yara"
        ],
        surnames: [
          "Tidecaller", "Deepcurrent", "Coralheim", "Stormsurf", "Pearlshore",
          "Saltwind", "Seabreeze", "Waveborn", "Driftwood", "Foamrider",
          "Shellwhisper", "Riptide"
        ]
      },
      eladrin: {
        male: [
          "Aurelian", "Caelorin", "Dawneth", "Equinath", "Feywarden",
          "Gloaming", "Harevon", "Ilmyrith", "Jorivald", "Lucivar",
          "Miraneth", "Novariel", "Opalinor", "Prismaris", "Quorathel",
          "Raventhorn", "Solarius", "Twilindor", "Ulthran", "Verithas",
          "Wynnstan", "Xanathos", "Ystrael", "Zephyrion", "Kalathel"
        ],
        female: [
          "Amaranth", "Blossia", "Celestine", "Dawnpetal", "Ephemera",
          "Fioritura", "Glissanda", "Hesperion", "Iridessa", "Jacinthe",
          "Kaleidra", "Luminara", "Meridia", "Novalise", "Opalina",
          "Prismatica", "Quillara", "Rosalinde", "Solstice", "Twilight",
          "Umbraleth", "Verdania", "Wistaria", "Xylia", "Zephyrine"
        ],
        surnames: [
          "Dawnstrider", "Twilightbloom", "Starflower", "Moonpetal", "Sunweaver",
          "Frostbloom", "Autumnfire", "Springvale", "Summerwind", "Winterglow",
          "Evershade", "Shimmerleaf"
        ]
      }
    }
  },

  // =========================================================================
  // DWARVEN — 3 sub-cultures (names from XGE via 5etools)
  // =========================================================================
  dwarven: {
    subCultures: {
      hillDwarf: {
        male: [
          "Adrik", "Barendd", "Dain", "Dalgal", "Eberk",
          "Einkil", "Gardain", "Harbek", "Kildrak", "Kilvar",
          "Morgran", "Nalral", "Nordak", "Orsik", "Oskar",
          "Rangrim", "Rurik", "Taklinn", "Thorin", "Tordek",
          "Travok", "Ulfgar", "Vondal", "Bruenor", "Flint"
        ],
        female: [
          "Anbera", "Audhild", "Bardryn", "Dagnal", "Diesa",
          "Eldeth", "Falkrunn", "Gunnloda", "Gurdis", "Helja",
          "Kathra", "Kristryd", "Liftrasa", "Mardred", "Nora",
          "Riswynn", "Sannl", "Torbera", "Tordrid", "Vistra",
          "Agna", "Bodill", "Helgret", "Ilde", "Jarana"
        ],
        surnames: [
          "Battlehammer", "Brawnanvil", "Fireforge", "Gorunn", "Holderhek",
          "Loderr", "Torunn", "Ungart", "Stonehill", "Meadkeeper",
          "Goldwheat", "Hearthguard"
        ]
      },
      mountainDwarf: {
        male: [
          "Alberich", "Baern", "Beloril", "Brottor", "Darrak",
          "Delg", "Elaim", "Erias", "Fallond", "Fargrim",
          "Gilthur", "Gimgen", "Gimurt", "Morkral", "Nuraval",
          "Oloric", "Olunt", "Reirak", "Thradal", "Thoradin",
          "Traubon", "Uraim", "Veit", "Vonbin", "Whurbin"
        ],
        female: [
          "Artin", "Balifra", "Barbena", "Bolhild", "Dariff",
          "Delre", "Eridred", "Fallthra", "Finellen", "Gillydd",
          "Hlin", "Kilia", "Marastyr", "Morana", "Nalaed",
          "Nurkara", "Oriff", "Ovina", "Therlin", "Thodris",
          "Torgga", "Urshar", "Valida", "Vonana", "Werydd"
        ],
        surnames: [
          "Dankil", "Frostbeard", "Ironfist", "Strakeln", "Deepdelver",
          "Stoneforge", "Anvilbreaker", "Hammerstone", "Steelfist", "Silveraxe",
          "Steelpeak", "Granitehelm"
        ]
      },
      duergar: {
        male: [
          "Duergath", "Dworic", "Grindol", "Ashar", "Blithen",
          "Crommor", "Endrik", "Grael", "Horth", "Irik",
          "Jharak", "Kurst", "Laduguer", "Morkai", "Nimor",
          "Prak", "Rathik", "Skarn", "Torvak", "Undrak",
          "Vorn", "Wrathion", "Druergar", "Forge", "Qurn"
        ],
        female: [
          "Hilde", "Karlae", "Ashan", "Bryndle", "Caskia",
          "Dornae", "Elsha", "Fenra", "Grika", "Helsha",
          "Irka", "Jornae", "Kresta", "Lurda", "Mordra",
          "Nulka", "Orsha", "Praska", "Quorna", "Rathla",
          "Skarla", "Thrynn", "Ulraka", "Vorsha", "Wrethka"
        ],
        surnames: [
          "Ashlord", "Battlegore", "Doomfist", "Earthlord", "Firetamer",
          "Knifemind", "Mindeater", "Necksnapper", "Orehammer", "Runehammer",
          "Thundermaster", "Underearth"
        ]
      }
    }
  },

  // =========================================================================
  // HALFLING — 2 sub-cultures (names from XGE via 5etools)
  // =========================================================================
  halfling: {
    subCultures: {
      lightfoot: {
        male: [
          "Alton", "Ander", "Cade", "Corrin", "Dannad",
          "Eldon", "Fildo", "Finnan", "Garret", "Jasper",
          "Lyle", "Merric", "Milo", "Osborn", "Perrin",
          "Roscoe", "Reed", "Wellby", "Wendel", "Bernie",
          "Eddie", "Franklin", "Gilbert", "Kevin", "Sam"
        ],
        female: [
          "Alain", "Andry", "Bree", "Callie", "Cora",
          "Euphemia", "Jillian", "Kithri", "Lavinia", "Lidda",
          "Marigold", "Nedda", "Paela", "Portia", "Rosalind",
          "Seraphina", "Shaena", "Trym", "Vani", "Wella",
          "Bella", "Blossom", "Dee", "Jo", "Merla"
        ],
        surnames: [
          "Brushgather", "Goodbarrel", "Greenbottle", "High-hill", "Hilltopple",
          "Leagallow", "Tealeaf", "Thorngage", "Tosscobble", "Underbough",
          "Warmwater", "Hearthfire"
        ]
      },
      stout: {
        male: [
          "Bobbin", "Callus", "Danniel", "Egart", "Gob",
          "Garth", "Harol", "Igor", "Keith", "Lazam",
          "Lerry", "Lindal", "Mican", "Morrin", "Nebin",
          "Nevil", "Ostran", "Oswalt", "Poppy", "Shardon",
          "Tye", "Ulmo", "Wes", "Wenner", "Torbul"
        ],
        female: [
          "Anne", "Chenna", "Dell", "Eida", "Eran",
          "Georgina", "Gynnie", "Harriet", "Jasmine", "Maegan",
          "Myria", "Nikki", "Nora", "Olivia", "Pearl",
          "Pennie", "Philomena", "Robbie", "Rose", "Saral",
          "Stacee", "Tawna", "Thea", "Tyna", "Willow"
        ],
        surnames: [
          "Stoutbridge", "Stoutman", "Strongbones", "Copperkettle", "Fatrabbit",
          "Hogcollar", "Porridgepot", "Deephollow", "Elderberry", "Honeypot",
          "Appleblossom", "Cherrycheeks"
        ]
      }
    }
  },

  // =========================================================================
  // GNOME — 3 sub-cultures (base names from XGE via 5etools)
  // =========================================================================
  gnome: {
    subCultures: {
      rockGnome: {
        male: [
          "Alston", "Alvyn", "Boddynock", "Brocc", "Burgell",
          "Dimble", "Eldon", "Erky", "Fonkin", "Frug",
          "Gerbo", "Gimble", "Glim", "Jebeddo", "Kellen",
          "Namfoodle", "Orryn", "Roondar", "Seebo", "Sindri",
          "Warryn", "Wrenn", "Zook", "Dabbledob", "Fibblestib"
        ],
        female: [
          "Bimpnottin", "Breena", "Caramip", "Carlin", "Donella",
          "Duvamil", "Ella", "Ellyjoybell", "Ellywick", "Lilli",
          "Loopmottin", "Lorilla", "Nissa", "Nyx", "Oda",
          "Orla", "Roywyn", "Shamil", "Tana", "Waywocket",
          "Zanna", "Callybon", "Enidda", "Quilla", "Ranala"
        ],
        surnames: [
          "Bafflestone", "Beren", "Daergel", "Folkor", "Garrick",
          "Nackle", "Ningel", "Scheppen", "Timbers", "Turen",
          "Glittergem", "Ironhide"
        ]
      },
      forestGnome: {
        male: [
          "Anverth", "Arumawann", "Bilbron", "Cockaby", "Crampernap",
          "Delebean", "Eberdeb", "Fablen", "Frouse", "Igden",
          "Jabble", "Kipper", "Oppleby", "Paggen", "Pallabar",
          "Pog", "Qualen", "Ribbles", "Rimple", "Sapply",
          "Senteq", "Umpen", "Wiggens", "Wobbles", "Zaffrab"
        ],
        female: [
          "Abalaba", "Buvvie", "Cumpen", "Dalaba", "Luthra",
          "Mardnab", "Meena", "Menny", "Mumpena", "Numba",
          "Oppah", "Panana", "Pyntle", "Reddlepop", "Salanop",
          "Siffress", "Symma", "Tenena", "Tervaround", "Tippletoe",
          "Ulla", "Unvera", "Veloptima", "Virra", "Yebe"
        ],
        surnames: [
          "Boondiggles", "Cobblelob", "Fapplestamp", "Fiddlefen", "Gobblefirn",
          "Humplebumple", "Leffery", "Miggledy", "Munggen", "Musgraben",
          "Oomtrowl", "Wildwander"
        ]
      },
      deepGnome: {
        male: [
          "Belwar", "Brickers", "Burrow", "Durthmeck", "Firble",
          "Krieger", "Schneltheck", "Schnicktick", "Thulwar", "Gimrik",
          "Karst", "Moldur", "Nackle", "Rumpus", "Scoria",
          "Spelunk", "Storn", "Terrak", "Undrik", "Vognur",
          "Grubbin", "Jasrik", "Knobble", "Pilgar", "Quarl"
        ],
        female: [
          "Beliss", "Durthane", "Fricknarti", "Ivridda", "Krisvyre",
          "Lulthiss", "Nalvarti", "Nesbit", "Pindurl", "Schnella",
          "Tervarti", "Ulla", "Vorthi", "Wulfreda", "Yarga",
          "Brunhiss", "Dagni", "Felga", "Grista", "Hulmara",
          "Jalinda", "Korvi", "Lorathi", "Melvara", "Olga"
        ],
        surnames: [
          "Shadowcloak", "Silverthread", "Pilwicken", "Dunben", "Gummen",
          "Horcusporcus", "Lingenhall", "Loofollue", "Nucklestamp", "Offund",
          "Rofferton", "Umbodoben"
        ]
      }
    }
  },

  // =========================================================================
  // ORCISH — 2 sub-cultures (names from XGE via 5etools)
  // =========================================================================
  orcish: {
    subCultures: {
      orc: {
        male: [
          "Grukk", "Thokk", "Dench", "Feng", "Gell",
          "Henk", "Imsh", "Krusk", "Ront", "Shump",
          "Tarak", "Ugruk", "Bazrag", "Durgat", "Gornak",
          "Holg", "Juruk", "Nargol", "Ragash", "Skullak",
          "Vrag", "Yurk", "Zuggthar", "Brukk", "Gharl"
        ],
        female: [
          "Sharga", "Buga", "Baggi", "Engong", "Kansif",
          "Myev", "Neega", "Ovak", "Shautha", "Vola",
          "Yevelda", "Droga", "Gritza", "Hargu", "Ilnesh",
          "Korra", "Lagazi", "Murook", "Nogu", "Ootah",
          "Rahga", "Sulka", "Trega", "Zurga", "Emen"
        ],
        surnames: [
          "Bloodfang", "Doomhammer", "Gorefist", "Irontusk", "Skullcrusher",
          "Bonesnapper", "Ashgrath", "Graznak", "Throkkmar", "Vulgrod",
          "Kragthar", "Muzgash"
        ]
      },
      halfOrc: {
        male: [
          "Argran", "Braak", "Brug", "Cagak", "Dorn",
          "Dren", "Druuk", "Gnarsh", "Grumbar", "Gubrash",
          "Hagren", "Hogar", "Karash", "Karg", "Keth",
          "Korag", "Lubash", "Mhurren", "Mord", "Ohr",
          "Rendar", "Resh", "Sark", "Thar", "Vilberg"
        ],
        female: [
          "Arha", "Bendoo", "Bilga", "Brakka", "Creega",
          "Drenna", "Ekk", "Fistula", "Gaaki", "Gorga",
          "Grai", "Greeba", "Grigi", "Gynk", "Hrathy",
          "Huru", "Ilga", "Kabbarg", "Lezre", "Murgen",
          "Nagrette", "Nella", "Puyet", "Reeza", "Sutha"
        ],
        surnames: [
          "Ashford", "Blackwood", "Ironsides", "Stonefist", "Thornwall",
          "Battleborn", "Greymantle", "Redtusk", "Stormrage", "Wargrim",
          "Halfblood", "Twinheritage"
        ]
      }
    }
  },

  // =========================================================================
  // DRACONIC — 3 sub-cultures (names from XGE via 5etools)
  // =========================================================================
  draconic: {
    subCultures: {
      chromatic: {
        male: [
          "Kriv", "Balasar", "Arjhan", "Bharash", "Donaar",
          "Ghesh", "Heskan", "Medrash", "Nadarr", "Rhogar",
          "Shamash", "Tarhun", "Torinn", "Azzakh", "Grax",
          "Nithther", "Voruc", "Xarzith", "Dazzazn", "Gorbundus",
          "Hirrathak", "Ildrex", "Maagog", "Mozikth", "Nykkan"
        ],
        female: [
          "Akra", "Biri", "Daar", "Harann", "Jheri",
          "Kava", "Korinn", "Mishann", "Nala", "Perra",
          "Raiann", "Sora", "Surina", "Thava", "Uadjit",
          "Vezera", "Zofra", "Anbraxia", "Drethka", "Ixen",
          "Blendaeth", "Chassath", "Dentratha", "Eggren", "Findex"
        ],
        surnames: [
          "Clethtinthiallor", "Daardendrian", "Delmirev", "Drachedandion",
          "Kepeshkmolik", "Norixius", "Shestendeliath", "Turnuroth",
          "Skaarzborroosh", "Pyraxtallinost", "Raghthroknaar", "Yarjerit"
        ]
      },
      metallic: {
        male: [
          "Pandjed", "Shedinn", "Baradad", "Dadalan", "Fax",
          "Gargax", "Greethen", "Kaladan", "Kerkad", "Kiirith",
          "Mehen", "Mreksh", "Mugrunden", "Patrin", "Pijjirik",
          "Quarethon", "Rathkran", "Rivaan", "Sethrekar", "Srorthen",
          "Trynnicus", "Valorean", "Vrondiss", "Zedaar", "Direcris"
        ],
        female: [
          "Aasathra", "Antrara", "Arava", "Burana", "Doudra",
          "Driindar", "Farideh", "Furrele", "Gesrethe", "Gilkass",
          "Havilar", "Hethress", "Hillanot", "Jaxi", "Jezean",
          "Kadana", "Megren", "Mijira", "Nuthra", "Pogranix",
          "Pyxrin", "Quespa", "Rezena", "Savaran", "Tatyan"
        ],
        surnames: [
          "Kerrhylon", "Ophinshtalajiir", "Verthisathurgiesh", "Kimbatuul",
          "Nemmonis", "Orexijandilin", "Bhenkumbyrznaax", "Caavylteradyn",
          "Linxakasendalor", "Mohradyllion", "Vangdondalor", "Mystan"
        ]
      },
      gem: {
        male: [
          "Crysthar", "Diamar", "Emeril", "Garneth", "Jasperon",
          "Lazulik", "Onyxar", "Peridorn", "Quartzin", "Rubyth",
          "Sapphiran", "Topazar", "Turmalion", "Amethyran", "Berylok",
          "Citrinar", "Feldspar", "Gemdrak", "Iolithak", "Kunzitar",
          "Morganar", "Nephritak", "Opalex", "Spinelar", "Adrex"
        ],
        female: [
          "Amethysa", "Beryllia", "Citrina", "Diamondra", "Emeralda",
          "Fluorita", "Garnetta", "Iolithia", "Jaspera", "Kunzita",
          "Lazulina", "Morganita", "Nephrita", "Onyxia", "Peridota",
          "Quartzia", "Rubina", "Sapphira", "Topazia", "Turmalina",
          "Alexandria", "Benitoita", "Corunda", "Spinella", "Zirconia"
        ],
        surnames: [
          "Crystalscale", "Gemheart", "Prismshard", "Facetborn", "Opalwing",
          "Sapphirecrest", "Amethystclaw", "Diamondfang", "Emeraldbreath",
          "Rubyeye", "Topazhorn", "Quartzspine"
        ]
      }
    }
  },

  // =========================================================================
  // INFERNAL — 3 sub-cultures (names from XGE via 5etools)
  // =========================================================================
  infernal: {
    subCultures: {
      asmodeus: {
        male: [
          "Morthos", "Amnon", "Damakos", "Leucis", "Melech",
          "Mordai", "Skamos", "Therai", "Valafar", "Abad",
          "Ahrim", "Balam", "Caim", "Chem", "Ekemon",
          "Fenriz", "Habor", "Kairon", "Merihim", "Mormo",
          "Nicor", "Purson", "Raam", "Sammal", "Thamuz"
        ],
        female: [
          "Bryseis", "Damaia", "Kallista", "Makaria", "Nemeia",
          "Orianna", "Akta", "Anakis", "Armara", "Astaro",
          "Beleth", "Criella", "Ea", "Gadreel", "Hecat",
          "Ishte", "Jezebeth", "Kali", "Lerissa", "Lilith",
          "Manea", "Naamah", "Phelaia", "Prosperine", "Sekhmet"
        ],
        surnames: [
          "Ashworth", "Brimstone", "Darkmore", "Emberheart", "Grimshaw",
          "Infernis", "Nighthollow", "Shadowmere", "Thornspire", "Hellcrown",
          "Doomgaze", "Sinfire"
        ]
      },
      mephistopheles: {
        male: [
          "Akmenos", "Iados", "Pelaios", "Tethren", "Andram",
          "Astar", "Barakas", "Bathin", "Cressel", "Euron",
          "Forcas", "Marbas", "Modean", "Nirgel", "Oriax",
          "Paymon", "Qemuel", "Rimmon", "Vassago", "Xappan",
          "Zepar", "Zephan", "Cimer", "Mamnen", "Mantus"
        ],
        female: [
          "Rieta", "Aym", "Azza", "Bune", "Gomory",
          "Kasdeya", "Markosian", "Mastema", "Nija", "Osah",
          "Purah", "Pyra", "Ronobe", "Ronwe", "Seddit",
          "Seere", "Semyaza", "Shava", "Shax", "Sorath",
          "Uzza", "Vapula", "Vepar", "Verin", "Tava"
        ],
        surnames: [
          "Cinderveil", "Felgraven", "Hexblood", "Ashveil", "Coldfire",
          "Dreadflame", "Frostburn", "Glacialheart", "Hellfreeze", "Iceinferno",
          "Permafrost", "Winterpyre"
        ]
      },
      glasya: {
        male: [
          "Baalzebul", "Dravus", "Hadriel", "Charmos", "Deceivus",
          "Eloquar", "Fascinor", "Glamorix", "Illusiar", "Kaleidox",
          "Lurean", "Masqueron", "Narcissar", "Opulentar", "Pretendix",
          "Riddlemar", "Schematar", "Trickson", "Usurpix", "Velvetash",
          "Arannis", "Castiel", "Forneus", "Jergal", "Ravnos"
        ],
        female: [
          "Felthara", "Jezebel", "Alluria", "Beguilara", "Charmaine",
          "Deceivia", "Enchantia", "Fascinia", "Glasyara", "Illusia",
          "Jewelia", "Kymerica", "Luressa", "Masquera", "Narcissa",
          "Opalia", "Rusalka", "Seductia", "Temptara", "Vanidade",
          "Nephysa", "Vexana", "Xariel", "Yorina", "Zhavira"
        ],
        surnames: [
          "Silvertongue", "Honeyveil", "Charmspire", "Deceitborn", "Gildedshadow",
          "Maskweaver", "Mirrorface", "Riddle", "Silkmantle", "Veiled",
          "Whispergold", "Glitterdusk"
        ]
      }
    }
  },

  // =========================================================================
  // GENASI — 4 sub-cultures (elemental-themed)
  // =========================================================================
  genasi: {
    subCultures: {
      air: {
        male: [
          "Aethon", "Borealis", "Cirrus", "Dervish", "Ephyral",
          "Galewin", "Hazon", "Ithuriel", "Jetstream", "Khamsin",
          "Levitas", "Mistral", "Nimbus", "Ozwin", "Pneuma",
          "Quillon", "Riven", "Sirocco", "Typhon", "Updraft",
          "Ventus", "Whirl", "Xephyr", "Yarrow", "Zephyr"
        ],
        female: [
          "Aera", "Breezia", "Cirra", "Duskwind", "Etherea",
          "Flurria", "Galena", "Halcyona", "Iridis", "Jetina",
          "Khamira", "Levita", "Mistara", "Nimba", "Ozona",
          "Pluma", "Quilla", "Rivena", "Sylphia", "Tempesta",
          "Updra", "Ventara", "Windara", "Xephyra", "Zara"
        ],
        surnames: [
          "Windborn", "Stormbreath", "Skydancer", "Cloudwalker", "Galeforce",
          "Mistweaver", "Cyclone", "Drifter", "Gustborn", "Highwind",
          "Skyrider", "Zephyrus"
        ]
      },
      earth: {
        male: [
          "Agate", "Boulder", "Cairn", "Dolomite", "Erdrik",
          "Feldspar", "Granit", "Halite", "Ironvein", "Jasper",
          "Kaolin", "Loam", "Moraine", "Nodule", "Obsidian",
          "Petra", "Quartz", "Rumble", "Slate", "Talus",
          "Umber", "Volcanic", "Warden", "Xerite", "Zinc"
        ],
        female: [
          "Agata", "Basalta", "Calite", "Diorita", "Erdina",
          "Feldra", "Gneissa", "Hematia", "Ignea", "Jadea",
          "Kaolina", "Loessa", "Mica", "Neva", "Onyx",
          "Petra", "Quarria", "Rhyola", "Silica", "Terra",
          "Umbra", "Vesuviana", "Wolla", "Xena", "Zirca"
        ],
        surnames: [
          "Stoneborn", "Ironheart", "Earthshaker", "Deeproot", "Cragwalker",
          "Dustweaver", "Gravel", "Landslide", "Mudblood", "Quarryhewn",
          "Rockfist", "Terran"
        ]
      },
      fire: {
        male: [
          "Ashkir", "Blazen", "Cinder", "Drakon", "Ember",
          "Ferno", "Glow", "Heaton", "Ignatius", "Jarak",
          "Kindle", "Lavaborn", "Magmus", "Naphtha", "Oxid",
          "Pyrus", "Quasar", "Radion", "Scorch", "Tinder",
          "Uras", "Vulkan", "Warmth", "Xanthos", "Zenith"
        ],
        female: [
          "Ashara", "Blazea", "Cindra", "Drakena", "Embria",
          "Flamara", "Glowra", "Hestra", "Ignatia", "Jara",
          "Kindra", "Lavara", "Magma", "Naphta", "Oxara",
          "Pyra", "Quasara", "Radia", "Scorcha", "Tindra",
          "Ursa", "Vulkana", "Warmtha", "Xantha", "Zenitha"
        ],
        surnames: [
          "Fireborn", "Ashwalker", "Blazeheart", "Cinderspire", "Emberveil",
          "Flamecrest", "Heatsurge", "Ignisoul", "Lavablood", "Pyreforge",
          "Scorchmark", "Wildfire"
        ]
      },
      water: {
        male: [
          "Aquan", "Brook", "Cascade", "Deluge", "Eddy",
          "Fjord", "Glacius", "Harbor", "Isen", "Jetty",
          "Kelpar", "Lagoon", "Marinus", "Neptune", "Oceanus",
          "Pelago", "Quencher", "Riptide", "Shoal", "Torrent",
          "Undertow", "Vapor", "Wellspring", "Xanthus", "Yawl"
        ],
        female: [
          "Aquara", "Brooka", "Cascadia", "Deluvia", "Eddina",
          "Fjorda", "Glacina", "Harbora", "Isena", "Jetta",
          "Kelpara", "Laguna", "Marina", "Neptuna", "Oceana",
          "Pelaga", "Quenda", "Riviera", "Shoala", "Torrenta",
          "Undina", "Vapora", "Wella", "Xara", "Yara"
        ],
        surnames: [
          "Waterborn", "Deepcurrent", "Floodwalker", "Tidecaller", "Wavebreaker",
          "Iceblood", "Mistborn", "Rainmaker", "Seaspray", "Streamheart",
          "Surfwalker", "Whirlpool"
        ]
      }
    }
  },

  // =========================================================================
  // GOBLINOID — 3 sub-cultures
  // =========================================================================
  goblinoid: {
    subCultures: {
      goblin: {
        male: [
          "Blix", "Droop", "Grick", "Nix", "Splug",
          "Bog", "Crank", "Fizzle", "Glob", "Hobnail",
          "Jank", "Kreek", "Lob", "Muck", "Nerk",
          "Pox", "Quig", "Retch", "Snag", "Tik",
          "Urg", "Vex", "Wort", "Yak", "Zib"
        ],
        female: [
          "Bix", "Crink", "Drizzle", "Fex", "Glib",
          "Hink", "Ix", "Jig", "Krix", "Lix",
          "Mip", "Nik", "Pip", "Rix", "Slink",
          "Tix", "Ux", "Vix", "Wix", "Yix",
          "Zix", "Blink", "Fizz", "Snip", "Twig"
        ],
        surnames: [
          "Sharpshank", "Boneknife", "Ratcatcher", "Mudeye", "Gutterlurk",
          "Filchnab", "Ironbiter", "Nightskull", "Sewertooth", "Sneakfoot",
          "Trapjaw", "Wormskin"
        ]
      },
      hobgoblin: {
        male: [
          "Haruuc", "Lhesh", "Tariic", "Dhakaan", "Gaal",
          "Jhazaal", "Kalak", "Makaar", "Naaz", "Rhukaan",
          "Saal", "Taak", "Volaar", "Zaal", "Barak",
          "Caal", "Draak", "Ertok", "Faal", "Graal",
          "Haak", "Iraal", "Jhaak", "Kraal", "Luuk"
        ],
        female: [
          "Arakaal", "Brisa", "Caalir", "Dhakra", "Ersha",
          "Faala", "Graashi", "Hashak", "Irakta", "Jhaala",
          "Kraasha", "Luura", "Maakra", "Naala", "Orcala",
          "Praala", "Quaash", "Rhaakra", "Saakri", "Taakra",
          "Uursha", "Vaakra", "Wraash", "Xaala", "Zaakri"
        ],
        surnames: [
          "Ironfist", "Steelblood", "Warborn", "Shieldbreaker", "Blademark",
          "Doomguard", "Firebrand", "Grimspear", "Legionborn", "Marchward",
          "Redhand", "Warmarch"
        ]
      },
      bugbear: {
        male: [
          "Klarg", "Mosk", "Grol", "Brughor", "Thrag",
          "Aznak", "Bortag", "Crushbone", "Drak", "Elg",
          "Fang", "Gruk", "Hrak", "Irg", "Jurk",
          "Krag", "Lurk", "Murg", "Nark", "Ork",
          "Prug", "Rak", "Snarl", "Thud", "Ugg"
        ],
        female: [
          "Brugga", "Crasha", "Drakka", "Elga", "Fanga",
          "Grukka", "Hrakka", "Irga", "Jurka", "Kragga",
          "Lurka", "Murga", "Narka", "Oshka", "Prugga",
          "Rakka", "Snarla", "Thudda", "Ugga", "Varga",
          "Wragga", "Xurga", "Yagga", "Zurga", "Brakka"
        ],
        surnames: [
          "Skullcleaver", "Bonecruncher", "Shadowstalker", "Nightfang", "Goremaw",
          "Ambush", "Dreadclaw", "Fleshtear", "Grizzlehide", "Manhunter",
          "Rottooth", "Treelurk"
        ]
      }
    }
  },

  // =========================================================================
  // GOLIATH — flat (names from PHB/EE)
  // =========================================================================
  goliath: {
    male: [
      "Aukan", "Eglath", "Gauthak", "Ilikan", "Keothi",
      "Kuori", "Lo-Kag", "Manneo", "Maveith", "Nalla",
      "Orilo", "Paavu", "Pethani", "Thotham", "Uthal",
      "Vimak", "Kavaki", "Lagai", "Munthak", "Vaunea",
      "Thalai", "Gathak", "Halarak", "Nalak", "Thunak"
    ],
    female: [
      "Gae-Al", "Ilikan", "Kuori", "Manneo", "Nalla",
      "Orilo", "Paavu", "Thalai", "Uthalai", "Vaunea",
      "Belaratha", "Dagathi", "Enaathi", "Gathara", "Ilmara",
      "Keontha", "Lagathi", "Manathi", "Nalathi", "Orathi",
      "Pathani", "Rhuathi", "Savathi", "Tharathi", "Vothani"
    ],
    surnames: [
      "Anakalathai", "Elanithino", "Gathakanathi", "Kalagiano", "Katho-Olavi",
      "Kolae-Gileana", "Ogolakanu", "Thuliaga", "Thunukalathi", "Vaimei-Laga",
      "Uthel-Gathikka", "Muthok-Thrumi"
    ]
  },

  // =========================================================================
  // AASIMAR — flat (celestial-themed)
  // =========================================================================
  aasimar: {
    male: [
      "Ceriel", "Dariel", "Elarion", "Gabriel", "Halariel",
      "Iomedae", "Jehoel", "Kael", "Lazariel", "Malachai",
      "Nathanael", "Ophaniel", "Phanuel", "Raziel", "Sariel",
      "Tabbris", "Uriel", "Vassago", "Warden", "Xariel",
      "Yael", "Zachariel", "Araqiel", "Barachiel", "Chamuel"
    ],
    female: [
      "Ariel", "Bethia", "Celestia", "Deva", "Elaria",
      "Felicia", "Gloria", "Halcyon", "Iolanthe", "Jessamine",
      "Keriel", "Lumina", "Meridia", "Neriah", "Ophelia",
      "Phaedra", "Quesara", "Raphina", "Seraphina", "Tabitha",
      "Urania", "Viviana", "Wynna", "Xanthe", "Zariel"
    ],
    surnames: [
      "Brightborn", "Dawnbringer", "Gracemantle", "Goldheart", "Lightwalker",
      "Radiantsoul", "Silverblood", "Starborn", "Sunweaver", "Trueheart",
      "Virtuemark", "Celestborne"
    ]
  }

};
