import { Head } from "./head";
import { Navbar } from '../components/navbar';

export default function DefaultLayout({
	children,
}) {
	return (
		<div className="relative flex flex-col h-screen text-white">
			<Head />
			<main className="px-6 flex-grow place-content-center text-white">
				<Navbar />
				{children}
			</main>
			<footer className="w-full flex items-center justify-center py-3 bg-spacial-2">
				
			</footer>
		</div>
	);
}
