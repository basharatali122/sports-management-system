import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  Trophy,
  Users,
  Star,
  Calendar,
  Heart,
  Award,
  Medal,
} from "lucide-react";

import MainBg from "../Assets/Main_Bg.jpg";
import SecondBg from "../Assets/Main_Bg.jpg";
import ThirdBg from "../Assets/Main_Bg.jpg";

function Home() {
  const slides = [
    {
      id: 1,
      img: MainBg,
      title: "Welcome to DigitalArena",
      subtitle:
        "Elevate your game. Join the ultimate university sports community where passion meets performance.",
    },
    {
      id: 2,
      img: SecondBg,
      title: "Compete & Conquer",
      subtitle:
        "Experience real competition. Build your legacy on the field of champions.",
    },
    {
      id: 3,
      img: ThirdBg,
      title: "Connect & Grow",
      subtitle:
        "Join teams, sharpen your skills, and shine brighter than ever before.",
    },
  ];

  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* === HERO === */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          {slides.map(
            (slide, index) =>
              index === current && (
                <motion.div
                  key={slide.id}
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1), rgba(0,0,0,0.4)), url(${slide.img})`,
                  }}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 1 }}
                />
              )
          )}
        </AnimatePresence>

        {/* Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-6 cursor-pointer md:left-10 z-20 bg-white/80 hover:bg-white text-green-600 p-3 rounded-full shadow-md transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 cursor-pointer md:right-10 z-20 bg-white/80 hover:bg-white text-green-600 p-3 rounded-full shadow-md transition"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Content */}
        <motion.div
          key={slides[current].id}
          className="relative z-10 text-center max-w-3xl px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight text-white drop-shadow-lg">
            {slides[current].title}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/90 font-light">
            {slides[current].subtitle}
          </p>
          <div className="mt-8">
            <Link
              to="/register"
              className="inline-block px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-teal-500 rounded-full shadow-md hover:scale-105 transition-transform"
            >
              Join the Movement
            </Link>
          </div>
        </motion.div>
      </section>
      {/* === ABOUT === */}
      <section className="py-20 bg-green-50">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.img
            src={MainBg}
            alt="About DigitalArena"
            className="rounded-2xl shadow-lg w-full object-cover"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          />
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black/80">
              About <span className="text-green-500">DigitalArena</span>
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              DigitalArena connects athletes, coaches, and organizers through
              one unified platform designed to inspire growth and recognition in
              university sports.
            </p>
            <p className="text-gray-700 leading-relaxed">
              From event management to player analytics — we’re redefining how
              campus sports thrive in a digital-first world.
            </p>
          </motion.div>
        </div>
      </section>
      {/* === FEATURED SPORTS === */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-black/80">
            Featured <span className="text-green-500">Sports</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Trophy />,
                title: "Football",
                desc: "Where passion meets strategy.",
              },
              {
                icon: <Medal />,
                title: "Track & Field",
                desc: "Speed and endurance combined.",
              },
              {
                icon: <Award />,
                title: "Cricket",
                desc: "The game of skill and teamwork.",
              },
              {
                icon: <Heart />,
                title: "Basketball",
                desc: "Fast-paced and exciting.",
              },
              {
                icon: <Star />,
                title: "Volleyball",
                desc: "Perfect coordination in motion.",
              },
              {
                icon: <Users />,
                title: "Badminton",
                desc: "Precision meets agility.",
              },
            ].map((sport, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6, scale: 1.03 }}
                className="p-6 rounded-xl shadow-md border bg-green-50 hover:shadow-lg transition"
              >
                <div className="flex justify-center mb-3 text-green-500">
                  {sport.icon}
                </div>
                <h3 className="text-lg font-semibold text-black mb-1">
                  {sport.title}
                </h3>
                <p className="text-sm text-gray-600">{sport.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* === UPCOMING EVENTS === */}
      <section className="py-20 bg-teal-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black/80">
            Upcoming <span className="text-green-500">Events & News</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              /* same event data as before */
              {
                title: "UST Inter-University Championship 2025",
                date: "Nov 12, 2025",
                desc: "Top universities compete in football, cricket, and athletics. Join the excitement!",
              },
              {
                title: "SportsFest 2025: Beyond Limits",
                date: "Dec 5, 2025",
                desc: "A festival of passion, performance, and persistence. Register your teams now!",
              },
              {
                title: "Coach Leadership Workshop",
                date: "Jan 15, 2026",
                desc: "Exclusive session for university coaches to enhance strategy and management skills.",
              },
            ].map((event, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                className="p-6 border rounded-xl shadow-md bg-white hover:shadow-lg transition"
              >
                <div className="flex items-center gap-2 text-green-500 mb-2">
                  <Calendar size={18} />
                  <span className="text-sm font-medium">{event.date}</span>
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-700 mb-4">{event.desc}</p>
                <button className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-600 transition">
                  Learn More
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* === TESTIMONIALS === */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-black/80">
            What <span className="text-green-500">Athletes</span> Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Khan",
                quote:
                  "DigitalArena helped me find tournaments and teammates — it's a game-changer for university athletes!",
              },
              {
                name: "Ali Raza",
                quote:
                  "As a coach, managing events and players has never been easier. Everything just works.",
              },
              {
                name: "Hina Malik",
                quote:
                  "I built my dream team and gained recognition through DigitalArena. Truly inspiring!",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-xl shadow-md border bg-green-50"
              >
                <p className="italic text-gray-700 mb-4">“{t.quote}”</p>
                <h4 className="font-semibold text-green-600">{t.name}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* === CTA === */}(
      <section className="py-20 bg-teal-50 text-black/80 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="z-10 space-y-6"
          >
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
              Your Arena Awaits {" "}
              <span className="text-black/75 font-extrabold">Join Today!</span>
            </h2>

            <p className="text-lg sm:text-xl text-gray-700">
              Be part of a thriving sports community built for growth, teamwork,
              and victory. Train with the best, play with passion, and achieve
              greatness together.
            </p>

            <Link
              to="/register"
              className="inline-block px-10 py-3 font-semibold bg-white text-green-600 rounded-full shadow-lg hover:bg-gray-100 hover:scale-105 transition-transform duration-300"
            >
              Get Started Now
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl h-[350px] sm:h-[450px] border border-gray-200"
          >
            <iframe
              title="Lahore Institute of Science and Technology Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13609.807310805875!2d74.381667!3d31.482667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391904e58b2b5d91%3A0xf2c07e3e4d1f1cf5!2sLahore%20Institute%20of%20Science%20and%20Technology%20(LIST)!5e0!3m2!1sen!2s!4v1730180032000!5m2!1sen!2s"
              width="100%"
              height="100%"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-2xl"
            ></iframe>
          </motion.div>
        </div>
      </section>
      {/* === BACK TO TOP === */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            onClick={scrollToTop}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-6 cursor-pointer right-6 p-3 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg transition"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;
