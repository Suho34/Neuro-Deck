export function SignInPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div>
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-lg overflow-hidden">
            {/* Header Skeleton with shimmer */}
            <div className="text-center pb-6 pt-6 px-6">
              <div className="h-9 bg-gradient-to-r from-white/20 via-white/30 to-white/20 rounded-lg mb-4 animate-shimmer bg-size-200 bg-pos-0"></div>
              <div className="h-6 bg-gradient-to-r from-white/15 via-white/25 to-white/15 rounded-lg w-3/4 mx-auto animate-shimmer bg-size-200 bg-pos-0"></div>
            </div>

            {/* Content Skeleton with shimmer */}
            <div className="space-y-4 pb-8 px-6">
              {/* Button skeletons with shimmer */}
              <div className="w-full h-14 bg-gradient-to-r from-white/20 via-white/30 to-white/20 rounded-lg animate-shimmer bg-size-200 bg-pos-0 flex items-center px-4">
                <div className="w-10 h-10 bg-gradient-to-r from-white/30 via-white/40 to-white/30 rounded-full mr-3 animate-shimmer bg-size-200 bg-pos-0"></div>
                <div className="h-4 bg-gradient-to-r from-white/30 via-white/40 to-white/30 rounded w-32 animate-shimmer bg-size-200 bg-pos-0"></div>
                <div className="ml-auto w-5 h-5 bg-gradient-to-r from-white/30 via-white/40 to-white/30 rounded animate-shimmer bg-size-200 bg-pos-0"></div>
              </div>

              <div className="w-full h-14 bg-gradient-to-r from-white/20 via-white/30 to-white/20 rounded-lg animate-shimmer bg-size-200 bg-pos-0 flex items-center px-4">
                <div className="w-10 h-10 bg-gradient-to-r from-white/30 via-white/40 to-white/30 rounded-full mr-3 animate-shimmer bg-size-200 bg-pos-0"></div>
                <div className="h-4 bg-gradient-to-r from-white/30 via-white/40 to-white/30 rounded w-36 animate-shimmer bg-size-200 bg-pos-0"></div>
                <div className="ml-auto w-5 h-5 bg-gradient-to-r from-white/30 via-white/40 to-white/30 rounded animate-shimmer bg-size-200 bg-pos-0"></div>
              </div>

              {/* Divider */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <div className="px-4 bg-transparent">
                    <div className="h-4 bg-gradient-to-r from-white/20 via-white/30 to-white/20 rounded w-48 animate-shimmer bg-size-200 bg-pos-0"></div>
                  </div>
                </div>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-400/50 rounded animate-pulse"></div>
                  <div className="h-3 bg-gradient-to-r from-white/20 via-white/30 to-white/20 rounded w-12 animate-shimmer bg-size-200 bg-pos-0"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400/50 rounded animate-pulse"></div>
                  <div className="h-3 bg-gradient-to-r from-white/20 via-white/30 to-white/20 rounded w-16 animate-shimmer bg-size-200 bg-pos-0"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        .bg-size-200 {
          background-size: 200% 100%;
        }
        .bg-pos-0 {
          background-position: 0% 0;
        }
      `}</style>
    </div>
  );
}
