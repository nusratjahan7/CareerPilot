import ImageUnderstanding from '@/components/imageU/ImageUnderstanding';
import React from 'react';

const AiImage = () => {
    return (
        <div>
            <ImageUnderstanding apiBaseUrl={`${process.env.NEXT_PUBLIC_BACKEND_URL}`} />
        </div>
    );
};

export default AiImage;