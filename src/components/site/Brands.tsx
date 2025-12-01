import Image from "next/image";

export default function AccreditationsSection() {
  return (
    <section className="w-full py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 text-center">

        {/* Heading */}
        <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-10">
          Our Accreditations & Certifications
        </h2>

        {/* Certification Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

          {/* ICEF */}
          <div className="rounded-2xl border p-6 shadow-sm hover:shadow-md transition bg-white">
            <a
              href="https://www.icef.com/agency/0012000000gOArzAAG"
              className="flex justify-center mb-3"
            >
              <Image
                src="/images/site/iceflogo.png"
                alt="Accredited by ICEF"
                width={140}
                height={140}
                className="object-contain"
              />
            </a>
            <h5 className="text-base font-semibold">Accredited by ICEF</h5>
          </div>

          {/* AIRC */}
          <div className="rounded-2xl border p-6 shadow-sm hover:shadow-md transition bg-white">
            <a
              href="https://api.accredible.com/v1/auth/invite?code=b08be99994c7060340fc&credential_id=b1a00b56-0c0a-45e2-9e5a-de3d929dcd15&url=https%3A%2F%2Fwww.credential.net%2Fb1a00b56-0c0a-45e2-9e5a-de3d929dcd15&ident=a2c0228a-15b3-484b-9817-036f76ba0e0c"
              className="flex justify-center mb-3"
            >
              <Image
                src="/images/site/airclogo.png"
                alt="Accredited by AIRC"
                width={150}
                height={150}
                className="object-contain"
              />
            </a>
            <h5 className="text-base font-semibold">Accredited by AIRC</h5>
          </div>

          {/* NAFSA */}
          <div className="rounded-2xl border p-6 shadow-sm hover:shadow-md transition bg-white">
            <a href="#" className="flex justify-center mb-3">
              <Image
                src="/images/site/nafsalogo.png"
                alt="NAFSA Member"
                width={150}
                height={150}
                className="object-contain"
              />
            </a>
            <h5 className="text-base font-semibold leading-snug">
              NAFSA Member <br />
              Membership No: 129164
            </h5>
          </div>

          {/* Study USA */}
          <div className="rounded-2xl border p-6 shadow-sm hover:shadow-md transition bg-white">
            <a
              href="https://www.trade.gov/usa-study"
              className="flex justify-center mb-3"
            >
              <Image
                src="/images/site/studyusalogo.png"
                alt="Certified by ITA"
                width={150}
                height={150}
                className="object-contain"
              />
            </a>
            <h5 className="text-base font-semibold">
              Certified by International Trade Administration
            </h5>
          </div>

        </div>
      </div>
    </section>
  );
}
