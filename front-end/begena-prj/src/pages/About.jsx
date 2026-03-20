import React from "react";
import { motion } from "framer-motion";
import { Github } from "lucide-react";

export function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-background text-black dark:text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-extrabold tracking-tight mb-8 bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            About BEGENA
          </h1>

          <div className="space-y-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            <p>
              Welcome to{" "}
              <span className="font-bold text-black dark:text-white underline decoration-2 underline-offset-4">
                BEGENA
              </span>
              , your ultimate destination for music, podcasts, and lofi beats.
              Our mission is to provide a seamless and immersive audio
              experience for every listener.
            </p>

            <p>
              Whether you're looking to relax with our curated lofi collection,
              dive into thought-provoking podcasts, or discover the latest
              musical gems, BEGENA offers a platform where sound meets soul.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10">
              <div className="p-6 rounded-2xl bg-gray-50 dark:bg-card border border-gray-100 dark:border-border shadow-sm">
                <h3 className="text-xl font-bold mb-3">GOAL</h3>
                <p className="text-sm">
                  To Make BEGENA the best christian streaming music App for the
                  future if it is Gods will.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-gray-50 dark:bg-card border border-gray-100 dark:border-border shadow-sm">
                <h3 className="text-xl font-bold mb-3">Plans</h3>
                <p className="text-sm">
                  Continue to make better and add better features to Begena till
                  i make the app for it.
                </p>
              </div>
            </div>

            <p>
              BEGENA is built with thought to make christian songs in one place
              and to discover old songs .
            </p>
          </div>

          <motion.div
            className="mt-16 pt-8 border-t border-gray-200 dark:border-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-sm text-gray-500 text-center uppercase tracking-widest">
              Developed from the passion to the Audio Community
            </p>
            <div className="flex justify-center mt-6">
              <a
                href="https://github.com/leulmesfin116/Begena"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 dark:border-border hover:bg-gray-100 dark:hover:bg-card transition-colors"
              >
                <Github size={18} />
                <span className="font-semibold text-sm">GitHub Repository</span>
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
