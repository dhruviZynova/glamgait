import React from 'react';

const Loader = ({ fullScreen = false }) => {
    const loaderContent = (
        <div className="relative flex items-center justify-center">
            {/* Simple and attractive minimalist spinner */}
            <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-gray-100 border-t-[#1C2F2F]"></div>

            {/* Subtle center dot for a more "attractive" look */}
            <div className="absolute h-1.5 w-1.5 rounded-full bg-[#1C2F2F]/50"></div>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-[2px]">
                {loaderContent}
            </div>
        );
    }

    return (
        <div className="flex min-h-[200px] w-full items-center justify-center py-10">
            {loaderContent}
        </div>
    );
};

export default Loader;
