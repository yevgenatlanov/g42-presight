import React from "react";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                G42 Test task for Yevhenii
              </h1>
            </div>
            <nav className="flex space-x-4">
              <Link
                to="/users"
                className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Users list
              </Link>
              <Link
                to="/stream"
                className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Stream
              </Link>
              <Link
                to="/webworker"
                className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Webworker
              </Link>

              <Link
                to="/redisworker"
                className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Redis worker
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} G42 Test task. I'm footer btw :)
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
