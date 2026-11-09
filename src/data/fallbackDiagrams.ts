export interface FallbackDiagram {
  matchKeywords: string[];
  title: string;
  svg: string;
  explanation: string;
}

export const FALLBACK_DIAGRAMS: FallbackDiagram[] = [
  {
    matchKeywords: ['heart', 'dil', 'cardiac', 'circulatory', 'blood flow', 'ventricle', 'atrium', 'aorta'],
    title: 'Anatomy of Human Heart & Double Circulation (Handwritten Paper Notes)',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 680" width="100%" height="auto" style="background:#fdfcf7; border-radius:14px; box-shadow:0 10px 25px rgba(0,0,0,0.15);">
  <!-- Ruled Notebook Paper Background -->
  <defs>
    <pattern id="ruledLines" width="850" height="24" patternUnits="userSpaceOnUse">
      <line x1="0" y1="23" x2="850" y2="23" stroke="#e2e8f0" stroke-width="1.2" />
    </pattern>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="2" dy="4" stdDeviation="3" flood-opacity="0.15" />
    </filter>
    <marker id="arrowRed" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#dc2626" />
    </marker>
    <marker id="arrowBlue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#2563eb" />
    </marker>
  </defs>

  <!-- Paper Sheet -->
  <rect width="850" height="680" fill="#fdfbf7" rx="14" />
  <rect width="850" height="680" fill="url(#ruledLines)" rx="14" />

  <!-- Red Margin Line (Notebook Margin) -->
  <line x1="72" y1="0" x2="72" y2="680" stroke="#fca5a5" stroke-width="2.5" stroke-opacity="0.85" />
  <line x1="75" y1="0" x2="75" y2="680" stroke="#fecaca" stroke-width="1" stroke-opacity="0.6" />

  <!-- Notebook Header (Handwritten Style) -->
  <g font-family="'Caveat', 'Architects Daughter', cursive, sans-serif">
    <text x="85" y="32" font-size="16" fill="#64748b" font-weight="600">Subject: Biology (Class 10/11)  |  Topic: Human Heart &amp; Functions</text>
    <text x="680" y="32" font-size="16" fill="#64748b" font-weight="600">Date: 2026  |  Page: 01</text>
    <line x1="85" y1="40" x2="820" y2="40" stroke="#cbd5e1" stroke-width="1.5" />
  </g>

  <!-- Title on Notebook -->
  <text x="430" y="68" text-anchor="middle" font-family="'Caveat', 'Architects Daughter', cursive, sans-serif" font-size="28" font-weight="700" fill="#0f172a">
    &#x2764;&#xfe0f; Structure &amp; Functions of Human Heart (Dil Ki Sakht)
  </text>
  <line x1="220" y1="74" x2="640" y2="74" stroke="#e11d48" stroke-width="2" stroke-linecap="round" />

  <!-- Central Heart Illustration -->
  <g transform="translate(190, 85)" filter="url(#shadow)">
    <!-- Superior Vena Cava -->
    <path d="M 80 40 L 80 120 Q 95 125 110 120 L 110 40 Z" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2.5" />
    <!-- Inferior Vena Cava -->
    <path d="M 85 240 L 85 320 Q 100 325 115 320 L 115 240 Z" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2.5" />

    <!-- Aortic Arch -->
    <path d="M 175 110 Q 175 25 240 25 Q 310 25 310 110 L 285 115 Q 285 55 240 55 Q 195 55 195 110 Z" fill="#dc2626" stroke="#991b1b" stroke-width="2.5" />
    <!-- 3 Aortic Arch Arteries -->
    <rect x="210" y="5" width="14" height="28" rx="4" fill="#dc2626" stroke="#991b1b" stroke-width="2" />
    <rect x="235" y="0" width="14" height="30" rx="4" fill="#dc2626" stroke="#991b1b" stroke-width="2" />
    <rect x="260" y="5" width="14" height="28" rx="4" fill="#dc2626" stroke="#991b1b" stroke-width="2" />

    <!-- Pulmonary Artery Trunk (Crosses in front) -->
    <path d="M 155 115 Q 190 80 250 85 L 250 115 Q 195 110 170 145 Z" fill="#2563eb" stroke="#1e40af" stroke-width="2.5" />
    <!-- Left & Right Pulmonary Branches -->
    <path d="M 155 115 L 75 90 L 75 115 L 155 130 Z" fill="#2563eb" stroke="#1e40af" stroke-width="2" />
    <path d="M 240 85 L 320 80 L 320 105 L 245 110 Z" fill="#2563eb" stroke="#1e40af" stroke-width="2" />

    <!-- Left Pulmonary Veins (carrying oxygenated blood) -->
    <rect x="305" y="140" width="30" height="15" rx="4" fill="#ef4444" stroke="#b91c1c" stroke-width="2" />
    <rect x="305" y="160" width="30" height="15" rx="4" fill="#ef4444" stroke="#b91c1c" stroke-width="2" />

    <!-- Right Atrium Body (Deoxygenated) -->
    <path d="M 75 120 Q 50 160 70 210 Q 120 220 135 180 Q 130 130 105 120 Z" fill="#93c5fd" stroke="#1d4ed8" stroke-width="2.5" />

    <!-- Left Atrium Body (Oxygenated) -->
    <path d="M 260 130 Q 320 140 310 200 Q 260 215 240 180 Q 240 140 260 130 Z" fill="#fca5a5" stroke="#b91c1c" stroke-width="2.5" />

    <!-- Right Ventricle (Deoxygenated) -->
    <path d="M 80 210 Q 110 320 180 340 L 195 210 Q 140 210 80 210 Z" fill="#60a5fa" stroke="#1d4ed8" stroke-width="2.5" />

    <!-- Thick Muscular Left Ventricle (Oxygenated, Thick Wall) -->
    <path d="M 195 210 L 180 340 Q 260 350 295 290 Q 315 230 260 210 Z" fill="#ef4444" stroke="#991b1b" stroke-width="2.5" />

    <!-- Interventricular Septum (Wall in between) -->
    <path d="M 185 210 L 175 340 L 195 340 L 205 210 Z" fill="#f43f5e" stroke="#be123c" stroke-width="2" />

    <!-- Valves -->
    <!-- Tricuspid Valve -->
    <line x1="100" y1="210" x2="135" y2="210" stroke="#facc15" stroke-width="4" stroke-dasharray="4 2" />
    <!-- Bicuspid / Mitral Valve -->
    <line x1="240" y1="210" x2="275" y2="210" stroke="#facc15" stroke-width="4" stroke-dasharray="4 2" />

    <!-- Blood Flow Direction Arrows -->
    <!-- Inflow from SVC to RA -->
    <line x1="95" y1="65" x2="95" y2="130" stroke="#2563eb" stroke-width="3" marker-end="url(#arrowBlue)" />
    <!-- RA to RV -->
    <line x1="105" y1="175" x2="120" y2="235" stroke="#2563eb" stroke-width="3" marker-end="url(#arrowBlue)" />
    <!-- RV to Pulmonary Artery -->
    <path d="M 130 260 Q 160 200 160 125" fill="none" stroke="#2563eb" stroke-width="3" marker-end="url(#arrowBlue)" />

    <!-- Inflow from Pulm Vein to LA -->
    <line x1="315" y1="150" x2="275" y2="160" stroke="#dc2626" stroke-width="3" marker-end="url(#arrowRed)" />
    <!-- LA to LV -->
    <line x1="270" y1="180" x2="250" y2="240" stroke="#dc2626" stroke-width="3" marker-end="url(#arrowRed)" />
    <!-- LV to Aorta -->
    <path d="M 235 270 Q 205 180 200 95" fill="none" stroke="#dc2626" stroke-width="3" marker-end="url(#arrowRed)" />
  </g>

  <!-- Labeled Pointer Lines & Handwritten Text Labels -->
  <g font-family="'Caveat', 'Architects Daughter', cursive, sans-serif" font-weight="700">
    <!-- 1. Aorta Label (Top Right) -->
    <path d="M 430 115 L 530 95 L 560 95" fill="none" stroke="#dc2626" stroke-width="1.8" stroke-linecap="round" />
    <circle cx="430" cy="115" r="3.5" fill="#dc2626" />
    <text x="565" y="90" font-size="18" fill="#991b1b">1. AORTA (Maha Shariyan)</text>
    <text x="565" y="108" font-size="14" fill="#334155" font-weight="600">&#x27a1; Oxygen-rich blood poore body me pump karta hai</text>

    <!-- 2. Superior Vena Cava (Top Left) -->
    <path d="M 280 145 L 180 120 L 100 120" fill="none" stroke="#2563eb" stroke-width="1.8" stroke-linecap="round" />
    <circle cx="280" cy="145" r="3.5" fill="#2563eb" />
    <text x="95" y="115" text-anchor="end" font-size="18" fill="#1e40af">2. Superior Vena Cava</text>
    <text x="95" y="133" text-anchor="end" font-size="14" fill="#334155" font-weight="600">Upper body se deoxygenated blood lata hai &#x2b05;</text>

    <!-- 3. Pulmonary Artery -->
    <path d="M 265 190 L 160 175 L 100 175" fill="none" stroke="#2563eb" stroke-width="1.8" stroke-linecap="round" />
    <circle cx="265" cy="190" r="3.5" fill="#2563eb" />
    <text x="95" y="170" text-anchor="end" font-size="18" fill="#1e40af">3. Pulmonary Artery</text>
    <text x="95" y="188" text-anchor="end" font-size="14" fill="#334155" font-weight="600">Lungs (phephron) ko ganda blood le jata hai &#x2b05;</text>

    <!-- 4. Right Atrium -->
    <path d="M 285 240 L 160 235 L 100 235" fill="none" stroke="#0284c7" stroke-width="1.8" stroke-linecap="round" />
    <circle cx="285" cy="240" r="3.5" fill="#0284c7" />
    <text x="95" y="230" text-anchor="end" font-size="18" fill="#0369a1">4. Right Atrium (Dayaan Dehleez)</text>
    <text x="95" y="248" text-anchor="end" font-size="14" fill="#334155" font-weight="600">Vena Cava se impure blood receive karta hai &#x2b05;</text>

    <!-- 5. Tricuspid Valve -->
    <path d="M 310 295 L 160 295 L 100 295" fill="none" stroke="#b45309" stroke-width="1.8" stroke-linecap="round" />
    <circle cx="310" cy="295" r="3.5" fill="#b45309" />
    <text x="95" y="290" text-anchor="end" font-size="18" fill="#b45309">5. Tricuspid Valve (3 flaps)</text>
    <text x="95" y="308" text-anchor="end" font-size="14" fill="#334155" font-weight="600">Blood ko wapis Atrium me jane se rokta hai &#x2b05;</text>

    <!-- 6. Right Ventricle -->
    <path d="M 330 350 L 160 355 L 100 355" fill="none" stroke="#2563eb" stroke-width="1.8" stroke-linecap="round" />
    <circle cx="330" cy="350" r="3.5" fill="#2563eb" />
    <text x="95" y="350" text-anchor="end" font-size="18" fill="#1e40af">6. Right Ventricle</text>
    <text x="95" y="368" text-anchor="end" font-size="14" fill="#334155" font-weight="600">Blood ko pulmonary artery ke zariye lungs me pump karta hai &#x2b05;</text>

    <!-- 7. Pulmonary Veins (Right side) -->
    <path d="M 500 235 L 540 180 L 580 180" fill="none" stroke="#ef4444" stroke-width="1.8" stroke-linecap="round" />
    <circle cx="500" cy="235" r="3.5" fill="#ef4444" />
    <text x="585" y="175" font-size="18" fill="#b91c1c">7. Pulmonary Veins (Riyawi Ragen)</text>
    <text x="585" y="193" font-size="14" fill="#334155" font-weight="600">&#x27a1; Lungs se saaf (Oxygenated) blood lati hain</text>

    <!-- 8. Left Atrium (Right side) -->
    <path d="M 470 250 L 530 240 L 580 240" fill="none" stroke="#dc2626" stroke-width="1.8" stroke-linecap="round" />
    <circle cx="470" cy="250" r="3.5" fill="#dc2626" />
    <text x="585" y="235" font-size="18" fill="#991b1b">8. Left Atrium (Bayaan Dehleez)</text>
    <text x="585" y="253" font-size="14" fill="#334155" font-weight="600">&#x27a1; Oxygenated blood collect karta hai</text>

    <!-- 9. Bicuspid / Mitral Valve -->
    <path d="M 445 295 L 530 295 L 580 295" fill="none" stroke="#b45309" stroke-width="1.8" stroke-linecap="round" />
    <circle cx="445" cy="295" r="3.5" fill="#b45309" />
    <text x="585" y="290" font-size="18" fill="#b45309">9. Bicuspid / Mitral Valve (2 flaps)</text>
    <text x="585" y="308" font-size="14" fill="#334155" font-weight="600">&#x27a1; Prevents backflow from Left Ventricle to Left Atrium</text>

    <!-- 10. Left Ventricle -->
    <path d="M 440 370 L 530 360 L 580 360" fill="none" stroke="#b91c1c" stroke-width="1.8" stroke-linecap="round" />
    <circle cx="440" cy="370" r="3.5" fill="#b91c1c" />
    <text x="585" y="355" font-size="18" fill="#7f1d1d">10. Left Ventricle (Thick Myocardium)</text>
    <text x="585" y="373" font-size="14" fill="#334155" font-weight="600">&#x27a1; Highest pressure chamber! Pumps blood into Aorta</text>

    <!-- 11. Septum -->
    <path d="M 375 390 L 375 425 L 430 425" fill="none" stroke="#e11d48" stroke-width="1.8" stroke-linecap="round" />
    <circle cx="375" cy="390" r="3.5" fill="#e11d48" />
    <text x="435" y="420" font-size="18" fill="#be123c">11. Interventricular Septum (Fasil Parda)</text>
    <text x="435" y="438" font-size="14" fill="#334155" font-weight="600">&#x27a1; Saaf aur gande khoon ko aapas me mix hone se rokta hai</text>
  </g>

  <!-- Bottom Student Handwritten Notes Box -->
  <g transform="translate(85, 470)">
    <rect width="680" height="180" rx="10" fill="#fffbeb" stroke="#fcd34d" stroke-width="2" filter="url(#shadow)" />
    
    <g font-family="'Caveat', 'Architects Daughter', cursive, sans-serif">
      <text x="20" y="30" font-size="20" font-weight="700" fill="#b45309">
        &#x1f4dd; Hand-written Exam Summary &amp; Key Functions:
      </text>

      <text x="25" y="60" font-size="16" font-weight="600" fill="#1e293b">
        &#x2022; <tspan font-weight="700" fill="#1d4ed8">Right Side of Heart (Blue):</tspan> Always handles <tspan fill="#1d4ed8">Deoxygenated Blood</tspan> (CO2-rich) coming from the body.
      </text>

      <text x="25" y="85" font-size="16" font-weight="600" fill="#1e293b">
        &#x2022; <tspan font-weight="700" fill="#dc2626">Left Side of Heart (Red):</tspan> Always handles <tspan fill="#dc2626">Oxygenated Blood</tspan> (O2-rich) coming from Lungs via Pulmonary Veins.
      </text>

      <text x="25" y="112" font-size="16" font-weight="700" fill="#0f172a">
        &#x2022; Double Circulation Pathway (Board Exam Mnemonic):
      </text>
      <text x="40" y="132" font-size="15" font-weight="600" fill="#475569">
        Body &#x27a1; Vena Cava &#x27a1; RA &#x27a1; Tricuspid &#x27a1; RV &#x27a1; Pulm. Artery &#x27a1; Lungs (Oxygenation) &#x27a1; Pulm. Veins &#x27a1; LA &#x27a1; Bicuspid &#x27a1; LV &#x27a1; Aorta &#x27a1; Body
      </text>

      <text x="25" y="160" font-size="15" font-weight="700" fill="#e11d48">
        &#x2605; Pro Exam Tip: Left Ventricle ki deewar (wall) 3 guna zyada moti hoti hai kyunki usne poore jism tak khoon phonchana hota hai!
      </text>
    </g>
  </g>
</svg>`,
    explanation: `Yahan aapka requested **Human Heart ka authentic Labeled Diagram** student notebook paper style me tayyar hai! Is me handwriting look, color-coded deoxygenated (blue) aur oxygenated (red) blood flow, aur har hissay ke functions wazeh likhe gaye hain:

### 🫀 Human Heart ke 4 Chambers aur Unke Functions:

1. **Right Atrium (Dayaan Dehleez):**
   - Poore jism se deoxygenated (CO₂ se bhara) khoon Superior aur Inferior Vena Cava ke zariye yahan dakhil hota hai.

2. **Right Ventricle:**
   - Jab Tricuspid valve khulta hai to khoon Right Ventricle me ata hai. Yahan se heart contract ho kar khoon ko **Pulmonary Artery** ke zariye phephron (lungs) me bhejta hai taake oxygen mil sake.

3. **Left Atrium (Bayaan Dehleez):**
   - Lungs se saaf, oxygen se bharpoor (Oxygenated) khoon **Pulmonary Veins** ke zariye Left Atrium me ata hai.

4. **Left Ventricle (Thickest Muscular Chamber):**
   - Bicuspid / Mitral valve ke zariye khoon Left Ventricle me ata hai. Yeh heart ka sab se taqatwar hissa hai jo khoon ko **Aorta** me pump karta hai jahan se yeh poore jism (dimagh, hath, paon, aza) ko supply hota hai.

---

### 🔑 Valves & Septum:
- **Tricuspid Valve:** Right atrium aur right ventricle ke darmyan backflow ko rokta hai.
- **Bicuspid (Mitral) Valve:** Left atrium aur left ventricle ke darmyan backflow ko rokta hai.
- **Interventricular Septum:** Saaf aur gande khoon ko aapas me mix hone se roknay wala mazboot fasil parda.

💡 **Image Download Karain:** Diagram ke upar **"Download as Image (PNG)"** button dabayein taake aap is diagram ko high-resolution image ki shakal me apne phone ya computer me save kar sakein!`
  },
  {
    matchKeywords: ['plant cell', 'cell wall', 'chloroplast', 'vacuole'],
    title: 'Plant Cell Structure & Organelles (Ruled Paper Notes)',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="auto" style="background:#fdfcf7; border-radius:14px; box-shadow:0 10px 25px rgba(0,0,0,0.15);">
  <defs>
    <pattern id="plantRuled" width="800" height="24" patternUnits="userSpaceOnUse">
      <line x1="0" y1="23" x2="800" y2="23" stroke="#e2e8f0" stroke-width="1.2" />
    </pattern>
  </defs>
  <rect width="800" height="600" fill="#fdfbf7" rx="14" />
  <rect width="800" height="600" fill="url(#plantRuled)" rx="14" />
  <line x1="70" y1="0" x2="70" y2="600" stroke="#fca5a5" stroke-width="2.5" />

  <g font-family="'Caveat', cursive, sans-serif">
    <text x="85" y="32" font-size="16" fill="#64748b" font-weight="600">Biology: Class 9/11  |  Topic: Plant Cell Structure</text>
    <text x="400" y="65" text-anchor="middle" font-size="28" font-weight="700" fill="#15803d">&#x1f33f; Plant Cell Structure &amp; Labeled Functions</text>
  </g>

  <!-- Cell Body -->
  <g transform="translate(160, 90)">
    <!-- Cell Wall -->
    <polygon points="120,20 360,20 440,160 380,330 100,330 40,170" fill="#dcfce7" stroke="#16a34a" stroke-width="8" stroke-linejoin="round" />
    <!-- Cell Membrane -->
    <polygon points="125,30 355,30 430,160 372,320 105,320 50,170" fill="#f0fdf4" stroke="#4ade80" stroke-width="3" stroke-linejoin="round" />

    <!-- Large Central Vacuole -->
    <path d="M 160 90 Q 280 60 330 140 Q 350 250 260 280 Q 150 280 140 180 Z" fill="#bae6fd" stroke="#0284c7" stroke-width="2.5" />
    <text x="240" y="180" font-family="'Caveat', cursive, sans-serif" font-size="18" font-weight="700" fill="#0369a1" text-anchor="middle">Large Central Vacuole (Turgor Pressure)</text>

    <!-- Nucleus pushed to side -->
    <circle cx="105" cy="115" r="35" fill="#fbcfe8" stroke="#db2777" stroke-width="2.5" />
    <circle cx="105" cy="115" r="14" fill="#9d174d" />
    <text x="105" y="165" font-family="'Caveat', cursive, sans-serif" font-size="14" font-weight="700" fill="#831843" text-anchor="middle">Nucleus</text>

    <!-- Chloroplasts -->
    <ellipse cx="320" cy="80" rx="25" ry="14" fill="#22c55e" stroke="#15803d" stroke-width="2" />
    <ellipse cx="360" cy="270" rx="25" ry="14" fill="#22c55e" stroke="#15803d" stroke-width="2" />
    <ellipse cx="100" cy="250" rx="25" ry="14" fill="#22c55e" stroke="#15803d" stroke-width="2" />

    <!-- Mitochondria -->
    <ellipse cx="200" cy="300" rx="22" ry="12" fill="#fb923c" stroke="#c2410c" stroke-width="2" />
  </g>

  <!-- Labels -->
  <g font-family="'Caveat', cursive, sans-serif" font-size="17" font-weight="700">
    <text x="90" y="470" fill="#15803d">&#x2022; Cell Wall: Rigid cellulose layer giving fixed shape and mechanical protection</text>
    <text x="90" y="500" fill="#0369a1">&#x2022; Central Vacuole: Stores water and cell sap, maintains hydrostatic turgidity</text>
    <text x="90" y="530" fill="#16a34a">&#x2022; Chloroplast: Contains green pigment Chlorophyll for Photosynthesis</text>
    <text x="90" y="560" fill="#9d174d">&#x2022; Nucleus: Genetic control center of cell, pushed to periphery due to large vacuole</text>
  </g>
</svg>`,
    explanation: `Plant Cell ka complete labeled diagram:
1. **Cell Wall:** Cellulose se bana rigid outer cover jo plant ko shape aur support deta hai.
2. **Large Central Vacuole:** Cell sap aur water store karta hai aur turgor pressure maintain rakhta hai.
3. **Chloroplast:** Photosynthesis ka markaz jo dhoop se khana tayyar karta hai.
4. **Nucleus:** Cell ke tamam af'aal ko control karta hai.`
  },
  {
    matchKeywords: ['benzene', 'resonance', 'organic chemistry', 'kekule', 'aromatic'],
    title: 'Benzene Structure & Resonance Hybrids (Handwritten Chemistry Notes)',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 550" width="100%" height="auto" style="background:#fdfcf7; border-radius:14px; box-shadow:0 10px 25px rgba(0,0,0,0.15);">
  <defs>
    <pattern id="chemRuled" width="800" height="24" patternUnits="userSpaceOnUse">
      <line x1="0" y1="23" x2="800" y2="23" stroke="#e2e8f0" stroke-width="1.2" />
    </pattern>
  </defs>
  <rect width="800" height="550" fill="#fdfbf7" rx="14" />
  <rect width="800" height="550" fill="url(#chemRuled)" rx="14" />
  <line x1="70" y1="0" x2="70" y2="550" stroke="#fca5a5" stroke-width="2.5" />

  <g font-family="'Caveat', cursive, sans-serif">
    <text x="85" y="32" font-size="16" fill="#64748b" font-weight="600">Chemistry: Class 12 / MDCAT  |  Topic: Benzene &amp; Aromaticity</text>
    <text x="400" y="65" text-anchor="middle" font-size="28" font-weight="700" fill="#1e1b4b">&#x2697;&#xfe0f; Benzene (C6H6) Resonance Structures</text>
  </g>

  <!-- Kekule Structure 1 -->
  <g transform="translate(120, 110)">
    <polygon points="100,20 160,55 160,125 100,160 40,125 40,55" fill="none" stroke="#312e81" stroke-width="3" />
    <line x1="150" y1="60" x2="150" y2="120" stroke="#4338ca" stroke-width="3" />
    <line x1="95" y1="150" x2="48" y2="122" stroke="#4338ca" stroke-width="3" />
    <line x1="48" y1="58" x2="95" y2="30" stroke="#4338ca" stroke-width="3" />
    <text x="100" y="195" font-family="'Caveat', cursive, sans-serif" font-size="18" font-weight="700" fill="#3730a3" text-anchor="middle">Kekulé Structure I</text>
  </g>

  <!-- Equilibrium double arrow -->
  <g transform="translate(300, 200)" font-family="'Caveat', cursive, sans-serif" font-size="32" fill="#4338ca">
    <text x="0" y="0">&#x27f7;</text>
  </g>

  <!-- Kekule Structure 2 -->
  <g transform="translate(350, 110)">
    <polygon points="100,20 160,55 160,125 100,160 40,125 40,55" fill="none" stroke="#312e81" stroke-width="3" />
    <line x1="105" y1="28" x2="152" y2="55" stroke="#4338ca" stroke-width="3" />
    <line x1="152" y1="125" x2="105" y2="152" stroke="#4338ca" stroke-width="3" />
    <line x1="50" y1="120" x2="50" y2="60" stroke="#4338ca" stroke-width="3" />
    <text x="100" y="195" font-family="'Caveat', cursive, sans-serif" font-size="18" font-weight="700" fill="#3730a3" text-anchor="middle">Kekulé Structure II</text>
  </g>

  <!-- Equilibrium arrow -->
  <g transform="translate(530, 200)" font-family="'Caveat', cursive, sans-serif" font-size="32" fill="#4338ca">
    <text x="0" y="0">&#x27f7;</text>
  </g>

  <!-- Resonance Hybrid Circle -->
  <g transform="translate(580, 110)">
    <polygon points="100,20 160,55 160,125 100,160 40,125 40,55" fill="#e0e7ff" stroke="#312e81" stroke-width="3" />
    <circle cx="100" cy="90" r="38" fill="none" stroke="#4f46e5" stroke-width="3" stroke-dasharray="6 4" />
    <text x="100" y="195" font-family="'Caveat', cursive, sans-serif" font-size="18" font-weight="700" fill="#4338ca" text-anchor="middle">Resonance Hybrid (Delocalized &#x3c0;-cloud)</text>
  </g>

  <!-- Notes -->
  <g transform="translate(90, 360)" font-family="'Caveat', cursive, sans-serif" font-size="18" font-weight="600" fill="#1e1b4b">
    <text x="0" y="0" font-weight="700" font-size="20" fill="#4338ca">&#x1f4dd; Board Exam Key Points:</text>
    <text x="0" y="30">&#x2022; Molecular Formula: C6H6 | Geometry: Planar Hexagonal | Bond Angle: 120&#xb0; (sp2 hybridized)</text>
    <text x="0" y="60">&#x2022; C-C Bond Length: 1.397 &#xc5; (intermediate between C-C single 1.54 &#xc5; and C=C double 1.34 &#xc5;)</text>
    <text x="0" y="90">&#x2022; Resonance Energy: 150.5 kJ/mol (Extra ordinary stability due to completely delocalized 6 &#x3c0; electrons)</text>
    <text x="0" y="120">&#x2022; Undergoes Electrophilic Substitution Reactions rather than Addition reactions to preserve aromaticity!</text>
  </g>
</svg>`,
    explanation: `Benzene ki sakht aur resonance structures:
1. **Planar Hexagon:** Tamam Carbon atoms sp² hybridized hain aur bond angle 120° hai.
2. **Delocalized Pi Electrons:** 6 pi electrons ring ke upar aur neeche cloud ki shakal me poori ring me ghoomte hain.
3. **Resonance Energy:** 150.5 kJ/mol extra stability faraham karti hai!`
  }
];

export function findFallbackDiagram(query: string): FallbackDiagram | null {
  const lower = query.toLowerCase();
  for (const item of FALLBACK_DIAGRAMS) {
    if (item.matchKeywords.some(kw => lower.includes(kw))) {
      return item;
    }
  }
  return null;
}
