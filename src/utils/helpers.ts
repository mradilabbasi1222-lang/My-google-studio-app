// Web Audio API notification chime generator (clean, gentle, non-intrusive)
export function playNotificationChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
    osc2.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.25); // D6

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start(ctx.currentTime + 0.08);
    osc1.stop(ctx.currentTime + 0.35);
    osc2.stop(ctx.currentTime + 0.35);
  } catch {
    // Graceful fallback if audio is restricted by browser autoplay policy
  }
}

// Download real readable file as formatted text or PDF simulation
export function downloadStudyDocument(fileName: string, title: string, content: string, uploader: string, className: string, subject: string) {
  const header = `================================================================================
TALIBILM ACADEMIC LIBRARY - STUDENT STUDY MATERIAL
Title: ${title}
Class: ${className} | Subject: ${subject}
Uploaded by: ${uploader} | Verified Academic Resource
Downloaded from: TalibIlm Student Hub
================================================================================

`;
  const fullText = header + content;
  const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName.endsWith('.pdf') ? fileName.replace('.pdf', '.txt') : `${fileName}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Format numbers for display
export function formatCount(n: number): string {
  if (n >= 1000) {
    return (n / 1000).toFixed(1) + 'k';
  }
  return n.toString();
}
