import React, { memo } from 'react';
import { MessageCircle } from 'lucide-react';
import './FloatingWhatsApp.css';

// Using React.memo to prevent unnecessary re-renders of this static component.
// Since it has no props and doesn't rely on external state, it will only render once.
const FloatingWhatsApp = () => {
    const phoneNumber = '2348000000000'; // Replace with real number
    const message = 'Hello Fruits Aura, I need assistance.';

    const handleClick = () => {
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <button
            className="floating-whatsapp"
            onClick={handleClick}
            aria-label="Chat on WhatsApp"
        >
            <MessageCircle size={32} />
        </button>
    );
};

export default memo(FloatingWhatsApp);
