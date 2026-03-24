"use client";

//https://icolorpalette.com/color/922a31#palette-variations-container css colors used here.
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  // TIMELINE
  // image + text are ONE logical slide (same index = same pair)
  // timelineIndex is the source of truth; text NEVER advances separately
  const [timelineSlide, setTimelineSlide] = useState([]);
  const [timelineIndex, setTimelineIndex] = useState(0);
  const [showTimelineText, setShowTimelineText] = useState(false);
  // text visibility only; gated / extra info can be auth-checked before render

  // HISTORY
  const [historySlide, setHistorySlide] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showHistoryText, setShowHistoryText] = useState(false);
  const [historyText, setHistoryText] = useState([]);

  // HISTORY auto-advance: image -> wait 2s -> text -> total 5s per slide
  useEffect(() => {
    if (!historySlide.length) return;

    // fetch LLM text from route.js based on current history image
    const img = historySlide[historyIndex]?.image;
    if (img) {
      fetch(`/api/pluginLLm?image=${encodeURIComponent(img)}`)
        .then((r) => r.json())
        .then((d) =>
          setHistoryText(d?.history?.[historyIndex]?.paragraphs || []),
        )
        .catch(() => setHistoryText([]));
    }
    setTimeout(() => setShowHistoryText(false), 0);

    const textTimer = setTimeout(() => setShowHistoryText(true), 2000);
    const slideTimer = setTimeout(() => {
      setHistoryIndex((i) => (i + 1) % historySlide.length);
    }, 5000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(slideTimer);
    };
  }, [historyIndex, historySlide.length]);

  // CULTURE
  const [cultureSlide, setCultureSlide] = useState([]);
  const [cultureIndex, setCultureIndex] = useState(0);
  const [creationText, setCreationText] = useState([]);

  // FETCH IMAGES ONLY (data.json)
  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => {
        if (!data) return;
        setHistorySlide(data.history || []);
        setCultureSlide(data.culture || []);
        setTimelineSlide(data.timeline?.slides || []);
      });
  }, []);

  // CULTURE auto-advance (by index)
  useEffect(() => {
    if (!cultureSlide.length) return;
    const t = setInterval(() => {
      setCultureIndex((i) => (i + 1) % cultureSlide.length);
    }, 3000);
    return () => clearInterval(t);
  }, [cultureSlide.length]);

  // DYNASTY CREATION text (vector-based)
  useEffect(() => {
    fetch("/api/pluginLLm?type=creation")
      .then((r) => r.json())
      .then((d) => setCreationText(d?.paragraphs || []))
      .catch(() => setCreationText([]));
  }, []);

  // TIMELINE auto-advance + text delay (by index)
  // image index drives slide; text reveal handled separately
  useEffect(() => {
    if (!timelineSlide.length) return;
    const nextTimer = setTimeout(() => {
      setTimelineIndex((i) => (i + 1) % timelineSlide.length);
    }, 6000);
    return () => clearTimeout(nextTimer);
  }, [timelineIndex, timelineSlide.length]);

  // TEXT reveal (runs AFTER index change)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowTimelineText(false);
    const textTimer = setTimeout(() => setShowTimelineText(true), 300);
    return () => clearTimeout(textTimer);
  }, [timelineIndex]);

  return (
    <div className="shadow-[0_-10px_40px_rgba(139,69,19,0.45),0_-8px_25px_rgba(212,175,55,0.35),inset_0_-1px_0_rgba(255,215,0,0.25)]">
      <div className="ml-42">
        <h1
          className=" mt-18 text-3xl font-black tracking-tighter uppercase relative bg-gradient-to-b from-[#FFFACD] via-[#D4AF37] to-[#8B4513] bg-clip-text text-transparent filter shadow-2xl shadow-[#bb9457] transition-all duration-500 group-hover:drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          «-- Home
        </h1>
        {/* Ancient Dynasty Sub-Header (400 - 1200 Era) */}
        <div className="mt-1  flex-col items-start opacity-80 group-hover:opacity-100 transition-opacity duration-500">
          <span className="text-[12px] tracking-[0.3em] uppercase text-[#D4AF37] font-serif mb-1">
            The Golden Age
          </span>
          <h2
            className="text-lg font-serif italic text-[#9E6C20] font-bold tracking-widest bg-gradient-to-r from-[#8B4513] via-[#D4AF37] to-[#8B4513] bg-clip-text text-transparent animate-pulse"
            style={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            400 CE — 1200 CE
          </h2>
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#5A1E00] to-transparent mt-4 hover:bg-[#049646] " />
        </div>
      </div>
      <div className="flex min-h-screen items-start justify-center bg-[#060606] font-sans ">
        <div className="mt-38 w-7xl rounded-2xl p-10 text-center backdrop-blur-md shadow-2xl shadow-[0_0_50px_30px_rgba(75,50,40,0.7)] bg-amber-100/8 border border-[#D4AF37]/20">
          <h1
            className="text-4xl font-black uppercase  transition-all duration-700 bg-gradient-to-b from-[#FFFACD] via-[#D4AF37] to-[#8B4513] bg-clip-text text-transparent [word-spacing:0.25em]  "
            style={{
              fontFamily: "'Cinzel', serif",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Welcome to AptiCraft Tour
          </h1>
          <div className="flex items-center justify-center w-full h-full">
            <Image
              src="https://zacke.blob.core.windows.net/stock/22057-12.jpg?v=63841267635180"
              alt="Centered image"
              width={120}
              height={120}
              unoptimized
              className="object-contain shadow-lg shadow-[#bb9457] mt-18 mb-8"
            />
          </div>

          <div className="mt-14 text-center">
            <h1 className="font-display text-3xl md:text-5xl text-center text-[#977433] leading-tight mb-2 uppercase tracking-wide shadow-md shadow-[#b69121]/20 hover:text-[#C2B280] [text-shadow:-1px_-1px_0_#d1d5db,1px_-1px_0_#d1d5db,-1px_1px_0_#d1d5db,1px_1px_0_#d1d5db]">
              A Journey Of
              <br />
              <span className="font-serif italic capitalize text-5xl md:text-5xl text-[#9E6C20] py-2 hover:text-[#C2B280]">
                South Asian Pride
              </span>
            </h1>

            <div
              className="mt-12 mb-8 text-[30px] md:text-[32px] italic text-[#E8AC41] font-serif hover:text-[#8B0000] hover:bg-[#100C08] tracking-wide"
              style={{ textShadow: "0 0 4px rgba(8, 173, 30, 0.2)" }}
            >
              Historical Great Powers of South Asia
              <span className="inline-block ml-6 align-middle">
                <Image
                  src="https://www.ushistory.org/civ/images/00015532.jpg"
                  alt="Ancient scroll"
                  width={180}
                  height={180}
                  unoptimized
                  className="inline-block rounded shadow-2xl shadow-[#848482]/80 hover:shadow-[#D4AF37]/80 ml-4"
                />
              </span>
            </div>

            <div
              className="mt-4 mx-auto w-[60%] h-1"
              style={{
                borderBottom: "0.5px solid rgba(212,175,55,0.35)",
                boxShadow: "0 0 4px rgba(212,175,55,0.25)",
              }}
            />
          </div>

          {/* Coin-style navigation (NO images over text) */}
          <section className="mt-24 md:mt-24 mb-24">
            <div className=" flex items-center justify-center">
              <div className="w-3x max-w-3xl flex items-center justify-between rounded-full border border-[#b2b2b2]/20 bg-white/5 backdrop-blur-md px-2 py-2 hover:border-[#D4AF37]/40 shadow-2xl shadow-[#CCAE88]/30">
                <button
                  onClick={() =>
                    setHistoryIndex((i) => (i + 1) % historySlide.length)
                  }
                  className="coin-btn flex flex-col items-center justify-center w-32 h-32 rounded-full bg-black/40 hover:bg-black/10"
                >
                  <span className="text-[#D4AF37] font-serif tracking-widest">
                    History
                  </span>
                  <span className="text-xs text-[#E6D8A8]/70 mt-1">
                    Origins & dynasties
                  </span>
                </button>

                <button
                  onClick={() =>
                    setCultureIndex((i) => (i + 1) % cultureSlide.length)
                  }
                  className="coin-btn flex flex-col items-center justify-center w-32 h-32 rounded-full bg-black/40 hover:bg-black/10"
                >
                  <span className="text-[#D4AF37] font-serif tracking-widest">
                    Culture
                  </span>
                  <span className="text-xs text-[#E6D8A8]/70 mt-1">
                    Art & society
                  </span>
                </button>

                <button
                  onClick={() =>
                    setTimelineIndex(
                      (i) => (i + 1) % Math.max(timelineSlide.length, 1),
                    )
                  }
                  className="coin-btn flex flex-col items-center justify-center w-32 h-32 rounded-full bg-black/40 hover:bg-black/10"
                >
                  <span className="text-[#D4AF37] font-serif tracking-widest">
                    Timeline
                  </span>
                  <span className="text-xs text-[#E6D8A8]/70 mt-1">
                    Key eras
                  </span>
                </button>
              </div>
            </div>
          </section>

          {/* Framed image section with TEXT BELOW (matches Stitch example) */}
          <section className="py-24 px-6 overflow-hidden">
            <div className="max-w-[1100px] mx-auto">
              <div className="perspective-container relative mb-16">
                <div className="palace-3d-card relative overflow-hidden rounded-2xl border border-[#8A3324]/20 w-7x h-[680px] shadow-2xl shadow-[#58111A]/50">
                  {historySlide[historyIndex]?.image && (
                    <>
                      <Image
                        src={historySlide[historyIndex].image}
                        alt="South Asian historical structure (History)"
                        fill
                        sizes="120vw"
                        unoptimized
                        className="object-cover border-2 border-[#111111]" />
                      <div className="absolute inset-0 palace-overlay "></div>
                    </>
                  )}
                </div>
              </div>

              <div className="max-w-5xl mx-auto text-center space-y-6 shadow-2xl shadow-[#FDEE00]/10">
                {showHistoryText &&
                  historyText.map((p, i) => (
                    <p
                      key={i}
                      className="font-serif text-2xl md:text-2xl italic text-transparent bg-clip-text bg-gradient-to-r from-[#049646] via-[#D4AF37] to-[#049646] animate-[slideIn_2s_ease-out_forwards]" >
                      {p}
                    </p>
                  ))}
              </div>
            </div>
          </section>

          <section className="mt-24 mb-24 grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto px-4 shadow-2xl shadow-[#CCAE88]/50">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="relative h-[400px] rounded-xl overflow-hidden border border-[#D4AF37]/30 shadow-lg mt-4 mb-4" >
                {cultureSlide.length > 0 && (
                  <Image
                    src={
                      cultureSlide[(cultureIndex + i) % cultureSlide.length]
                        ?.image
                    }
                    alt="South Asian culture artifact"
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    unoptimized
                    className="object-cover"
                  />
                )}
              </div>
            ))}
          </section>

          {/* Dynasty Creation text (below 3 culture images) */}
          {creationText.length > 0 && (
            <section className="mt-16 max-w-5xl mx-auto overflow-hidden shadow-2xl shadow-[#FDEE00]/10">
              {creationText.map((p, i) => (
                <p
                  key={i}
                  className="font-serif text-xl md:text-2xl italic text-transparent bg-clip-text bg-gradient-to-r from-[#049646] via-[#D4AF37] to-[#049646] animate-[slideIn_2s_ease-out_forwards]"
                  style={{ animationDelay: `${i * 0.4}s` }} >
                  {p}
                </p>
              ))}
            </section>
          )}
        </div>
      </div>

      {/* Hero stitched layout (above slider) */}
      <section className="relative mx-auto max-w-7xl px-4 mt-42 shadow-2xl shadow-[#594026]/60">
        <div className="rounded-2xl bg-gradient-to-b from-[#2b2616]/80 to-[#0b0b0b]/90 p-10 text-center shadow-2xl border border-[#CFB53B]/20">
          <div className=" text-xl tracking-widest text-[#CD7F32] hover:text-[#BB972D] shadow-lg shadow-[#92572A]/30">
            Brief history of South Asia
          </div>
          <h2 className="mt-4 font-serif text-[42px] md:text-[56px] bg-gradient-to-r from-[#8B5A2B] via-[#C2B280] to-[#6B8E23] bg-clip-text text-transparent transition-all duration-500 hover:from-[#6B8E23] hover:via-[#D4AF37] hover:to-[#8B5A2B] hover:drop-shadow-[0_0_12px_rgba(194,178,128,0.6)]">
            Timeline of South Asian History
          </h2>
          <h2 className="text-2xl mt-6 italic text-[#993300] hover:text-[#B87E0F] tracking-wide shadow-2xl shadow-[#C59120]/60">
            Dynasties, Rulers, and Key Events
          </h2>

          <div className="mt-8 flex items-center justify-center gap-8">
            <div className="relative h-24 w-24 md:h-28 md:w-28 rounded-full bg-[#111] border border-[#CFB53B]/40 shadow-inner overflow-hidden">
              <Image
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3I5hE6PJ6Smq_KITWSddhd6kPqayOdk4QuQ&s"
                alt="Ancient South Asian coin"
                fill
                sizes="112px"
                unoptimized
                className="object-cover"
              />
            </div>
            <div className="relative h-24 w-24 md:h-28 md:w-28 rounded-full bg-[#111] border border-[#CFB53B]/40 shadow-inner overflow-hidden">
              <Image
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPOvdTSj9r4hRzy0Qsuh2zARDWsMcj10UbIQ&s"
                alt="Ancient South Asian coin"
                fill
                sizes="112px"
                unoptimized
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-24 mb-42 mx-auto max-w-8xl px-4">
        <div className="relative mb-10 w-full h-[700px] rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-[0_40px_120px_rgba(0,0,0,0.8)]">
          {timelineSlide[timelineIndex]?.image && (
            <Image
              src={timelineSlide[timelineIndex]?.image}
              alt="South Asian history"
              fill
              sizes="100vw"
              unoptimized
              className="object-cover brightness-90 contrast-[1.1]"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/70" />

          <button
            onClick={() =>
              setTimelineIndex(
                (i) =>
                  (i - 1 + Math.max(timelineSlide.length, 1)) %
                  Math.max(timelineSlide.length, 1),
              )
            }
            className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl text-[#AC9653]/70 hover:text-[#D4AF37]"
            aria-label="Previous">
            ◀
          </button>

          <button
            onClick={() =>
              setTimelineIndex(
                (i) => (i + 1) % Math.max(timelineSlide.length, 1),
              )
            }
            className="absolute right-6 top-1/2 -translate-y-1/2 text-3xl text-[#D4AF37]/70 hover:text-[#D4AF37]"
            aria-label="Next">
            ▶
          </button>
        </div>

        {showTimelineText &&
          timelineSlide[timelineIndex]?.paragraphs?.length > 0 && (
            <div className="max-w-3xl mx-auto text-center space-y-6">
              {timelineSlide[timelineIndex]?.paragraphs?.map((p, i) => (
                <p
                  key={i}
                  className="font-serif text-lg md:text-2xl text-[#E6D8A8] leading-relaxed italic"
                >
                  {p}
                </p>
              ))}
            </div>
          )}
      </section>
    </div>
  );
}
