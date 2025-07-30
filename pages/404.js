import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center mt-20">
      <h1 className="text-5xl sm:text-5xl md:text-7xl lg:text-7xl xl:text-7xl 2xl:text-7xl font-sans font-black mb-5">
        404 - Page Not Found
      </h1>
      <p className="mb-8 text-lg">Oops! The page you are looking for does not exist.</p>
      <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Go back home
      </Link>
    </div>
  );
}
