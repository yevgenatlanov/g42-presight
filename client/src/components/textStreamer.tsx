import React, { useState, useEffect, useRef } from "react";
import Button from "./button";

const TextStreamer: React.FC = () => {
  const [streamedText, setStreamedText] = useState<string>("");
  const [fullText, setFullText] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [streamComplete, setStreamComplete] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const startStreaming = async () => {
    // Reset states
    setStreamedText("");
    setFullText("");
    setStreamComplete(false);
    setIsStreaming(true);

    try {
      // Create abort controller to be able to cancel the stream if needed
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      const response = await fetch("/api/stream/text", { signal });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const reader = response.body.getReader();

      const processStream = async () => {
        let accumulatedText = "";

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              setStreamComplete(true);
              setFullText(accumulatedText);
              break;
            }

            // Decode the received chunk
            const chunk = new TextDecoder().decode(value);
            accumulatedText += chunk;

            // Update the displayed text character by character
            // This simulates displaying one character at a time
            for (const char of chunk) {
              setStreamedText((prev) => prev + char);
              // Small delay to make it visible
              await new Promise((resolve) => setTimeout(resolve, 10));
            }
          }
        } catch (error: any) {
          if (error.name !== "AbortError") {
            console.error("Error reading stream:", error);
          }
        } finally {
          setIsStreaming(false);
        }
      };

      processStream();
    } catch (error) {
      console.error("Failed to fetch stream:", error);
      setIsStreaming(false);
    }
  };

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex space-x-3">
        <Button onClick={startStreaming} disabled={isStreaming}>
          Start Streaming
        </Button>

        <Button
          onClick={stopStreaming}
          disabled={!isStreaming}
          variant="outline"
        >
          Stop Streaming
        </Button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm min-h-[200px] max-h-[400px] overflow-auto">
        {isStreaming && (
          <div className="mb-2 flex items-center">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
            <span className="text-sm text-green-600">Streaming...</span>
          </div>
        )}

        {!streamComplete && (
          <div className="whitespace-pre-wrap">{streamedText}</div>
        )}

        {streamComplete && (
          <div className="whitespace-pre-wrap">
            <h3 className="text-base font-medium text-gray-900 mb-2">
              Stream Complete
            </h3>
            {fullText}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextStreamer;
