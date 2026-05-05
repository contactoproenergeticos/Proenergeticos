'use client';

export default function AccessibilityButton() {
  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <button 
        onClick={() => document.documentElement.classList.toggle('modo-accesible')}
        className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 border-4 border-white"
        aria-label="Activar modo de alta visibilidad para débiles visuales"
        title="Opciones de Accesibilidad"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/>
        </svg>
      </button>
    </div>
  );
}