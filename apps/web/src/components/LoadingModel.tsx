import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Brain, Sparkles } from "lucide-react";

export default function LoadingModal() {
  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-gray-900 to-gray-800 border-0 rounded-lg shadow-2xl">
        <div className="flex flex-col items-center justify-center space-y-6 py-8">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-75 blur animate-pulse"></div>
            <div className="relative bg-gray-800 rounded-full p-6">
              <Brain className="h-16 w-16 text-purple-400 animate-bounce" />
            </div>
          </div>
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-bold text-white">
              Generating Your Report
            </h3>
            <p className="text-gray-300">
              Our AI is analyzing data from multiple sources to create your
              personalized report.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-yellow-400">
            <Sparkles className="h-5 w-5 animate-spin" />
            <span className="text-sm font-medium">Processing ML concepts</span>
            <Sparkles className="h-5 w-5 animate-spin" />
          </div>
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"
                style={{ animationDelay: `${i * 0.15}s` }}
              ></div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
