import { StudyMaterial, DoubtQuestion, InAppNotification, Flashcard, StudyVideo } from '../types';

export const INITIAL_STUDY_MATERIALS: StudyMaterial[] = [
  {
    id: 'mat-1',
    title: 'Class 11 Physics - Chapter 3 to 6 Solved Numericals & Key Derivations',
    description: 'High-yield hand-written derivations covering Motion & Force, Work & Energy, Rotational Motion, and Fluid Dynamics with step-by-step numerical solutions.',
    className: 'Class 11',
    subject: 'Physics',
    type: 'Notes',
    uploaderName: 'Hamza Farooq',
    uploaderCollege: 'Govt. College University (GCU)',
    uploadDate: '2026-10-18',
    fileSize: '4.2 MB',
    pageCount: 38,
    rating: 4.9,
    totalRatings: 42,
    reviews: [
      {
        id: 'rev-1',
        userName: 'Ayesha Khan',
        rating: 5,
        comment: 'Derivations are written with great clarity, especially the projectile motion range formula!',
        date: '2026-10-22',
      },
      {
        id: 'rev-2',
        userName: 'Bilal Ahmed',
        rating: 5,
        comment: 'Helped me score 95% in my midterms. 100% recommended for FSc students.',
        date: '2026-10-29',
      },
    ],
    downloads: 1240,
    fileName: 'Class11_Physics_Ch3_to_Ch6_Complete_Derivations.pdf',
    sampleContent: `CHAPTER 3: MOTION AND FORCE
========================================
1. Newton's 2nd Law in terms of Momentum:
   F = Δp / Δt = (mv - mu) / t = m(v - u)/t = ma.
   Key Takeaway: The rate of change of linear momentum equals the applied net external force.

2. Law of Conservation of Linear Momentum:
   In an isolated system, total initial momentum = total final momentum.
   m1*u1 + m2*u2 = m1*v1 + m2*v2.

3. Projectile Motion Equations:
   - Trajectory: Parabolic curve y = (tan θ)x - (g / (2*v0^2*cos^2 θ)) x^2
   - Maximum Height: H = (v0^2 * sin^2 θ) / (2g)
   - Time of Flight: T = (2*v0 * sin θ) / g
   - Maximum Horizontal Range: R_max = v0^2 / g (achieved at θ = 45 degrees)

4. Fluid Dynamics (Bernoulli's Principle):
   P + 1/2 ρv^2 + ρgh = constant.
   Applications: Venturimeter, Aerodynamic lift on aircraft wings, Atomizer perfume sprayer.`,
    tags: ['Mechanics', 'Projectile Motion', 'Bernoulli', 'FSc Pre-Engineering'],
    isVerified: true,
  },
  {
    id: 'mat-2',
    title: 'Class 10 Mathematics - Complete Quadratic Equations & Geometry Solved Past Papers',
    description: 'Federal Board and Punjab Board past 5-year solved questions. Includes quadratic formula derivations, synthetic division, and circle theorems.',
    className: 'Class 10',
    subject: 'Mathematics',
    type: 'Past Paper',
    uploaderName: 'Prof. Tariq Mehmood',
    uploaderCollege: 'Punjab Group of Colleges',
    uploadDate: '2026-10-25',
    fileSize: '6.8 MB',
    pageCount: 52,
    rating: 4.8,
    totalRatings: 38,
    reviews: [
      {
        id: 'rev-3',
        userName: 'Usman Ali',
        rating: 5,
        comment: 'Synthetic division tricks are pure gold. Thanks sir!',
        date: '2026-10-28',
      },
    ],
    downloads: 2180,
    fileName: 'Class10_Maths_Solved_PastPapers_2020-2025.pdf',
    sampleContent: `UNIT 1: QUADRATIC EQUATIONS
========================================
Standard Form: ax^2 + bx + c = 0 (where a ≠ 0)

1. Methods of Solution:
   a) Factorization (Splitting middle term)
   b) Completing Square Method
   c) Quadratic Formula: x = [-b ± √(b^2 - 4ac)] / (2a)

2. Nature of Roots (Discriminant Δ = b^2 - 4ac):
   - If Δ > 0 and perfect square: Real, rational, and unequal roots.
   - If Δ > 0 and not perfect square: Real, irrational, and unequal roots.
   - If Δ = 0: Real and equal (repeated) roots.
   - If Δ < 0: Imaginary/complex conjugate roots.

3. Synthetic Division:
   Used for finding quotient and remainder when a polynomial P(x) is divided by (x - a).
   If remainder R = 0, then (x - a) is a factor of P(x).`,
    tags: ['Algebra', 'Discriminant', 'Board Exam', 'Matric'],
    isVerified: true,
  },
  {
    id: 'mat-3',
    title: 'Class 12 Chemistry - Organic Chemistry Reactions & Mechanism Roadmap',
    description: 'Ultra-visual color-coded flowcharts for Alkyl Halides, Alcohols, Aldehydes, Ketones, Carboxylic Acids, and Benzene electrophilic substitutions.',
    className: 'Class 12',
    subject: 'Chemistry',
    type: 'Formula Sheet',
    uploaderName: 'Dr. Fatima Noor',
    uploaderCollege: 'Kinnaird College for Women',
    uploadDate: '2026-11-01',
    fileSize: '3.1 MB',
    pageCount: 24,
    rating: 5.0,
    totalRatings: 56,
    reviews: [
      {
        id: 'rev-4',
        userName: 'Zainab Bibi',
        rating: 5,
        comment: 'Best organic roadmap I have ever used. Grignard reagent reactions are super easy now.',
        date: '2026-11-03',
      },
    ],
    downloads: 3410,
    fileName: 'Class12_Organic_Chemistry_Reaction_Roadmaps.pdf',
    sampleContent: `ORGANIC CHEMISTRY MASTER MAP
========================================
1. Benzene Electrophilic Substitution:
   - Nitration: Benzene + HNO3 (conc. H2SO4, 55°C) -> Nitrobenzene + H2O
   - Halogenation: Benzene + Cl2 (FeCl3 catalyst, room temp) -> Chlorobenzene + HCl
   - Friedel-Crafts Alkylation: Benzene + R-Cl (anhydrous AlCl3) -> Alkylbenzene + HCl
   - Friedel-Crafts Acylation: Benzene + R-CO-Cl (anhydrous AlCl3) -> Acylbenzene + HCl

2. Grignard Reagent (R-Mg-X):
   - Formaldehyde (HCHO) + RMgX -> Primary Alcohol (1°)
   - Other Aldehydes (R'CHO) + RMgX -> Secondary Alcohol (2°)
   - Ketones (R'COR'') + RMgX -> Tertiary Alcohol (3°)
   - CO2 + RMgX -> Carboxylic Acid (R-COOH)

3. Distinguishing Tests:
   - Lucas Test: Distinguishes 1°, 2°, 3° alcohols (3° gives immediate turbidity).
   - Tollens Test (Silver Mirror): Aldehydes reduce Tollens reagent to metallic silver; ketones do not.
   - Fehling's Test: Aliphatic aldehydes yield brick-red Cu2O precipitate.`,
    tags: ['Organic Chemistry', 'Benzene', 'Grignard', 'FSc Pre-Medical'],
    isVerified: true,
  },
  {
    id: 'mat-4',
    title: 'Class 9 Biology - Cell Biology & Tissues Comprehensive Summary Notes',
    description: 'Chapter 4 Cell Structure and Organelles, Plant vs Animal Tissues, and microscope magnification calculations with labeled diagrams.',
    className: 'Class 9',
    subject: 'Biology',
    type: 'Notes',
    uploaderName: 'Sana Malik',
    uploaderCollege: 'Army Public School (APS)',
    uploadDate: '2026-09-14',
    fileSize: '2.9 MB',
    pageCount: 22,
    rating: 4.7,
    totalRatings: 19,
    reviews: [
      {
        id: 'rev-5',
        userName: 'Danish Raza',
        rating: 5,
        comment: 'Short questions match the board paper scheme perfectly.',
        date: '2026-09-20',
      },
    ],
    downloads: 980,
    fileName: 'Class9_Biology_Ch4_Cell_and_Tissues.pdf',
    sampleContent: `CHAPTER 4: CELLS AND TISSUES
========================================
1. Cell Theory (Schleiden, Schwann, Virchow):
   - All living organisms are composed of one or more cells.
   - The cell is the basic structural and functional unit of life.
   - All cells arise from pre-existing cells through division.

2. Organelles Summary:
   - Nucleus: Houses genetic material (DNA), regulates cellular transcription.
   - Mitochondria: Powerhouse of the cell, produces ATP via aerobic respiration.
   - Ribosomes: Non-membrane bound, sites of protein synthesis.
   - Endoplasmic Reticulum:
     * Rough ER (studded with ribosomes): Protein folding & transport.
     * Smooth ER: Lipid synthesis, detoxification of drugs.
   - Chloroplasts (in plants): Double membrane, contains chlorophyll for photosynthesis.

3. Plant vs Animal Tissues:
   - Meristematic: Actively dividing cells at root/shoot tips (apical & lateral).
   - Permanent: Epidermal, Ground, and Vascular (Xylem conducts water, Phloem transports sucrose).`,
    tags: ['Cytology', 'Organelles', 'Tissues', 'Matric'],
    isVerified: true,
  },
  {
    id: 'mat-5',
    title: 'MDCAT High-Yield Unit: Human Physiology & Biotechnology Crash Notes',
    description: 'Targeted MDCAT preparation notes for Nervous Coordination, Hormonal Feedback, Genetics, and PCR techniques with PMC/UHS past MCQ patterns.',
    className: 'MDCAT / Pre-Med',
    subject: 'Biology',
    type: 'Notes',
    uploaderName: 'Dr. Shahzad Aslam',
    uploaderCollege: 'King Edward Medical University (KEMU)',
    uploadDate: '2026-10-10',
    fileSize: '5.4 MB',
    pageCount: 46,
    rating: 4.9,
    totalRatings: 84,
    reviews: [
      {
        id: 'rev-6',
        userName: 'Maryam Noor',
        rating: 5,
        comment: 'Helped me jump from 150 to 182 marks in mock tests. The hormonal loops are legendary.',
        date: '2026-10-15',
      },
    ],
    downloads: 4890,
    fileName: 'MDCAT_Biology_Human_Physiology_HighYield.pdf',
    sampleContent: `MDCAT HIGH-YIELD CRASH NOTES
========================================
1. Action Potential & Nerve Transmission:
   - Resting Membrane Potential: -70 mV (maintained by Na+/K+ ATPase pump: 3 Na+ out, 2 K+ in).
   - Depolarization: Voltage-gated Na+ channels open, membrane potential spikes to +30 mV.
   - Repolarization: Na+ channels inactivate, voltage-gated K+ channels open.
   - Hyperpolarization: K+ channels close sluggishly (-80 mV), followed by refractory period.
   - Speed factor: Myelinated neurons have saltatory conduction via Nodes of Ranvier (~120 m/s).

2. Endocrine Feedback Mechanisms:
   - Blood Glucose Homeostasis:
     * High blood glucose -> Beta cells of Islets of Langerhans secrete Insulin (glycogenesis).
     * Low blood glucose -> Alpha cells secrete Glucagon (glycogenolysis & gluconeogenesis).
   - Calcium Regulation:
     * Parathyroid hormone (PTH): Increases blood Ca2+ by bone resorption and renal reabsorption.
     * Calcitonin (Thyroid gland): Lowers blood Ca2+ by bone deposition.`,
    tags: ['MDCAT', 'Pre-Medical', 'PMC Scheme', 'UHS'],
    isVerified: true,
  },
  {
    id: 'mat-6',
    title: 'Class 12 Computer Science - Object Oriented Programming in C++ & Algorithms',
    description: 'Complete concepts of Classes, Objects, Constructors, Inheritance, Polymorphism, Pointers, and Binary Search algorithms with tested code snippets.',
    className: 'Class 12',
    subject: 'Computer Science',
    type: 'Book',
    uploaderName: 'Engr. Waseem Akhtar',
    uploaderCollege: 'FAST-NUCES Lahore',
    uploadDate: '2026-10-12',
    fileSize: '8.1 MB',
    pageCount: 88,
    rating: 4.8,
    totalRatings: 31,
    reviews: [
      {
        id: 'rev-7',
        userName: 'Moiz Rehman',
        rating: 5,
        comment: 'Virtual functions and operator overloading are explained in super simple words.',
        date: '2026-10-19',
      },
    ],
    downloads: 1620,
    fileName: 'Class12_CS_OOP_and_DataStructures_Guide.pdf',
    sampleContent: `MODULE: OBJECT-ORIENTED PROGRAMMING IN C++
========================================
1. Four Pillars of OOP:
   - Encapsulation: Bundling data and functions within a class, hiding internal details (private/public).
   - Abstraction: Displaying only essential features and hiding implementation complexity.
   - Inheritance: Mechanism where a child class acquires properties of parent class (reusability).
   - Polymorphism: Ability to take many forms (Compile-time: function overloading; Runtime: virtual functions).

2. Virtual Functions & Dynamic Binding:
   class Base {
   public:
       virtual void display() { cout << "Base Class\\n"; }
   };
   class Derived : public Base {
   public:
       void display() override { cout << "Derived Class\\n"; }
   };
   Base* ptr = new Derived();
   ptr->display(); // Outputs "Derived Class" due to virtual dispatch table (vtable).

3. Algorithm Efficiency (Big-O Notation):
   - Binary Search: Time Complexity O(log n), Space Complexity O(1). Requires sorted array.
   - Linear Search: Time Complexity O(n).
   - Bubble Sort: Time Complexity O(n^2).`,
    tags: ['Programming', 'C++', 'OOP', 'ICS'],
    isVerified: true,
  },
  {
    id: 'mat-7',
    title: 'ECAT Mathematics - Calculus & Analytic Geometry Shortcut Tricks Bank',
    description: 'Time-saving shortcut formulas for Limits (L\'Hopital Rule), Derivatives of Parametric functions, Definite Integral areas, and Conic Sections.',
    className: 'ECAT / Pre-Eng',
    subject: 'Mathematics',
    type: 'Formula Sheet',
    uploaderName: 'Prof. Junaid Iqbal',
    uploaderCollege: 'UET Lahore',
    uploadDate: '2026-09-30',
    fileSize: '3.6 MB',
    pageCount: 30,
    rating: 4.9,
    totalRatings: 63,
    reviews: [],
    downloads: 2840,
    fileName: 'ECAT_Maths_Calculus_SpeedTricks.pdf',
    sampleContent: `ECAT SPEED CALCULUS TECHNIQUES
========================================
1. L'Hopital's Rule for Indeterminate Forms (0/0 or ∞/∞):
   lim(x->a) [f(x)/g(x)] = lim(x->a) [f'(x)/g'(x)]
   Shortcut: Differentiate numerator and denominator separately until non-zero denominator is reached.

2. Standard Limits:
   - lim(x->0) [sin(ax) / bx] = a/b
   - lim(x->0) [(e^x - 1) / x] = 1
   - lim(x->∞) (1 + 1/x)^x = e

3. Integration by Parts Shortcut (DI Method):
   Useful for Polynomial * (Trig or Exponential).
   D (Differentiate)      I (Integrate)
   +   x^2                  sin(x)
   -   2x                  -cos(x)
   +   2                   -sin(x)
   -   0                    cos(x)
   Answer = -x^2 cos(x) + 2x sin(x) + 2 cos(x) + C. Done in 10 seconds!`,
    tags: ['Calculus', 'ECAT', 'Integration', 'Shortcut'],
    isVerified: true,
  },
  {
    id: 'mat-8',
    title: 'BS Computer Science - Operating Systems & Process Scheduling Complete Notes',
    description: 'Comprehensive university notes covering CPU Scheduling (FCFS, SJF, Round Robin), Deadlocks (Banker\'s Algorithm), and Virtual Memory Paging.',
    className: 'BS / University',
    subject: 'Computer Science',
    type: 'Book',
    uploaderName: 'Saad Ur Rehman',
    uploaderCollege: 'NUST Islamabad',
    uploadDate: '2026-10-05',
    fileSize: '7.2 MB',
    pageCount: 64,
    rating: 4.7,
    totalRatings: 27,
    reviews: [],
    downloads: 1430,
    fileName: 'BSCS_Operating_Systems_Process_Management.pdf',
    sampleContent: `OPERATING SYSTEMS & PROCESS MANAGEMENT
========================================
1. Process State Transition:
   New -> Ready -> Running -> Terminated
                -> Waiting (I/O or Event) -> Ready

2. Four Necessary Conditions for Deadlock (Coffman Conditions):
   - Mutual Exclusion: At least one resource must be held in a non-shareable mode.
   - Hold and Wait: A process must be holding at least one resource and waiting to acquire additional resources.
   - No Preemption: Resources cannot be preempted; only released voluntarily.
   - Circular Wait: A closed chain of processes exists such that each process holds at least one resource needed by the next.

3. Virtual Memory & Paging:
   - Page Fault occurs when a program accesses a memory page not currently mapped in physical RAM.
   - Page Replacement Algorithms: FIFO, LRU (Least Recently Used), Optimal (Belady's Algorithm).`,
    tags: ['Operating Systems', 'Deadlock', 'BSCS', 'University'],
    isVerified: true,
  },
];

export const INITIAL_DOUBTS: DoubtQuestion[] = [
  {
    id: 'doubt-1',
    title: 'Class 10 Math: How to derive Quadratic Formula using Completing Square method?',
    details: 'I keep getting confused when dividing by 4a^2 in the last steps of ax^2 + bx + c = 0. Can someone explain the full derivation step-by-step?',
    className: 'Class 10',
    subject: 'Mathematics',
    authorName: 'Ali Raza',
    createdAt: '2 hours ago',
    upvotes: 14,
    isUpvoted: false,
    notifyReplies: true, // Specifically requested feature
    isSolved: true,
    acceptedAnswerId: 'ans-1',
    tags: ['Algebra', 'Derivation', 'Quadratic Equations'],
    answers: [
      {
        id: 'ans-1',
        questionId: 'doubt-1',
        authorName: 'Zainab Tutor',
        authorRole: 'Subject Topper',
        createdAt: '1 hour ago',
        content: `Here is the clean 5-step derivation:

Step 1: Start with standard quadratic equation:
   ax^2 + bx + c = 0

Step 2: Divide entire equation by 'a' (since a ≠ 0):
   x^2 + (b/a)x + c/a = 0
   Shift constant to RHS:
   x^2 + (b/a)x = -c/a

Step 3: Add (b / 2a)^2 to both sides to complete the square:
   x^2 + 2*(b/2a)*x + (b/2a)^2 = (b^2 / 4a^2) - (c/a)

Step 4: Left side forms a perfect square [x + b/2a]^2:
   [x + b/(2a)]^2 = (b^2 - 4ac) / (4a^2)

Step 5: Take square root on both sides:
   x + b/(2a) = ± √(b^2 - 4ac) / (2a)
   Subtract b/(2a) from both sides:
   x = [-b ± √(b^2 - 4ac)] / (2a)  [Q.E.D.]`,
        upvotes: 19,
        isAccepted: true,
      },
      {
        id: 'ans-2',
        questionId: 'doubt-1',
        authorName: 'TalibIlm AI Tutor',
        authorRole: 'AI Tutor',
        createdAt: '1 hour ago',
        content: `Pro-Tip for Exam: Always write a brief reason why 'a ≠ 0' in Step 2. If a = 0, the equation reduces to a linear equation (bx + c = 0) and ceases to be quadratic! Examiners in Board exams award 0.5 marks for this justification.`,
        upvotes: 8,
        isAccepted: false,
      },
    ],
  },
  {
    id: 'doubt-2',
    title: 'Class 11 Physics: Why is work done zero when a body moves in a circular orbit?',
    details: 'According to physics, W = F * d * cos(θ). But the satellite is continuously moving thousands of kilometers, so how can work done be 0?',
    className: 'Class 11',
    subject: 'Physics',
    authorName: 'Mustafa Kamal',
    createdAt: '4 hours ago',
    upvotes: 9,
    isUpvoted: false,
    notifyReplies: true,
    isSolved: true,
    acceptedAnswerId: 'ans-3',
    tags: ['Work & Energy', 'Centripetal Force', 'Gravitation'],
    answers: [
      {
        id: 'ans-3',
        questionId: 'doubt-2',
        authorName: 'Prof. Salman',
        authorRole: 'Peer Tutor',
        createdAt: '3 hours ago',
        content: `Great conceptual question, Mustafa!

Look at the definition of work in physics:
Work = F · d = |F| |d| cos(θ)

In uniform circular motion:
1. Centripetal force acts towards the center of the orbit along the radius.
2. The instantaneous displacement (velocity vector) is always tangential to the circle.
3. Therefore, angle θ between centripetal force and displacement is exactly 90 degrees at every single instant!

Since cos(90°) = 0:
W = F * d * cos(90°) = 0 Joules.

Also by Work-Energy Theorem:
Work = Change in Kinetic Energy (ΔKE). Since speed is constant in uniform circular motion, ΔKE = 0, confirming Work = 0!`,
        upvotes: 15,
        isAccepted: true,
      },
    ],
  },
  {
    id: 'doubt-3',
    title: 'Class 12 Chemistry: What is the main difference between SN1 and SN2 mechanisms?',
    details: 'Can someone provide a comparison table with order of kinetics, carbocation intermediate, and solvent preference for board exam?',
    className: 'Class 12',
    subject: 'Chemistry',
    authorName: 'Hafsa Sheikh',
    createdAt: '6 hours ago',
    upvotes: 11,
    isUpvoted: false,
    notifyReplies: true,
    isSolved: false,
    tags: ['Alkyl Halides', 'SN1', 'SN2', 'Organic Mechanisms'],
    answers: [
      {
        id: 'ans-4',
        questionId: 'doubt-3',
        authorName: 'Iqra Bashir',
        authorRole: 'Student',
        createdAt: '4 hours ago',
        content: `Quick Comparison:
1. SN1 (Substitution Nucleophilic Unimolecular):
   - Rate = k[R-X] (1st order)
   - Two steps: Carbocation intermediate formed
   - Preferred by: 3° Alkyl Halides (most stable carbocation)
   - Stereochemistry: Racemization (50% inversion, 50% retention)
   - Solvent: Polar Protic (H2O, EtOH)

2. SN2 (Substitution Nucleophilic Bimolecular):
   - Rate = k[R-X][Nu-] (2nd order)
   - Single concerted step via pentacoordinate transition state
   - Preferred by: 1° Alkyl Halides (minimal steric hindrance)
   - Stereochemistry: 100% Walden Inversion
   - Solvent: Polar Aprotic (Acetone, DMSO)`,
        upvotes: 12,
        isAccepted: false,
      },
    ],
  },
  {
    id: 'doubt-4',
    title: 'MDCAT Biology: Why does Anaphase I of Meiosis cause genetic variation?',
    details: 'Is it because of crossing over or independent assortment? Or both?',
    className: 'MDCAT / Pre-Med',
    subject: 'Biology',
    authorName: 'Bilal Shahid',
    createdAt: '1 day ago',
    upvotes: 7,
    isUpvoted: false,
    notifyReplies: false,
    isSolved: false,
    tags: ['Cell Division', 'Meiosis', 'Genetics'],
    answers: [],
  },
];

export const INITIAL_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'notif-1',
    title: 'New Reply on Your Doubt',
    message: 'Zainab Tutor answered your question "How to derive Quadratic Formula using Completing Square method?"',
    timestamp: '1 hour ago',
    type: 'reply',
    read: false,
    targetId: 'doubt-1',
    targetTab: 'forum',
  },
  {
    id: 'notif-2',
    title: 'Your Notes Received 5 Stars!',
    message: 'Ayesha Khan rated your "Class 11 Physics Derivations" with a glowing review.',
    timestamp: '5 hours ago',
    type: 'rating',
    read: false,
    targetId: 'mat-1',
    targetTab: 'notes',
  },
  {
    id: 'notif-3',
    title: 'Study Goal Reminder',
    message: 'You have completed 3 days study streak! Review today\'s Physics flashcards to keep going.',
    timestamp: '1 day ago',
    type: 'study_reminder',
    read: true,
    targetTab: 'ai',
  },
];

export const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    subject: 'Physics',
    className: 'Class 11',
    category: 'Mechanics',
    question: 'What is the angle of projection that yields maximum horizontal range for a projectile?',
    answer: '45 degrees (θ = 45°). Range = v0² / g. (Since sin(2*45°) = sin(90°) = 1, the maximum possible value).',
    hint: 'Think about when sin(2θ) reaches its peak value.',
  },
  {
    id: 'fc-2',
    subject: 'Chemistry',
    className: 'Class 12',
    category: 'Organic Chemistry',
    question: 'What reagent is used in the Lucas Test to distinguish primary, secondary, and tertiary alcohols?',
    answer: 'Anhydrous Zinc Chloride (ZnCl2) dissolved in concentrated Hydrochloric Acid (HCl). 3° alcohol turns cloudy immediately.',
    hint: 'A Lewis acid catalyst paired with a strong mineral acid.',
  },
  {
    id: 'fc-3',
    subject: 'Mathematics',
    className: 'Class 10',
    category: 'Algebra',
    question: 'If the discriminant (b² - 4ac) of a quadratic equation is 0, what is the nature of the roots?',
    answer: 'The roots are Real, Rational, and Equal (repeated root: x = -b / 2a).',
    hint: 'The term under the square root vanishes.',
  },
  {
    id: 'fc-4',
    subject: 'Biology',
    className: 'Class 9',
    category: 'Cell Biology',
    question: 'Which organelle is responsible for cellular respiration and generation of ATP?',
    answer: 'Mitochondria ("The powerhouse of the cell"). Contains cristae and its own circular DNA & 70S ribosomes.',
    hint: 'Known as the powerhouse of eukaryotic cells.',
  },
  {
    id: 'fc-5',
    subject: 'Computer Science',
    className: 'Class 12',
    category: 'Algorithms',
    question: 'What is the time complexity of Binary Search in a sorted array of size N?',
    answer: 'O(log N). Because the search space is halved after every comparison.',
    hint: 'Halving the search boundary at each iteration.',
  },
  {
    id: 'fc-6',
    subject: 'Physics',
    className: 'Class 12',
    category: 'Electromagnetism',
    question: 'State Lenz\'s Law of Electromagnetic Induction.',
    answer: 'The direction of an induced current is always such that its magnetic field opposes the change in magnetic flux that produced it (Conservation of Energy).',
    hint: 'Nature opposes any change in magnetic flux.',
  },
];

export const INITIAL_STUDY_VIDEOS: StudyVideo[] = [
  {
    id: 'vid-1',
    title: 'Human Heart Anatomy & Double Blood Circulation (Complete Board Exam Concept)',
    description: 'Complete 15-minute conceptual lecture explaining all 4 chambers (Right/Left Atrium, Right/Left Ventricle), valves (Tricuspid, Bicuspid), Aorta, Vena Cava, and how to draw full-marks diagram on paper with handwriting notes.',
    videoUrl: 'https://www.youtube.com/watch?v=7XaftdE_h60',
    duration: '14:20',
    className: 'Class 11',
    subject: 'Biology',
    creatorName: 'Sir Asad Mahmood',
    creatorRole: 'Teacher',
    creatorInstitution: 'Punjab College & MDCAT Academy',
    createdAt: '2 days ago',
    views: 3420,
    likes: 248,
    isLiked: false,
    downloads: 1240,
    shares: 85,
    thumbnailUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    tags: ['Biology', 'Human Heart', 'Circulation', 'MDCAT', 'Class 11'],
    isVerifiedTeacher: true,
    comments: [
      {
        id: 'vcomm-1',
        videoId: 'vid-1',
        authorName: 'Bilal Ahmad (Class 11)',
        authorRole: 'Student',
        comment: 'Sir aapne valves aur double circulation ka concept bilkul crystal clear kar diya! Board exam me diagram banana ab asaan lag raha hai.',
        timestamp: '1 day ago',
        likes: 18,
        isLiked: false,
      },
      {
        id: 'vcomm-2',
        videoId: 'vid-1',
        authorName: 'Dr. Ayesha Tariq',
        authorRole: 'Subject Expert',
        comment: 'Excellent explanation of the thick myocardial wall in Left Ventricle vs Right Ventricle. Very helpful for MDCAT aspirants.',
        timestamp: '18 hours ago',
        likes: 9,
        isLiked: false,
      },
    ],
  },
  {
    id: 'vid-2',
    title: 'Bernoulli’s Equation Derivation & Venturi Meter Numerical Problem',
    description: 'Step-by-step mathematical derivation of Bernoulli equation P + 1/2 ρv² + ρgh = Constant. Includes past paper numerical shortcuts for Punjab & Federal boards.',
    videoUrl: 'https://www.youtube.com/watch?v=DW4rItBvnIU',
    duration: '18:45',
    className: 'Class 11',
    subject: 'Physics',
    creatorName: 'Prof. Salman Raza',
    creatorRole: 'Teacher',
    creatorInstitution: 'Govt. College University (GCU) Physics Dept',
    createdAt: '3 days ago',
    views: 4190,
    likes: 312,
    isLiked: false,
    downloads: 1870,
    shares: 114,
    thumbnailUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&auto=format&fit=crop&q=80',
    tags: ['Physics', 'Bernoulli', 'Fluid Dynamics', 'FSc', 'Numericals'],
    isVerifiedTeacher: true,
    comments: [
      {
        id: 'vcomm-3',
        videoId: 'vid-2',
        authorName: 'Usman Ghani',
        authorRole: 'Student',
        comment: 'Sir equation of continuity ke saath relation samajh nahi aa raha tha pehle, is lecture ke baad poora clear ho gaya!',
        timestamp: '2 days ago',
        likes: 12,
        isLiked: false,
      },
    ],
  },
  {
    id: 'vid-3',
    title: 'Organic Chemistry: Benzene Resonance & Electrophilic Substitution Mechanism',
    description: 'Why Benzene does not undergo addition reactions easily! Complete mechanism of Nitration, Halogenation, and Friedel-Crafts Alkylation with electron movement arrows.',
    videoUrl: 'https://www.youtube.com/watch?v=gT8j2P_c41Y',
    duration: '22:10',
    className: 'Class 12',
    subject: 'Chemistry',
    creatorName: 'Dr. Tariq Mahmood',
    creatorRole: 'Teacher',
    creatorInstitution: 'KIPS College / MDCAT Chemistry Head',
    createdAt: '5 days ago',
    views: 5210,
    likes: 420,
    isLiked: false,
    downloads: 2150,
    shares: 156,
    thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
    tags: ['Chemistry', 'Benzene', 'Resonance', 'Class 12', 'MDCAT'],
    isVerifiedTeacher: true,
    comments: [
      {
        id: 'vcomm-4',
        videoId: 'vid-3',
        authorName: 'Zainab Fatima (Pre-Med)',
        authorRole: 'Student',
        comment: 'Resonance energy 150.5 kJ/mol wali point board me har saal aati hai, thank you sir for highlighting!',
        timestamp: '3 days ago',
        likes: 15,
        isLiked: false,
      },
    ],
  },
  {
    id: 'vid-4',
    title: 'Solving Quadratic Equations in 30 Seconds: Formula & Discriminant Tricks',
    description: 'Quadratic equation solve karne ke 3 tareeqay (Factorization, Completing Square, Quadratic Formula) aur discriminant b² - 4ac se nature of roots maloom karne ka shortcut.',
    videoUrl: 'https://www.youtube.com/watch?v=i7idZfS8t8w',
    duration: '11:15',
    className: 'Class 10',
    subject: 'Mathematics',
    creatorName: 'Miss Ayesha Siddiqui',
    creatorRole: 'Teacher',
    creatorInstitution: 'Army Public School (APS) Senior Wing',
    createdAt: '4 days ago',
    views: 2890,
    likes: 195,
    isLiked: false,
    downloads: 980,
    shares: 64,
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    tags: ['Mathematics', 'Quadratic Equations', 'Class 10', 'Matric'],
    isVerifiedTeacher: true,
    comments: [],
  },
  {
    id: 'vid-5',
    title: 'Student Peer Tutorial: Binary Search vs Linear Search in C++ with Code',
    description: 'A student topper explaining Binary Search algorithm with array pointer visualization, time complexity O(log N) derivation, and live compiled C++ code demonstration.',
    videoUrl: 'https://www.youtube.com/watch?v=P3YID7liBug',
    duration: '16:30',
    className: 'Class 12',
    subject: 'Computer Science',
    creatorName: 'Hamza Khan (ICS Topper)',
    creatorRole: 'Student',
    creatorInstitution: 'Govt. Emerson College Multan',
    createdAt: '1 week ago',
    views: 1840,
    likes: 142,
    isLiked: false,
    downloads: 750,
    shares: 48,
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    tags: ['Computer Science', 'Binary Search', 'C++', 'Algorithms', 'Class 12'],
    isVerifiedTeacher: false,
    comments: [
      {
        id: 'vcomm-5',
        videoId: 'vid-5',
        authorName: 'Danish Ali',
        authorRole: 'Student',
        comment: 'Brother bohot asaan zaban me explain kiya hai code ko, thanks a lot!',
        timestamp: '4 days ago',
        likes: 6,
        isLiked: false,
      },
    ],
  },
  {
    id: 'vid-6',
    title: 'Light & Dark Reactions of Photosynthesis (Calvin Cycle Mindmap)',
    description: 'Thylakoid membrane me Light Reaction (ATP & NADPH generation) aur Stroma me Dark Reaction (Calvin cycle) ka detailed flowchart sketch.',
    videoUrl: 'https://www.youtube.com/watch?v=sQK3Yr4Sc_k',
    duration: '13:50',
    className: 'Class 9',
    subject: 'Biology',
    creatorName: 'Fatima Noor (Peer Mentor)',
    creatorRole: 'Student',
    creatorInstitution: 'Lahore Grammar School (LGS)',
    createdAt: '5 days ago',
    views: 2150,
    likes: 168,
    isLiked: false,
    downloads: 840,
    shares: 52,
    thumbnailUrl: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=800&auto=format&fit=crop&q=80',
    tags: ['Biology', 'Photosynthesis', 'Calvin Cycle', 'Class 9', 'Bioenergetics'],
    isVerifiedTeacher: false,
    comments: [],
  },
];
