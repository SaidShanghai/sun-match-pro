import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "212600116007";
const DEFAULT_MESSAGE = "Bonjour, je souhaite avoir plus d'informations sur vos solutions solaires.";

const WhatsAppBubble = () => {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  const handleClick = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Contactez-nous sur WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 active:scale-95 border-0 cursor-pointer"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 fill-current">
        <path d="M16.004 0C7.165 0 .002 7.163.002 16c0 2.825.737 5.58 2.14 8.012L.014 32l8.208-2.15A15.94 15.94 0 0 0 16.004 32C24.837 32 32 24.837 32 16S24.837 0 16.004 0zm0 29.18a13.14 13.14 0 0 1-6.702-1.836l-.48-.285-4.98 1.306 1.328-4.852-.313-.497A13.12 13.12 0 0 1 2.823 16c0-7.27 5.916-13.18 13.18-13.18S29.18 8.73 29.18 16s-5.91 13.18-13.176 13.18zm7.23-9.862c-.396-.198-2.34-1.155-2.703-1.287-.363-.132-.627-.198-.891.198s-1.023 1.287-1.254 1.551c-.231.264-.462.297-.858.099s-1.674-.617-3.189-1.968c-1.179-1.05-1.974-2.349-2.205-2.745s-.024-.612.174-.81c.18-.177.396-.462.594-.693.198-.231.264-.396.396-.66.132-.264.066-.495-.033-.693s-.891-2.148-1.221-2.94c-.321-.774-.648-.669-.891-.681l-.759-.012c-.264 0-.693.099-1.056.495s-1.386 1.353-1.386 3.3 1.419 3.828 1.617 4.092c.198.264 2.793 4.263 6.768 5.979.945.408 1.683.651 2.259.834.948.3 1.812.258 2.493.156.762-.114 2.34-.957 2.67-1.881.33-.924.33-1.716.231-1.881-.099-.165-.363-.264-.759-.462z" />
      </svg>
    </button>
  );
};

export default WhatsAppBubble;
