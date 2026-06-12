import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, BookOpen, Star, Heart, Users, CheckCircle, ChevronRight, Award, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    // Fetch latest announcements
    fetch('/api/public/announcements')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAnnouncements(data.data.slice(0, 3)); // show top 3
        }
      })
      .catch(err => console.error(err));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 80 } }
  };

  const highlights = [
    { title: 'Safe & Caring Environment', text: 'A secure and loving space for every child.', icon: Shield, color: 'bg-brandMint text-brandMint-dark border-brandMint/30' },
    { title: 'Play-Based Learning', text: 'Hands-on learning that sparks curiosity.', icon: BookOpen, color: 'bg-brandYellow text-brandYellow-dark border-brandYellow/30' },
    { title: 'Experienced Teachers', text: 'Passionate educators dedicated to growth.', icon: Star, color: 'bg-brandSky text-brandSky-dark border-brandSky/30' },
    { title: 'Holistic Development', text: 'Supporting academic, social & emotional growth.', icon: Heart, color: 'bg-brandCoral text-brandCoral-dark border-brandCoral/30' },
    { title: 'Strong Parent Partnership', text: 'Together, we build a strong foundation for success.', icon: Users, color: 'bg-brandLavender text-brandLavender-dark border-brandLavender/30' }
  ];

  const programs = [
    { name: 'INFANTS', age: '6 Weeks - 18 Months', text: 'Loving care and early learning in a nurturing environment.', color: 'bg-brandMint/10 border-brandMint/30 text-brandMint-dark' },
    { name: 'TODDLERS', age: '18 Months - 3 Years', text: 'Exploring the world through play, discovery, and imagination.', color: 'bg-brandYellow/10 border-brandYellow/30 text-brandYellow-dark' },
    { name: 'PRESCHOOL', age: '3 - 5 Years', text: 'Building skills, confidence, and a love for learning through fun.', color: 'bg-brandSky/10 border-brandSky/30 text-brandSky-dark' },
    { name: 'PRE-K', age: '4 - 6 Years', text: 'Preparing for kindergarten with hands-on learning and social growth.', color: 'bg-brandCoral/10 border-brandCoral/30 text-brandCoral-dark' }
  ];

  return (
    <div className="overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative px-4 md:px-8 py-12 md:py-20 bg-gradient-to-b from-[#FCFBF7] to-[#FAF8F5]">
        {/* Floating background shapes */}
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute top-10 left-[-50px] w-40 h-40 rounded-full bg-brandSky/15 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          className="absolute bottom-10 right-[-50px] w-60 h-60 rounded-full bg-brandCoral/15 blur-3xl pointer-events-none"
        />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 bg-brandCoral/10 text-brandCoral font-bold text-xs uppercase px-3 py-1 rounded-full border border-brandCoral/20">
              <span>Learn. Grow. Thrive.</span>
              <span className="w-1.5 h-1.5 bg-brandCoral rounded-full animate-ping" />
            </div>
            
            <motion.h1
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 100, damping: 12 }}
              className="text-4xl md:text-5xl lg:text-6xl text-slate-800 font-extrabold leading-[1.1] font-quicksand"
            >
              A Bright Start <br />
              <span className="text-brandCoral">For a Brighter</span> <br />
              Tomorrow
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-base md:text-lg text-slate-600 font-medium max-w-xl"
            >
              Nurturing curious minds and kind hearts in a safe, joyful, and inspiring environment at Pranidha International School.
            </motion.p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/contact"
                className="font-quicksand font-bold text-sm bg-brandYellow hover:bg-brandYellow-dark text-slate-800 px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                BOOK A TOUR →
              </Link>
              <Link
                to="/programs"
                className="font-quicksand font-bold text-sm bg-white hover:bg-slate-50 text-slate-700 px-8 py-3.5 rounded-full border border-orange-100 shadow-sm hover:shadow transition-all"
              >
                OUR PROGRAMS
              </Link>
            </div>
          </div>

          {/* Right Images & Badge */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-full max-w-lg">
              {/* Curved border wrapping child photo */}
              <div className="overflow-hidden rounded-3xl border-8 border-white shadow-xl rotate-[-2deg] bg-white transform hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800"
                  alt="Happy Kids in Classroom"
                  className="w-full h-[320px] md:h-[400px] object-cover"
                />
              </div>

              {/* Little Minds badge */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute bottom-[-20px] right-[-20px] bg-white border border-orange-100 rounded-full w-24 h-24 p-1.5 shadow-lg flex items-center justify-center text-center select-none"
              >
                <div className="w-full h-full rounded-full border-2 border-dashed border-brandCoral flex flex-col items-center justify-center p-1">
                  <Heart className="w-4 h-4 text-brandCoral fill-current animate-pulse" />
                  <span className="text-[8px] font-bold text-slate-600 tracking-tighter mt-1 font-quicksand leading-none">DO BIG THINGS</span>
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. HIGHLIGHTS GRID */}
      <section className="bg-white py-12 px-4 md:px-8 border-y border-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {highlights.map((hl, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="bg-[#FAF8F5] border border-orange-50 hover:border-brandCoral/20 hover:shadow-md rounded-2xl p-6 text-center shadow-sm space-y-3 flex flex-col items-center transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border shadow-inner ${hl.color}`}>
                  <hl.icon className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="font-quicksand font-bold text-sm text-slate-800 leading-snug">{hl.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{hl.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WELCOME SECTION */}
      <section className="py-16 px-4 md:px-8 bg-brandCream-light">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-5">
            <span className="font-quicksand font-bold text-xs text-brandCoral tracking-widest uppercase">Welcome to Pranidha</span>
            <h2 className="text-3xl md:text-4xl text-slate-800 font-extrabold leading-tight">
              Where Every Child Feels <br />Seen, Heard, and Valued ❤️
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              At Pranidha, we believe every child is unique. Our program syllabus is custom-tailored to inspire a lifelong love of learning while building confidence, social collaboration skills, and natural emotional intelligence.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-center space-x-2 text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-brandMint" />
                <span>Modern CCTV security coverage in all rooms</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-brandMint" />
                <span>Freshly cooked nutritious hot meals provided</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-brandMint" />
                <span>Daily interactive logs shared via Parent Portal</span>
              </div>
            </div>
            <div className="pt-4">
              <Link
                to="/about"
                className="inline-flex items-center space-x-1 font-quicksand font-bold text-sm bg-white hover:bg-orange-50/50 text-slate-700 border border-orange-100 shadow-sm px-6 py-2.5 rounded-full transition-all"
              >
                <span>LEARN MORE ABOUT US</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Photo Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=500"
                alt="Toddlers playing block games"
                className="w-full h-[220px] object-cover rounded-2xl shadow-md"
              />
              <div className="bg-brandYellow/10 border border-brandYellow/30 p-4 rounded-2xl text-center space-y-1">
                <h4 className="font-quicksand font-bold text-brandYellow-dark text-lg">1:8 Ratio</h4>
                <p className="text-xs text-slate-600">Teacher to child ensures personalized coaching</p>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="bg-brandSky/10 border border-brandSky/30 p-4 rounded-2xl text-center space-y-1">
                <h4 className="font-quicksand font-bold text-brandSky-dark text-lg">A+ Smart Labs</h4>
                <p className="text-xs text-slate-600">Smart screens and play boards for tech exploration</p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=500"
                alt="Kids playing arts"
                className="w-full h-[220px] object-cover rounded-2xl shadow-md"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 4. PROGRAMS PREVIEW */}
      <section className="py-16 bg-white px-4 md:px-8 border-t border-orange-50">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <span className="font-quicksand font-bold text-xs text-brandSky-dark tracking-widest uppercase">Our Programs</span>
          <h2 className="text-3xl md:text-4xl text-slate-800 font-extrabold">Programs for Every Stage of Growth</h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Explore our thoughtfully curated academic tracks designed to grow as your child's capabilities expand.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 text-left">
            {programs.map((prog, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className={`border rounded-3xl p-6 flex flex-col justify-between shadow-sm transition-all hover:shadow-md ${prog.color}`}
              >
                <div className="space-y-3">
                  <span className="font-bold text-xs tracking-wider">{prog.name}</span>
                  <h3 className="font-quicksand font-extrabold text-xl text-slate-800 leading-tight">{prog.age}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{prog.text}</p>
                </div>
                <div className="pt-6">
                  <Link
                    to="/programs"
                    className="inline-flex items-center space-x-1 text-xs font-bold font-quicksand hover:underline"
                  >
                    <span>LEARN MORE</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ANNOUNCEMENTS DRAWER */}
      {announcements.length > 0 && (
        <section className="bg-orange-50/50 py-12 px-4 md:px-8 border-y border-orange-100">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-quicksand font-bold text-xl text-slate-800 flex items-center space-x-2">
                <Bell className="w-5 h-5 text-brandCoral animate-bounce" />
                <span>Latest Announcements</span>
              </h3>
              <Link to="/calendar" className="text-xs font-bold text-brandCoral hover:underline font-quicksand">
                VIEW ALL NOTICE BOARD →
              </Link>
            </div>

            <div className="space-y-3">
              {announcements.map((ann) => (
                <div
                  key={ann._id}
                  className="bg-white border border-orange-100 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                >
                  <div>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block mb-1 ${
                      ann.category === 'emergency' ? 'bg-red-50 text-red-600 border border-red-100' :
                      ann.category === 'circular' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                      'bg-orange-50 text-orange-600 border border-orange-100'
                    }`}>
                      {ann.category}
                    </span>
                    <h4 className="font-quicksand font-bold text-slate-800 text-sm">{ann.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{ann.content}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                    {new Date(ann.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. TESTIMONIAL & CTA BANNER */}
      <section className="py-16 px-4 md:px-8 bg-brandCream-light">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Testimonial */}
          <div className="lg:col-span-6 bg-white border border-orange-50 rounded-3xl p-8 flex flex-col justify-between shadow-md">
            <div className="space-y-4">
              <span className="text-4xl text-brandYellow-dark font-serif">“</span>
              <p className="text-sm md:text-base italic text-slate-600 leading-relaxed font-medium">
                Pranidha has been the best decision for our family. The teachers truly care and our child looks forward to school every single day! The Parent Portal updates (with photos and nap records) keep us totally connected.
              </p>
            </div>
            
            <div className="flex items-center space-x-3 pt-6 border-t border-orange-50">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100"
                alt="Sarah Jenkins Parent"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="font-quicksand font-bold text-slate-800 text-sm">Sarah Jenkins</h4>
                <p className="text-[10px] text-slate-500 font-medium">Mother of Tommy Jenkins (Preschool)</p>
              </div>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="lg:col-span-6 bg-gradient-to-r from-[#9F92EC] to-[#A78BFA] text-white rounded-[2rem] p-8 flex flex-col justify-between shadow-xl relative overflow-hidden border-4 border-white">
            {/* Background shape */}
            <div className="absolute bottom-[-20px] right-[-20px] w-40 h-40 bg-white/20 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <h3 className="font-quicksand font-extrabold text-3xl md:text-4xl leading-tight">Ready to Get Started?</h3>
              <p className="text-sm text-purple-100 max-w-sm leading-relaxed font-semibold">
                We would love to welcome you and your child to our school family. Book a personalized private tour or apply today.
              </p>
            </div>

            <div className="pt-8 relative z-10">
              <Link
                to="/contact"
                className="font-quicksand font-bold text-sm bg-brandYellow hover:bg-brandYellow-dark text-slate-800 px-6 py-3 rounded-full transition-all inline-block shadow-md hover:shadow-lg"
              >
                BOOK A TOUR TODAY →
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 7. QUICK ADVANTAGES FOOTER BAR */}
      <section className="bg-white py-8 border-t border-orange-50 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-around gap-6 text-slate-500 text-xs font-semibold">
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4 text-brandCoral fill-current" />
            <span>Clean, Safe & Secure environment</span>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-brandYellow-dark fill-current" />
            <span>Nutritious Meals provided daily</span>
          </div>
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-brandSky" />
            <span>Daily updates sent to parents</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-brandMint" />
            <span>Flexible pick-up timetables</span>
          </div>
        </div>
      </section>

    </div>
  );
}
