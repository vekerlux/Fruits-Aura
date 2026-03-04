import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
    title,
    description,
    image,
    url,
    type = 'website'
}) => {
    const siteTitle = 'Fruits Aura';
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const siteDescription = description || 'Refresh your Aura with premium natural fruit mixes. Pure, fresh, and delivered to your doorstep.';
    const siteUrl = url || window.location.origin;
    const siteImage = image || '/og-image.jpg'; // We should ensure this exists

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={siteDescription} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={siteUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={siteDescription} />
            <meta property="og:image" content={siteImage} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={siteUrl} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={siteDescription} />
            <meta name="twitter:image" content={siteImage} />
        </Helmet>
    );
};

export default SEO;
