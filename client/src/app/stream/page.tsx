import React from "react";
import TextStreamer from "../../components/textStreamer";

// no change for tailwind to ruin my evening, hahahah

const StreamDemo: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Text Streaming Demo
        </h1>
      </div>

      <TextStreamer />
    </div>
  );
};

export default StreamDemo;
