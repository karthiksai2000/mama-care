import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Twitter, Github } from 'lucide-react';

const HERO_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4';

const Landing = () => {
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const earlyLoopSeconds = 3;
    let didLoop = false;

    const handleTimeUpdate = () => {
      if (!video.duration) return;

      const t = video.currentTime;
      const d = video.duration;

      if (d - t <= earlyLoopSeconds && !didLoop) {
        didLoop = true;
        video.currentTime = 0.1;
      }

      if (t < 0.2) {
        didLoop = false;
      }
    };

    video.play().catch(() => undefined);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black font-body text-white">
      <div className="fixed inset-0 z-0">
        <video
          ref={videoRef}
          className="h-full w-full object-cover opacity-100"
          src={HERO_VIDEO}
          autoPlay
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-pink-900/20 to-black/40" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-3 md:px-10">
          <div className="font-display text-2xl text-white sm:text-3xl">MaMa Care</div>
          
          <button
            className="rounded-full bg-white px-6 py-2.5 text-sm text-[#1d0f2f] transition-transform hover:scale-[1.03]"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </header>

        <section className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-12 px-6 pb-24 pt-9 md:px-10 lg:flex-row lg:items-center">
          <div className="flex w-full flex-col items-start text-left lg:max-w-[58%]">
            <span className="animate-fade-rise inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/80 backdrop-blur">
              ✨ AI Powered Pregnancy Companion
            </span>
            <h1 className="animate-fade-rise mt-6 font-display text-5xl font-normal leading-[0.95] tracking-[-2.46px] text-white sm:text-6xl md:text-7xl lg:text-8xl">
              Your Pregnancy Journey,
              <br />
              Guided With Care.
            </h1>
            <p className="animate-fade-rise-delay mt-6 max-w-2xl text-base leading-relaxed text-white sm:text-lg">
              Track every week, understand symptoms, receive personalized support, reminders, nutrition tips, and emotional guidance — all in one intelligent companion.
            </p>
            <div className="animate-fade-rise-delay-2 mt-8 flex flex-wrap gap-4">
              <button
                className="rounded-full bg-white px-10 py-4 text-sm font-semibold text-[#1d0f2f] transition-transform hover:scale-[1.03]"
                onClick={() => navigate('/signup')}
              >
                Begin Journey
              </button>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/80">
              {['Trusted by mothers', 'Weekly tracking', '24/7 AI Support'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="text-white">✔</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex w-full justify-center lg:max-w-[42%]">
            <div className="liquid-glass w-full max-w-sm rounded-[32px] border border-white/20 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl text-white">Week 18 Baby Growth</h3>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs uppercase text-white/80">Live</span>
              </div>
              <div className="mt-5 space-y-4 text-sm text-white/80">
                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <span>Mood Check</span>
                  <span className="text-white">Calm</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <span>Water Reminder</span>
                  <span className="text-white">6/8</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <span>Doctor Visit</span>
                  <span className="text-white">3 days</span>
                </div>
              </div>
              <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/20">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#ffd1dc] via-[#f9b5ff] to-[#d7b7ff]" />
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/60">Heartbeat steady</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Landing;