// Simple Typing Video Component
const TypingVideoSection = () => {
  return (
    <section className="py-16 px-4" style={{
    }}>
      <div className="container mx-auto max-w-4xl ">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-[#1a2634] text-center mb-6">
          Typing in Action
        </h2>
        <p className="text-lg text-[#5a6a7e] text-center mb-12">
          Watch professional typing techniques in motion
        </p>

        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black">
          <div className="relative" style={{ paddingBottom: '56.25%' }}>
            <video
              className="absolute top-0 left-0 w-full h-full"
              poster="https://as2.ftcdn.net/v2/jpg/12/45/25/85/1000_F_1245258533_LNJ0xTx9wecgNb1deYRKVsi8KVDbjVT6.jpg"
              autoPlay
              loop
              muted
              playsInline
              controls
              controlsList="nodownload"
              preload="none"
              aria-label="Typing Hands Explainer Motion Graphics"
            >
              <source 
                type="video/mp4" 
                src="https://v.ftcdn.net/12/45/25/85/700_F_1245258533_LNJ0xTx9wecgNb1deYRKVsi8KVDbjVT6_ST.mp4" 
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <span className="px-4 py-2 bg-white rounded-full border border-[#e8edf3] text-sm text-[#1a2634]">
            ⌨️ Typing Animation
          </span>
          <span className="px-4 py-2 bg-white rounded-full border border-[#e8edf3] text-sm text-[#1a2634]">
            🎨 Motion Graphics
          </span>
          <span className="px-4 py-2 bg-white rounded-full border border-[#e8edf3] text-sm text-[#1a2634]">
            📱 Full HD
          </span>
        </div>
      </div>
    </section>
  );
};

export default TypingVideoSection;