import Link from 'next/link';

export default function Button({ href, children, className }) {
    return (
        <Link href={href} className={`inline-block px-6 py-3 text-white bg-blue-500 rounded hover:bg-blue-700 transition duration-300 ${className}`}>
            {children}
        </Link>
    );
}
