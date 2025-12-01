import Image from "next/image";

export default function StudentCTASection() {
  return (
    <section className="w-full py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div
          className="relative w-full bg-[#F9D649] rounded-3xl overflow-hidden flex flex-col md:flex-row items-center md:items-end justify-between px-10 py-14"
        >
          {/* Decorative Background Shapes */}
          <div className="absolute left-0 top-0 w-60 h-60 bg-white/20 rounded-full -translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute right-20 bottom-0 w-[450px] h-[250px] bg-white/20 rounded-full translate-y-1/3"></div>
          <div className="absolute left-0 bottom-6 w-24 h-24 bg-white/25 rounded-full blur-md"></div>

          {/* Left Text Section */}
          <div className="relative z-10 max-w-lg text-black">
            <h2 className="text-3xl md:text-4xl font-bold leading-snug mb-4">
              Manage Your Entire Study Abroad Journey in One Place
            </h2>

            <p className="text-sm md:text-base text-black/80 mb-8">
              Search courses, shortlist programs, upload documents, track your
              application status, and book counseling sessions — everything made
              simple and fast.
            </p>

            {/* Button */}
            <button className="px-8 py-4 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition">
              Get Started as a Student
            </button>
          </div>

          {/* Right Image */}
          <div className="relative z-10 mt-10 md:mt-0 md:ml-8">
            <Image
              src="/images/site/students.png" // Replace with your image path
              alt="Student Journey"
              width={420}
              height={420}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
