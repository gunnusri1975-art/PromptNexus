import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <h2 className="text-4xl font-bold mb-4 text-white">404 - Not Found</h2>
            <p className="text-slate-400 mb-8">Could not find requested resource</p>
            <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                Return Home
            </Link>
        </div>
    )
}
