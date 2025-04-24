import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RedisWorkerPage from "./app/redisworker/page";

const StreamPage = lazy(() => import("./app/stream/page"));
const UserPage = lazy(() => import("./app/user-page"));
const WebWorkerPage = lazy(() => import("./app/webworker/page"));

const Loading = () => (
  <div className="p-4 text-center">Non Fancy Loading...</div>
);

const Router = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Navigate to="/users" />} />
        <Route path="/stream" element={<StreamPage />} />
        <Route path="/users" element={<UserPage />} />
        <Route path="/webworker" element={<WebWorkerPage />} />
        <Route path="/redisworker" element={<RedisWorkerPage />} />
        {/* More pages more routes go here, yaaay */}
      </Routes>
    </Suspense>
  );
};

export default Router;
