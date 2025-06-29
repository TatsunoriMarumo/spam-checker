"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PredictionResponse {
  Category: string;
  score: number;
}

export default function SpamChecker() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [loadingModels, setLoadingModels] = useState(true);

  const API_ENDPOINT = "https://spam-checker-erfw.onrender.com";

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch(
          `${API_ENDPOINT}/models`
        );
        if (!response.ok) {
          throw new Error("Failed to retrieve model list.");
        }
        const { models } = await response.json();
        setModels(models);
        if (models.length > 0) {
          setSelectedModel(models[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading models.");
      } finally {
        setLoadingModels(false);
      }
    };

    fetchModels();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      setError("Please enter a message.");
      return;
    }

    if (!selectedModel) {
      setError("Please select a model.");
      return;
    }

    setLoading(true);
    setError(null);
    setShowResult(false);

    try {
      const response = await fetch(`${API_ENDPOINT}/predict/${selectedModel}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get prediction.");
      }

      const data = await response.json();
      setResult(data);

      setTimeout(() => {
        setShowResult(true);
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            SMS Spam Checker
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter a message to check if it's spam.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="model"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Model
            </label>
            {loadingModels ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-gray-500">Loading models...</span>
              </div>
            ) : (
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger id="model" className="w-full">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="message"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Message
            </label>
            <Textarea
              id="message"
              placeholder="Enter the message you want to check..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[120px] w-full resize-none"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={
              loading || !text.trim() || !selectedModel || loadingModels
            }
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              "Check Spam"
            )}
          </Button>
        </form>

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div
            className={`
              rounded-lg p-5 transition-opacity duration-500 ease-in-out
              ${showResult ? "opacity-100" : "opacity-0"}
              ${
                result.Category === "spam"
                  ? "bg-red-50 dark:bg-red-900/30"
                  : "bg-green-50 dark:bg-green-900/30"
              }
            `}
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-3xl">
                {result.Category === "spam" ? "🚨" : "✅"}
              </span>
              <h2
                className={`text-2xl font-bold ${
                  result.Category === "spam"
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-600 dark:text-green-400"
                }`}
              >
                {result.Category === "spam" ? "Spam" : "Ham"}
              </h2>
            </div>
            <p
              className={`mt-2 text-center ${
                result.Category === "spam"
                  ? "text-red-600 dark:text-red-400"
                  : "text-green-600 dark:text-green-400"
              }`}
            >
              Confidence: {(result.score * 100).toFixed(2)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
